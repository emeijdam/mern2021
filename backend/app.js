const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const formidableMiddleware = require('express-formidable');
const adminRoute = require('./routes/admin');
const app = express();

const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')

app.use(cors());

app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: './_UPLOADS',
    multiples: true, // req.files to be arrays of files
  }));

app.set('view engine', 'ejs');
app.set('views', './src/pages');

app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(`${__dirname}/public`)));


app.use('/', adminRoute);

const adminBro = new AdminBro({
    databases: [],
    rootPath: '/admin2',
  })

  const router = AdminBroExpress.buildRouter(adminBro)

  app.use(adminBro.options.rootPath, router)

app.post('/api/upload', (req, res, next) => {
    let fields = req.fields; // contains non-file fields
    let files = req.files; // contains files
  
    res.json({ fields, files });
  });


const port = process.env.PORT || 8080;

mongoose
    .connect(process.env.DB_HOST, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => {
        app.listen(port, () => console.log(`Server and Database running on ${port}, http://localhost:${port}`));
    })
    .catch((err) => {
        console.log(err);
    });