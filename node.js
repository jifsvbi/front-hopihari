// Adicione esta rota no seu arquivo de rotas de usuários (ex: routes/usuarios.js)

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token de acesso requerido' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rota para atualizar perfil do usuário
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            firstName,
            lastName,
            email,
            telefone,
            birthDate,
            emailNotifications,
            promotions,
            currentPassword,
            password
        } = req.body;
        
        // Verificar se o usuário está tentando atualizar seu próprio perfil
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        
        // Buscar usuário atual no banco
        // Substitua pela sua query do banco de dados
        const currentUser = await getUserById(userId); // Implemente esta função
        
        if (!currentUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        // Verificar se email já existe (se estiver sendo alterado)
        if (email !== currentUser.email) {
            const emailExists = await checkEmailExists(email); // Implemente esta função
            if (emailExists) {
                return res.status(400).json({ message: 'Email já está em uso' });
            }
        }
        
        // Preparar dados para atualização
        const updateData = {
            firstName: firstName || currentUser.firstName,
            lastName: lastName || currentUser.lastName,
            email: email || currentUser.email,
            telefone: telefone || currentUser.telefone,
            birthDate: birthDate || currentUser.birthDate,
            emailNotifications: emailNotifications !== undefined ? emailNotifications : currentUser.emailNotifications,
            promotions: promotions !== undefined ? promotions : currentUser.promotions
        };
        
        // Se senha foi fornecida, verificar e atualizar
        if (password && currentPassword) {
            // Verificar senha atual
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
            
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ message: 'Senha atual incorreta' });
            }
            
            // Hash da nova senha
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }
        
        // Atualizar usuário no banco de dados
        const updatedUser = await updateUser(userId, updateData); // Implemente esta função
        
        // Remover senha da resposta
        const { password: _, ...userResponse } = updatedUser;
        
        res.json({
            message: 'Perfil atualizado com sucesso',
            user: userResponse
        });
        
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para buscar perfil do usuário
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Verificar se o usuário está tentando acessar seu próprio perfil
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        
        const user = await getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        // Remover senha da resposta
        const { password, ...userResponse } = user;
        
        res.json(userResponse);
        
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Funções auxiliares - IMPLEMENTE ESTAS CONFORME SEU BANCO DE DADOS

async function getUserById(id) {
    // Exemplo com MySQL/PostgreSQL usando algum ORM ou query builder
    // return await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    
    // Exemplo com MongoDB usando Mongoose
    // return await User.findById(id);
    
    // SUBSTITUA pela sua implementação
    console.log('Implementar getUserById para ID:', id);
    return null;
}

async function checkEmailExists(email) {
    // Exemplo com MySQL/PostgreSQL
    // const result = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    // return result.length > 0;
    
    // Exemplo com MongoDB
    // return await User.findOne({ email });
    
    // SUBSTITUA pela sua implementação
    console.log('Implementar checkEmailExists para email:', email);
    return false;
}

async function updateUser(id, updateData) {
    // Exemplo com MySQL/PostgreSQL
    // await db.query('UPDATE usuarios SET ? WHERE id = ?', [updateData, id]);
    // return await getUserById(id);
    
    // Exemplo com MongoDB
    // return await User.findByIdAndUpdate(id, updateData, { new: true });
    
    // SUBSTITUA pela sua implementação
    console.log('Implementar updateUser para ID:', id, 'dados:', updateData);
    return { id, ...updateData };
}

module.exports = router;