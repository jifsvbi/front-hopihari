document.addEventListener('DOMContentLoaded', function() {
    const userToken = JSON.parse(localStorage.getItem('token')) || {};
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    if (userToken && userData) {
        // Atualizar nome e email
        document.getElementById('user-name').textContent = `Olá, ${userData.firstName}!`;
        document.getElementById('user-email').textContent = userData.email;
        
        // Carregar foto do perfil se existir
        if (userData.profileImage) {
            document.getElementById('user-avatar').src = userData.profileImage;
        }
    } else {
        window.location.href = '../login/login.html';
    }
    
    // Event Listeners
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../login/login.html';
    });
    
    // Ir para perfil via botão
    document.getElementById('profile-btn').addEventListener('click', function() {
        window.location.href = '../perfil/perfil.html';
    });
    
    // Ir para perfil clicando nas informações do usuário
    document.getElementById('user-info-clickable').addEventListener('click', function() {
        window.location.href = '../perfil/perfil.html';
    });
    
    // Menu toggle (se existir)
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        });
    }
    
    // Fechar menu ao clicar em um item (para mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
});