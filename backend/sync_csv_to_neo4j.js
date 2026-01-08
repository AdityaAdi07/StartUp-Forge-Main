const fs = require('fs');
const path = require('path');
const neo4j = require('neo4j-driver');

// Credentials
const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'StrongPassword123'),
    { encrypted: false }
);

// Paths to CSVs (using absolute paths based on user environment)
// Paths to CSVs (using relative paths)
const FOUNDERS_CSV = path.join(__dirname, '../rag_backend/founders_cleaned.csv');
const INVESTORS_CSV = path.join(__dirname, '../rag_backend/investors_cleaned.csv');

// Helper: Custom CSV Line Parser to handle quoted fields containing commas
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuote = !inQuote; // Toggle quote state
        } else if (char === ',' && !inQuote) {
            values.push(current.trim().replace(/^"|"$/g, '')); // Push value and strip outer quotes
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    return values;
}

// Helper: Parse Python-style literal strings to JSON
// e.g. "['Google', 'Amazon']" -> ["Google", "Amazon"]
// e.g. "{'year': 2022}" -> {"year": 2022}
function parsePythonLiteral(str) {
    if (!str || str === '[]' || str === '{}') return null;
    try {
        // Replace single quotes with double quotes, ensuring we don't break contractions if possible
        // This is a naive heuristic but works for structured data like this
        let jsonStr = str.replace(/'/g, '"');

        // Handle explicit python Types like np.str_('...') -> "..."
        jsonStr = jsonStr.replace(/np\.str_\("([^"]+)"\)/g, '"$1"');
        jsonStr = jsonStr.replace(/np\.str_\('([^']+)'\)/g, '"$1"');

        // Handle "True"/"False" to true/false
        jsonStr = jsonStr.replace(/: ?True/g, ': true').replace(/: ?False/g, ': false');

        return JSON.parse(jsonStr);
    } catch (e) {
        // console.warn("Failed to parse literal:", str);
        return null;
    }
}

const syncData = async () => {
    const session = driver.session();
    try {
        console.log("🌱 Cleaning up old graph data...");
        await session.run('MATCH (n) DETACH DELETE n');

        // ------------------------------------------------------------
        // 1. PROCESS INVESTORS
        // ------------------------------------------------------------
        console.log("💸 Processing Investors...");
        const investorData = fs.readFileSync(INVESTORS_CSV, 'utf-8');
        const investorLines = investorData.split('\n').filter(l => l.trim().length > 0);

        // Skip header (Row 0)
        for (let i = 1; i < investorLines.length; i++) {
            try {
                const cols = parseCSVLine(investorLines[i]);
                if (cols.length < 2) continue;

                const id = cols[0]; // id
                const name = cols[1]; // name
                const investmentsStr = cols[12]; // past_investments (approx index, checking...)
                // Header: id,name,...,past_investments
                // Let's verify index dynamically? No, simple csv count.
                // id=0, name=1, ..., past_investments is usually around col 12 based on the file view
                // Let's rely on parsed column structure.

                // Create Investor Node
                await session.run(`
                    MERGE (i:Investor {id: $id})
                    SET i.name = $name
                    SET i.domain = $domain
                `, { id, name, domain: cols[5] });

                const investments = parsePythonLiteral(investmentsStr);
                if (Array.isArray(investments)) {
                    for (const inv of investments) {
                        const companyName = inv.company_name;
                        if (companyName) {
                            // Link Investor -> Company
                            // We MERGE company here just in case it doesn't exist yet
                            // FIX: Propagate Investor's Primary Domain to the Company to enable Sector Overlap checks
                            await session.run(`
                                MATCH (i:Investor {id: $id})
                                MERGE (c:Company {name: $companyName})
                                MERGE (i)-[:INVESTED_IN]->(c)
                                WITH i, c
                                WHERE i.domain IS NOT NULL AND i.domain <> ""
                                MERGE (d:Domain {name: i.domain})
                                MERGE (c)-[:OPERATES_IN]->(d)
                            `, { id, companyName });
                        }
                    }
                }
            } catch (err) {
                console.error(`Error processing investor line ${i}:`, err.message);
            }
        }

        // ------------------------------------------------------------
        // 2. PROCESS FOUNDERS / COMPANIES
        // ------------------------------------------------------------
        console.log("🏢 Processing Founders & Target Companies...");
        const founderData = fs.readFileSync(FOUNDERS_CSV, 'utf-8');
        const founderLines = founderData.split('\n').filter(l => l.trim().length > 0);

        // Header: id,name,company,domain...
        for (let i = 1; i < founderLines.length; i++) {
            try {
                const cols = parseCSVLine(founderLines[i]);
                if (cols.length < 3) continue;

                // id=0, name=1 (founder name), company=2, domain=3
                // competitors=6, umbrella=8
                const companyName = cols[2];
                const domainName = cols[3];
                const competitorsStr = cols[6];
                const umbrellaStr = cols[8];

                if (!companyName) continue;

                // Create/Merge Company & Domain
                await session.run(`
                    MERGE (c:Company {name: $companyName})
                    SET c.id = $id
                    SET c.founder = $founderName, 
                        c.valuation = $valuation,
                        c.round = $round,
                        c.year = $year
                    MERGE (d:Domain {name: $domainName})
                    // FIX: Do NOT create domain from URL (cols[3])
                    // Only link if it's NOT a URL (simple heuristic)
                    // MERGE (c)-[:OPERATES_IN]->(d)
                `, {
                    id: cols[0],
                    companyName,
                    domainName,
                    founderName: cols[1],
                    valuation: parseFloat(cols[5]),
                    // Try to extract round/year from JSON, else default
                    round: parsePythonLiteral(cols[4])?.round || 'Seed',
                    year: parsePythonLiteral(cols[4])?.year || 2022
                });

                // Link Subsidary/Umbrella (Parent -> Child)
                const parents = parsePythonLiteral(umbrellaStr);
                if (Array.isArray(parents)) {
                    for (const parentName of parents) {
                        await session.run(`
                            MATCH (c:Company {name: $companyName})
                            MERGE (p:Company {name: $parentName})
                            MERGE (p)-[:HAS_SUBSIDIARY]->(c)
                        `, { companyName, parentName });
                    }
                }

                // Link Competitors
                const competitors = parsePythonLiteral(competitorsStr);
                if (Array.isArray(competitors)) {
                    for (const compName of competitors) {
                        await session.run(`
                            MATCH (c:Company {name: $companyName})
                            MERGE (comp:Company {name: $compName})
                            MERGE (c)-[:COMPETES_WITH]->(comp)
                        `, { companyName, compName });
                    }
                }

            } catch (err) {
                console.error(`Error processing founder line ${i}:`, err.message);
            }
        }

        console.log("✅ Data sync complete!");

    } catch (e) {
        console.error("❌ Sync failed:", e);
    } finally {
        await session.close();
        await driver.close();
    }
};

syncData();
