//IMPORTAR PAQUETES CON MIDDLEWARES
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); //Añade vistas parciales y permite incluir un marco (layout) único


//IMPORTAR ENRUTADORES
var routes = require('./routes/index');
//Se crea la aplicación
var app = express();

//INSTALAR GENERADOR DE VISTAS "EJS"
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Carga del middleware de express-partials
app.use(partials());
partials.register('/quizes/question','express');

//INSTALAR MIDDLEWARES
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//INSTALAR ENRUTADORES Y ASOCIAR RUTAS A SUS GESTORES
app.use('/', routes);

//RESTO DE RUTAS. GENERA ERROR 404 DE HTTP
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

//GESTIÓN DE ERRORES DURANTE EL DESARROLLO
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//GESTIÓN DE ERRORES DE PRODUCCIÓN
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//EXPORTAR APP PARA COMANDO DE ARRANQUE
module.exports = app;