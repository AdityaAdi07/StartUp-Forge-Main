const testCaseInsensitive = async () => {
    try {
        console.log("🧪 Testing Case Insensitivity...");

        // 1. Adam Draper (lowercase) vs APPLE (uppercase)
        console.log("\n1. Checking: 'adam draper' vs 'APPLE'...");
        const res1 = await fetch('http://localhost:3000/api/coi/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                investorName: 'adam draper', // lowercase
                targetCompany: 'APPLE'      // uppercase
            })
        });
        const data1 = await res1.json();
        console.log("   Result:", data1.hasConflict ? "✅ Conflict Found" : "❌ No Conflict", JSON.stringify(data1, null, 2));

        // 2. Risk Taker vs victim corp (lowercase)
        console.log("\n2. Checking: 'Risk Taker' vs 'victim corp'...");
        const res2 = await fetch('http://localhost:3000/api/coi/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                investorName: 'Risk Taker',
                targetCompany: 'victim corp' // lowercase
            })
        });
        const data2 = await res2.json();
        console.log("   Result:", data2.hasConflict ? "✅ Conflict Found" : "❌ No Conflict", JSON.stringify(data2, null, 2));

    } catch (err) {
        console.error("Test Error:", err);
    }
};

testCaseInsensitive();
