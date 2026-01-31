const db = require('../config/db');


const adminController = {
    getAllUsers: async (req, res) => {
        try {
            const [users] = await db.execute('SELECT id, username, email, role FROM users');
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.params.id;
        try {
            await db.execute('DELETE FROM users WHERE id = ?', [userId]);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete user', error: error.message });
        }
    },

    addUser: async (req, res) => {
        const { username, email, password, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.create({ username, email, password: hashedPassword, role });
            res.status(201).json({ message: 'User added successfully', userId: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add user', error: error.message });
        }
    },

    getuserId: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await User
                .findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve user', error: error.message });
        }
    }

};


module.exports = adminController;