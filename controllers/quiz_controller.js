var models = require('../models/models.js');

// Autoload: factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if (quiz) {
        req.quiz = quiz;
        next();
      }
        else { next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error);});
};

// GET /quizes y Buscador de preguntas "search"
exports.index = function(req, res) {
var search = "%";

if(req.query.search != undefined)
{
search = "%" + req.query.search.trim() + "%";
search = search.replace(/\s+/g,"%");
}

models.Quiz.findAll({where:["upper(pregunta) like ?", search.toUpperCase()], order: 'pregunta ASC'}).

  then(
  function(quizes) {
  res.render('quizes/index', { quizes: quizes, errors: [] });
  }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: [] }); // req.quiz: instancia de quiz cargada con autoload
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
 var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
   }
   res.render(
   'quizes/answer',
   { quiz: req.quiz,
     respuesta: resultado,
     errors: []
   }
  );
};

//GET author
exports.author = function(req, res){
  res.render('author', {autor: 'David Navarro'});
}

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};

/*exports.create = function(req, res){
var quiz = models.Quiz.build( req.body.quiz );

var errors = quiz.validate();//ya qe el objeto errors no tiene then(
if (errors)
{
var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
for (var prop in errors) errores[i++]={message: errors[prop]};
res.render('quizes/new', {quiz: quiz, errors: errores});

} else {
quiz // save: guarda en DB campos pregunta y respuesta de quiz
.save({fields: ["pregunta", "respuesta"]})
.then( function(){ res.redirect('/quizes')}) ;
}
};*/
