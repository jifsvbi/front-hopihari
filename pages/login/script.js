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
            // Salvar token e dados do usuário
            localStorage.setItem('token', JSON.stringify(data.token));
            
            // Garantir que os dados do usuário estejam completos
            const userData = {
                id: data.user.id,
                firstName: data.user.firstName || data.user.nome || '',
                lastName: data.user.lastName || data.user.sobrenome || '',
                email: data.user.email,
                telefone: data.user.telefone || '',
                birthDate: data.user.birthDate || data.user.dataNascimento || '',
                emailNotifications: data.user.emailNotifications || false,
                promotions: data.user.promotions || false,
                profileImage: data.user.profileImage || null
            };
            
            localStorage.setItem('user', JSON.stringify(userData));

            alert('Login realizado com sucesso!');
            window.location.href = '../dashboard/dashboard.html';
        } else {
            alert(`Erro: ${data.message || 'Credenciais inválidas'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
});