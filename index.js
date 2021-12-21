import express from "express";
import bodyParser from 'body-parser';
import module from 'path';


const __dirname = module.resolve();
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.use('/css', express.static(module.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(module.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(module.join(__dirname, 'node_modules/jquery/dist')))


app.listen(PORT, () => {
    console.log(`Servers running on port http://localhost:${PORT}`);
})

app.get('/', function(req, res) {
    res.sendFile(module.join(__dirname + '/views/index.html'));
    //__dirname : It will resolve to your project folder.
});