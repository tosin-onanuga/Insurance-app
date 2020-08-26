const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


//middleware
app.use(morgan('tiny'));
app.use(express.json()) //req.body
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Routers

//register and login routes
app.use('/auth', require("./routes/jwtAuth"));

//dashboard router

app.use('/dashboard', require("./routes/dashboard"));

// app.use((req, res, next)=> {
//     const err = new Error();
//     error.status = 404;
//     next(err)
// });

// if(app.get("env") === "development"){
//     app.use((err, req, res, next)=> {
//         res.status(err.status || 500)
//         res.send({
//             message: err.message,
//             error: err
//         });
//     });
// }

app.listen(5000, ()=>{
    console.log('App has started at port 5000');
})
