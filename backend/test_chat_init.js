
async function test() {
    try {
        console.log("Testing POST /chat...");
        const res = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'x-user-id': '3', // Mark Suster
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ targetUserId: 781 }) // 1upHealth
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`✅ Success! Room Key: ${data.roomKey}`);
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
