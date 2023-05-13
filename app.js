// 1  - Incovar a Express 

const express = require('express');
const app = express();

// 2 - capturar formulario ( sin urlcode nos entrega "undefined" )
app.use(express.urlencoded({ extended:false }));
// urlencoded, que se utiliza para analizar datos de formularios HTML. extended:false indica que el analizador debe utilizar el módulo querystring de Node.js para analizar los datos de formulario, lo que significa que no analizará objetos anidados.
app.use(express.json());
// app.use(express.json()) son middleware de Express.js que se utilizan para analizar las solicitudes entrantes en el servidor.


//3  - Incovar a .env
const dotenv = require('dotenv');
dotenv.config = express({path: './env/.env'});


//4 establecer  platilla 
app.set('view engine','ejs'); 
//El código app.set('view engine', 'ejs') configura el motor de vistas de una aplicación de Express para que use el motor de plantillas EJS (Embedded JavaScript) para generar HTML en el servidor.

//5 Invocamos a bcrypt
const bcrypt = require('bcryptjs');


//6 variables de session
const session = require('express-session');
app.use(session({
    //La función app.use() se utiliza para agregar middleware a la aplicación de Express, en este caso, se está utilizando para agregar el middleware de sesión. 
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//El código const session = require('express-session') y app.use(session({ secret: 'secret', resave: true, saveUninitialized: true })) se utilizan en conjunto para configurar el middleware de sesión de Express en una aplicación.

 
//secret: Una cadena utilizada para firmar la cookie de sesión, lo que hace que sea más difícil para un atacante modificar la cookie de sesión.

//resave: Un valor booleano que indica si se debe volver a guardar la sesión en el almacén de la sesión aunque no haya sido modificada durante una solicitud. true indica que se debe volver a guardar la sesión en cualquier caso.

//saveUninitialized: Un valor booleano que indica si se debe guardar una sesión aunque no tenga datos. true indica que se debe guardar la sesión en cualquier caso.

//7  establecer conxion db
const pool =  require('./database/db');

//8 establecer rutas
   app.get('/login',(req, res)=>{
    res.render('login');

   })
   app.get('/login',(req, res)=>{
    res.render('register');
   })

//9  Meto para registrar al user 

app.post('/register', async(req, res)=>{
    const fullname = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
    const age =  req.body.age;
    const birthdate = req.body.birthdate;
    let passwordHash = await bcrypt.hash(pass, 16);
    pool.query('INSERT INTO users SET?',{fullname:fullname, email:email, pass:pass, age:age, birthdate:birthdate, pass:passwordHash}, async(error, results)=>{

        if(error){
            console.log(error);
           }else{
            res.render('register',{
                alert:true,
                alertTitle: "Registracion",
                alertMessage: "!Registro Exitoso",
                alertIcon:'succes',
                showConfirmButton: false,
                timer: 1000,
                ruta: ' '
            });

           }
        
    
    });
    
})
       
//10 autenticacion
app.post('/auth', async(req, res)=>{
    const email = req.body.email;
    const pass = req.body.pass;
    let passwordHash = await bcrypt.hash(pass,16);
    if(email && pass){
        pool.query('SELECT * FROM users WHERE email = ?',[users], async(error, results , fields)=> {
            if( results.length == 0 || !(await bcrypt.compare(pass, results[0].pass)) ) {    
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "CORREO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });

            }else{
                //var de session y le asignamos true si inicia session 
                req.session.loggedin = true; 
                req.session.name = results[0].name;
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexion exitosa",
                    alertMessage: "!Correcto",
                    alertIcon: 'success', 
                    showConfirmButton: false,
                    timer: 1000,
                    ruta: '' 

                });

            }
            res.end(); 
       });
    } else {	
		res.send('Please enter user and Password!');
		res.end();
	}


});



//12 Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});


// limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // para salir aaaaaaa

	})
});


app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
});



//13 directorio de acesos 
app.use('/resources',express.static('public'));
//La primera línea de código indica que cuando un usuario solicita una URL que comienza con /resources, Express.js servirá los archivos estáticos del directorio public en la raíz del proyecto. 
app.use('/resources', express.static(__dirname + '/public'));
//El middleware express.static se utiliza para servir archivos estáticos, como archivos HTML, CSS, JavaScript, imágenes y otros recursos estáticos, en una aplicación Express.js.

