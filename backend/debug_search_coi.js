// using native fetch

const testScenarios = async () => {
    try {
        console.log("🧪 Testing COI & Search...");

        // 1. Test COI: Adam Draper vs Apple
        console.log("\n1. Checking COI: Adam Draper vs Apple...");
        try {
            const coiRes = await fetch('http://localhost:3000/api/coi/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    investorName: 'Adam Draper',
                    targetCompany: 'Apple'
                })
            });
            const coiData = await coiRes.json();
            console.log("   COI Result:", JSON.stringify(coiData, null, 2));
        } catch (e) {
            console.log("   ❌ COI Check Failed to connect:", e.message);
        }

        // 2. Test Search: 'Apple'
        console.log("\n2. Searching for 'Apple' (RAG Backend)...");
        try {
            // Check Investors Index
            const searchInv = await fetch('http://127.0.0.1:8000/search/investors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: 'Apple', top_k: 3 })
            });
            const invData = await searchInv.json();
            console.log("   Search Investors Result:", JSON.stringify(invData.results, null, 2));

            // Check Founders Index
            const searchFdr = await fetch('http://127.0.0.1:8000/search/founders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: 'Apple', top_k: 3 })
            });
            const fdrData = await searchFdr.json();
            console.log("   Search Founders Result:", JSON.stringify(fdrData.results, null, 2));

        } catch (e) {
            console.log("   ❌ Search Failed to connect:", e.message);
        }

    } catch (err) {
        console.error("Test Script Error:", err);
    }
};

testScenarios();
