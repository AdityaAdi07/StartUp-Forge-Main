
async function test() {
    try {
        console.log("Testing /inbox...");
        const res = await fetch('http://localhost:3000/inbox', {
            headers: { 'x-user-id': '3' } // Mark Suster
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`✅ Success! Got ${data.connections?.length} connections.`);
            if (data.connections?.length > 0) console.log("Sample:", data.connections[0]);
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
