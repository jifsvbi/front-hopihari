document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const userToken = JSON.parse(localStorage.getItem('token')) || {};
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    if (!userToken || !userData) {
        window.location.href = '../login/login.html';
        return;
    }

    // Carregar dados do usuário no header
    loadUserHeader();
    
    // Carregar dados do perfil
    loadUserProfile();
    
    // Event listeners
    setupEventListeners();
});

function loadUserHeader() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    if (userData.firstName) {
        document.getElementById('user-name').textContent = `Olá, ${userData.firstName}!`;
    }
    if (userData.email) {
        document.getElementById('user-email').textContent = userData.email;
    }
}

function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    // Preencher campos do formulário
    if (userData.firstName) document.getElementById('firstName').value = userData.firstName;
    if (userData.lastName) document.getElementById('lastName').value = userData.lastName;
    if (userData.email) document.getElementById('email').value = userData.email;
    if (userData.telefone) document.getElementById('phone').value = userData.telefone;
    if (userData.birthDate) document.getElementById('birthDate').value = userData.birthDate;
    
    // Carregar preferências (valores padrão)
    document.getElementById('emailNotifications').checked = userData.emailNotifications || false;
    document.getElementById('promotions').checked = userData.promotions || false;
    
    // Carregar foto do perfil se existir
    if (userData.profileImage) {
        document.getElementById('profile-image').src = userData.profileImage;
    }
}

function setupEventListeners() {
    // Botão de voltar ao dashboard
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = '../dashboard/dashboard.html';
    });
    
    // Botão de logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../login/login.html';
    });
    
    // Botão de cancelar
    document.getElementById('cancel-btn').addEventListener('click', function() {
        loadUserProfile(); // Recarregar dados originais
    });
    
    // Upload de foto
    document.getElementById('photo-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                document.getElementById('profile-image').src = imageUrl;
                
                // Salvar no localStorage temporariamente
                const userData = JSON.parse(localStorage.getItem('user')) || {};
                userData.profileImage = imageUrl;
                localStorage.setItem('user', JSON.stringify(userData));
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Submit do formulário
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });
}

async function updateProfile() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('phone').value,
        birthDate: document.getElementById('birthDate').value,
        emailNotifications: document.getElementById('emailNotifications').checked,
        promotions: document.getElementById('promotions').checked
    };
    
    // Verificar se senhas foram preenchidas
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword) {
            alert('Digite a senha atual para alterar a senha');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Nova senha e confirmação não coincidem');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('Nova senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        formData.currentPassword = currentPassword;
        formData.password = newPassword;
    }
    
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        const userData = JSON.parse(localStorage.getItem('user'));
        
        const response = await fetch(`http://localhost:3000/usuarios/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Atualizar dados no localStorage
            const updatedUser = { ...userData, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            alert('Perfil atualizado com sucesso!');
            
            // Limpar campos de senha
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            
            // Atualizar header
            loadUserHeader();
            
        } else {
            alert(`Erro: ${data.message || 'Erro ao atualizar perfil'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
}