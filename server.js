const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;          //Por es igual a una variable ambiente que usa Heroku para setar el puerto, por defecto se pone en 3000

var app = express();   //Crea un app usando express

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials'); //En view partials se almacenan los templates de los códigos parciales


app.use((req, res, next) =>{                    //Next es un nuevo argumento creado en el middleware, si no se llama la aplicacion no sigue corriendo
    var now  = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err){
            console.log('Unable to append file');
        }
    });

    next();
});

//Para crear un middleware que me permita llevar la página a mantenimiento
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));  //__dirname es "node-web-server"


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()             //JSON funtcion to get current year
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});
//handeler for http get request
app.get('/', (req, res) => {                    // '/' es main  root de la página
    res.render('home.hbs',{
        pageTitle: 'Welcome Page',
        welcomeMessage: 'Hi, Welome to my page',
        
    })
});

app.get('/projects', (req,res) => {
    res.render('projects.hbs', {
        pageTitle: "Porject Protafolio"
    })
});

app.get('/about',  (req,res) => {
    res.render('about.hbs',{
        pageTitle: 'About Page',
    
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable handle request'
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
