        document.addEventListener('DOMContentLoaded', async function() {
          const area = "mistieri";
          const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/brinquedos/area${area}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "bearer " + token
                },
            });
            
            const data = await response.json();
            console.log(data);
        });
