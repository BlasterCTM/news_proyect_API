const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const routes = require('./controllers/newsController')

app.use(bodyParser.json());
app.use('/', routes);

app.listen(3300, ()=>{
    console.log("Sever is now listening at port 3300");
})


