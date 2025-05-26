document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch('http://localhost:3000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Login realizado com sucesso!');
            window.location.href = '../dashboard/dashboard.html';  // Página após login
        } else {
            alert(`Erro: ${data.message || 'Credenciais inválidas'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
}); 