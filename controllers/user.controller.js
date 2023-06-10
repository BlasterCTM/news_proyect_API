const client = require('../connection')
const express = require('express');
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3300;

const initializePassport = require("../passportConfig.js");
initializePassport(passport);

///fsdfsdfsdfsdf

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
    //encriptar clave
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.get("/", (req, res) => {
    res.render("index");
  });

app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.get("/users/login", checkNotAuthenticated, (req, res) => {

    console.log(req.session.flash.error);
    res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
    console.log(req.isAuthenticated());
    res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
    req.logout();
    res.render("index", { message: "Ha cerrado sesión con éxito" });
});


app.post("users/resgister", async(req, res) => {
    let {fullname, email,birthdate, age, pass, pass2} = req.body;
    
    let errors = [];

    console.log({
        fullname,
        email,
        pass,
        pass2,
    });
    // el signo de exclamación (!) se utiliza como el operador de negación lógica. Su función principal es invertir el valor de una expresión booleana.
    if (!fullname || !email ||!birthdate ||!age ||!pass || !pass2) {
        errors.push({ message: "Por favor ingrese todos los campos"});
    }

    if (pass.length < 6){
        errors.push({message: "La contraseña de tener al menos 6 caractares"})
    }

    if (pass !== pass2){
        errors.push({massage:"La contraseña no coinciden"});
    }
    
    if (errors.length > 0){
        res.render("register", { errors, fullname, email,birthdate, age, pass, pass2});
    } else {
        hashedPassword = await bcrypt.hash(pass, 16);
        console.log(hashedPassword);
        // validar

        client.query(`SELECT * FROM users WHERE email = $1 `
        [email],
        (err, results) => { 
            if(err){
                console.log(err);
            }
            console.log(results.rows);

            if(results.rows.length > 0){
                return res.render("register",{
                    message: "Correo ya registrado" 
                });
            } else {
                client.query(`INSERT INTO users(fullname, email,birthdate, age, pass)
                                VALUES($1, $2, $3, $4, $5)
                                RETURNING newsid, pass`
                        [fullname, email, birthdate, age, hashedPassword],
                        (err, results) => {
                            if(err){ throw err};
                            console.log(results.rows);
                            req.flash("success_msg", "Ahora estás registrado. Por favor Iniciar sesión");
                            res.redirect("/users/login");

                    }
                
                ); 

              }
            }                
        );
    }

});

app.post(
    "/users/login",
    passport.authenticate("local",{
        successRedirect: "/users/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true

    })
);


function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/login");
}

app.listen(PORT, () =>{

    console.log(`Server running on port ${PORT}`)
}); 
