import express from "express";
import bodyParser from 'body-parser';
import module from 'path';
import mysql from 'mysql';



const __dirname = module.resolve();
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

const PORT = 4000;
var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'users'
    }

)
db.connect();




app.use(bodyParser.json());


app.use('/css', express.static(module.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(module.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(module.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static('public'));
app.use('/images', express.static('images'));


app.listen(PORT, () => {
    console.log(`Servers running on port http://localhost:${PORT}`);
})
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {

    res.render('index', {
        user: "none",
        userType: 2,
        directory: __dirname,
        error: "nah"
    });
});
app.post('/login', function(req, res) {

    db.query("SELECT * FROM user WHERE userName='" + req.body.username + "' AND password='" + req.body.password + "' ", function(err, result) {
        if (err) {
            res.render("index", {
                error: err.message
            })
        }
        if (result.length > 0) {
            res.render("index", {
                error: "none",
                user: result[0].userName,
                userType: result[0].userType
            })
        } else {
            res.render("index", {
                user: "none"
            })
        }


    })



});