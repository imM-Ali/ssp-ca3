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

//please change the connection properties to your local settings
//mysql needed to be downgraded in order to work with node.js
//      https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
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

// login page
app.get('/', function (req, res) {


    res.render('index', {
        user: "none",
        userType: 2,
        directory: __dirname,
        error: "nah",
        'signupBtnVisibility': "inline-block"
    });
});

//login 
app.post('/welcome', function (req, res) {

    //gets matching record from database based on variables sent with the request
    db.query("SELECT * FROM user WHERE userName='" + req.body.username + "' AND password='" + req.body.password + "' ", function (err, result) {
        if (err) {
            res.render("index", {
                error: err.message
            })
        }

        if (result.length > 0) {
            //getting all users
            db.query("SELECT * FROM user", function (err, innerRes) {
                var results = JSON.parse(JSON.stringify(innerRes))
                res.render("index", {
                    //sending current user and an array of all the users
                    error: "none",
                    user: result[0].userName,
                    userType: result[0].userType,
                    userId: result[0].Id,
                    'dbUsers': results,
                    'signupBtnVisibility': "none"
                })

            })


        } else {
            res.render("index", {
                user: "none"
            })
        }


    })



});

//get one user based on ID for filling edit form
app.get('/edit/(:id)', function (req, res) {

    let foundId = req.params.id;
    db.query('SELECT * FROM user WHERE Id = ' + foundId, function (err, rows, fields) {
        if (err) throw err
        // if book found
        else {

            res.send({
                user: rows[0].userName,
                Id: foundId,
                firstName: rows[0].first_Name,
                lastName: rows[0].last_Name
            })
        }
    })
})

//save one user from the edit form
app.post('/edit/(:id)', function (req, res) {

    var isadmin;
    if (req.body.isAdmin == "yes") {
        isadmin = 1;
    } else {
        isadmin = 2;
    }
    db.query(`UPDATE user SET userType = '${isadmin}', first_Name = '${req.body.firstName}', last_Name = '${req.body.lastName}', userName = '${req.body.username}' WHERE Id = ${req.body.id}`, function (error) {
        if (error) {
            res.send("Oops, something went wrong, please try again!")
        }
        else {
            res.send("Saved Successfully!")
        }
    });


})

app.delete('/delete/(:id)', function (req, res) {

    db.query(`DELETE FROM user WHERE Id = ${req.params.id}`, function (error) {
        if (error) {
            console.log(error.message)
            res.send("Oops, something went wrong, please try again!")
        }
        else {
            res.send("Deleted Successfully!")
        }
    });



})

app.post('/signup', function (req, res) {

    db.query(`INSERT INTO user (userType, first_Name, last_Name, userName, password) VALUES ('2', '${req.body.firstName}', '${req.body.lastName}', '${req.body.username}', '${req.body.password}')`, function (e) {
        if (e) {
            res.send("Sorry we could not add you at this time, try again later")
        } else {
            res.send("Welcome to our group")
        }


    });


})

