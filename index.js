import express from "express";
import bodyParser from 'body-parser';
import module from 'path';



const __dirname = module.resolve();
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

const PORT = 4000;

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
        directory: __dirname
    });
});
app.post('/login', function(req, res) {

    console.log(req.body.username)
    res.render(__dirname + "/views/index.ejs")
});