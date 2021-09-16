const express = require("express");
const sequelize = require("./sequelize");
const cors = require("cors");
const path = require("path")
require("dotenv").config({ path: '.env' });

sequelize.authenticate().then(() => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Error: ' + err);
})

const app = express();

const corsOptions = {
  origin: process.env.DEVELOMPENT_URL || '*',
  credentials: true,
  exposedHeaders: ['auth-token'] 
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use((req, res, next) => {
    if (req.headers.authorization) {
      jwt.verify(
        req.headers.authorization.split(' ')[1],
        tokenKey,
        (err, payload) => {
          if (err) next()
          else if (payload) {
            for (let user of users) {
              if (user.id === payload.id) {
                req.user = user
                next()
              }
            }
  
            if (!req.user) next()
          }
        }
      )
    }
  
    next()
  })

const PORT = process.env.PORT || 5000;

const authRoute = require("./routes/auth");
const readerRoute = require("./routes/readers");
const authorRoute = require("./routes/authors");
const bookRoute = require("./routes/books");
const historyRoute = require("./routes/history");

app.use("/api/auth", authRoute);
app.use("/api/readers", readerRoute);
app.use("/api/authors", authorRoute);
app.use("/api/books", bookRoute);
app.use("/api/history", historyRoute);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, function () {
      console.log("Сервер ожидает подключения...");
    });
  })
  .catch((err) => console.log(err));

// app.use(function (req, res, next) {
//   next(res.status(404).send("Такой страницы не существует"));
// });

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'))
  // app.use(express.static('../client/public'))

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
  })
}

module.exports = app;
