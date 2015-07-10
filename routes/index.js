var express = require('express');
var router = express.Router();
var quizController = require ('../controllers/quiz_controller.js'); //Importamos el controlador de quiz

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//GET Pregunta y respuesta, haciendo lo que dice el controlador que hemos importado arriba
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

//GET página de Créditos
router.get('/author', quizController.author);

module.exports = router;
