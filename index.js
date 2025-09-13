const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const database = require('./config/database')

//============== database =============
database.connect();
//============== end database =============

const route = require("./routes/client/index.route");

// =============== PUG ================
app.set('view engine', 'pug');
app.set('views', './views')
// =============== END PUG ================

// static file
app.use(express.static("public"))
// end static file

// ============= routes ==============
route(app)
// ============= end routes ==============

// ============ START SERVER ============
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})