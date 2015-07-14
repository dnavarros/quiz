//models.js construye la DB y el modelo importando (quiz.js)
//sequelize.sync() construye la DB según define el modelo.

/*- El método sequelize.sync() crea automáticamente el fichero quiz.sqlite con
la DB y sus datos iniciales, si la DB no existe. Si existe sincroniza con nuevas
definiciones del modelo, siempre que sean compatibles con anteriores.
- El callback de sequelize.sync().success(funtion(){..}) se ejecuta cuando el
fichero quiz.sqlite esta sincronizado. El código de esta función introduce en la
DB la pregunta de la versión anterior, para que todo funcione igual.
- Quiz.count().then(..) devuelve en count el número de filas de la tabla.
- Quiz.create(.. objeto ..) crea la primera pregunta y la guarda en la tabla.
Los campos de la tabla deben tener el mismo nombre que las propiedades*/

/*Adaptar models/models.js
•
La DB se configura ahora con las variables
•
•
DATABASE_URL en entornos local y heroku
DATABASE_STORAGE solo en entorno local
• En node ambas son propiedades de process.env
✦ URL de DATABASE_URL
•
•
•
El formato del URL es
•
•
Postgres: postgres://user:passwd@host:port/database
SQLite: sqlite://:@:/
Extraemos sus componentes con RegExp
•
match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/)
• que devuelve un array con los parámetros
Los parámetros se generan así bién
•
tanto para entorno local como para Heroku Postgres
✦ El entorno local con SQLite
•
©
Necesita además el parámetro storage
•
que se define con la variable DATABASE_STORAGE*/

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; // exportar tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                  });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa'
                  })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
