//models.js construye la DB y el modelo importando (quiz.js)
//sequelize.sync() construye la DB según define el modelo.

/*- El método sequelize.sync() crea automáticamente el fichero quiz.sqlite con
la DB y sus datos iniciales, si la DB no existe. Si existe sincroniza con nuevas
definiciones del modelo, siempre que sean compatibles con anteriores.
- El callback de sequelize.sync().success(funtion(){..}) se ejecuta cuando el
fichero quiz.sqlite esta sincronizado. El código de esta función introduce en la
DB la pregunta de la versión anterior, para que todo funcione igual.
- Quiz.count().success(..) devuelve en count el número de filas de la tabla.
- Quiz.create(.. objeto ..) crea la primera pregunta y la guarda en la tabla.
Los campos de la tabla deben tener el mismo nombre que las propiedades*/

var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null,
                       {dialect: "sqlite", storage: "quiz.sqlite"}
                    );

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
      	            respuesta: 'Roma'
      	         })
      .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
