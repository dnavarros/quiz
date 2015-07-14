var express = require('express');
var router = express.Router();
var quizController = require ('../controllers/quiz_controller.js'); //Importamos el controlador de quiz

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
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

//Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

//GET página de Créditos
router.get('/author', quizController.author);

module.exports = router;
