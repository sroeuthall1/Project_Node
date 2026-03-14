const { getlist, getone, create, update, Delete, login, sendOTP, verifyOTP, resetPassword } = require('../controllers/userController');
const auth = require('../middleware/auth');

const User = (app) => {
    app.get('/api/user', auth, getlist);
    app.get('/api/user/:id', auth, getone);
    app.post('/api/user', create);
    app.post('/api/user/login', login);
    app.put('/api/user/:id', auth, update);
    app.delete('/api/user/:id', auth, Delete);

    app.post('/api/user/sendOTP', sendOTP);
    app.post('/api/user/verifyOTP', verifyOTP);
    app.post('/api/user/resetPassword', resetPassword);
};

module.exports = User;






