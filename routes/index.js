var express = require('express');
var router = express.Router();
var quizController = require ('../controllers/quiz_controller.js'); //Importamos el controlador de quiz
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con :quizId
//SOLO CARGA SI EN LA RUTA HAY UN PARÁMETRO 'quizID'
/*quizController.load() se instala para que se ejecute antes que lo necesiten las rutas show y
answer y solo en el caso de que path contenga :quizId, referenciando un recurso en la tabla
Quiz de la base de datos que deba ser procesado por el controlador.
Se instala con el método param() de express (http://expressjs.com/4x/api.html#router.param),
para que router.param(‘quizId’, quizController.load) solo invoque quizController.load si
existe el parámetro :quizId está en algún lugar de la cabecera HTTP (en query, body o param).*/
router.param('quizId', quizController.load); // autoload :quizID

// Definición de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

//Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', 				         sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);

//Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

//GET página de Créditos
router.get('/author', quizController.author);

module.exports = router;
