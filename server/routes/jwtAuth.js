//create an authentication system
//authentication and register route

const router = require('express').Router();
const validInfo = require('../middleware/validinfo');
const { register, login, adminLogin, is_verify } = require('../controllers/auth');

const authorization = require('../middleware/authorization');

//registration route

router.post('/register', validInfo, register);

//login route

router.post('/login', validInfo, login);
router.post('/admin_login', validInfo, adminLogin);

router.get('/is-verify', authorization, is_verify);

module.exports = router;
