
async function test() {
    try {
        console.log("Testing /api/users/founders...");
        const res = await fetch('http://localhost:3000/api/users/founders', {
            headers: { 'x-user-id': '3' } // Mark Suster ID
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`✅ Success! Got ${data.length} founders.`);
            if (data.length > 0) console.log("Sample:", data[0]);
        } else {
            console.error(`❌ Failed: ${res.status} ${res.statusText}`);
            const txt = await res.text();
            console.error(txt);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

test();
