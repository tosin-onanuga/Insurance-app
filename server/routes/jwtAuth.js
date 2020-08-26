//create an authentication system
//authentication and register route

const router = require('express').Router();
const validInfo = require('../middleware/validinfo');
const { register, login, is_verify } = require('../controllers/auth');

const authorization = require('../middleware/authorization');

//registration route

router.post('/register', validInfo, register);

//login route

router.post('/login', validInfo, login);

router.get('/is-verify', authorization,is_verify );

module.exports = router;
