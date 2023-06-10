const LocalStrategy = require("passport-local").Strategy;
const { client } = require("./connection");
const bcrypt = require("bcrypt");

function initialize(passport) {
    console.log("Initialized");
    
    const authenticateUser = (email, pass, done) =>{
        console.log(email, pass);
        client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);

                if (results.rows.length > 0){
                    const user = results.rows[0];

                    bcrypt.compare(pass, user.pass, (err, isMatch) => {
                        if (err){
                            console.log(err);
                        }
                        if (isMatch){
                            return done(null, user)
                        } else{
                            return done(null, false, {message: "Contraseña incorrecta"});
                        }
                    });
                } else {
                    return done(null, false, {
                        message: "Ningún usuario con esa dirección de correo electrónico"

                    });
                    
                }

            }
        ); 

    };

    passport.use(
        new LocalStrategy(
            { usernameField: "email", passwordField: "pass"},
            authenticateUser
        )
    );

    passport.deserializeUser((id, done) => {
        client.query(`SELECT * FROM users WHERE newsid = $1`,[id], (err, results) => {
            if (err) {return done(err);}
            console.log(`La id es ${result.rows[0].id}`)
            return done(null, results.rows[0]);
        }); 
    });







} 

module.exports = initialize;
