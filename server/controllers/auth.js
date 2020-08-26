const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utilis/jwtGenerator');



const register = async (req, res) => {
  try {
    //1. descructure the req.body(name etc)
    const { firstName, lastName, email, password } = req.body;

    //         //2. check if user exist(if user exist throw error)
    const user = await pool.query('SELECT * FROM users WHERE user_email =$1', [
      email,
    ]);
    // res.json(user.rows)

    if (user.rows.length !== 0) {
      return res.status(401).json('user already exist');
    }
    //         //3. Bcrypt the user password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //         //4. enter the new user inside our database
    const newUser = await pool.query(
      'INSERT INTO users (user_firstName, user_lastName, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, bcryptPassword]
    );
    // console.log('newUser', newUser);
    // return res.json(newUser.rows[0]);

    //         //5. generating our jwt token

    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};

const login = async(req, res) => {

    try {
        //1. destructure the req.body
    
        const { email, password } = req.body;
        //2. check if user doesnt exist (if not then throw error)
        const user = await pool.query('SELECT * FROM users WHERE user_email= $1', [
          email,
        ]);
        if (user.rows.length === 0) {
          return res.status(401).json('Password or Email is incorrect');
        }
        //3. check if incoming password is the same as database
        const validPassword = await bcrypt.compare(
          password,
          user.rows[0].user_password
        );
    
        if (!validPassword) {
          return res.status(401).json('Password or Email incorrect');
        }
    
        //4. give them jwt token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
      }
};

const is_verify = async(req,res)=>{
    try {
        res.json(true);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
      }
}

module.exports  = {register, login, is_verify};
