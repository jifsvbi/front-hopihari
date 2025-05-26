document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Salvar dados do usuário no localStorage (para demonstração)
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirecionar para a página principal (após login bem-sucedido)
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