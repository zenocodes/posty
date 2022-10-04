import express from 'express'
import mysql from 'mysql'
import bcrypt from 'bcrypt'

const app = express()
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'posty'
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

// login: display form
app.get('/login', (req, res) => {
    const user = {
        email: '',
        password: ''
    }
    res.render('login', {user: user, error: false})
})

// login: submit form
app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    
    // check if account exists
    let sql = 'SELECT * FROM profile WHERE email = ?'
    connection.query(
        sql, [user.email], (error, results) => {
            if (results.length > 0) {
                // authenticate
                bcrypt.compare(user.password, results[0].password, (error, matches) => {
                    if (matches) {
                        res.send('login successful')
                    } else {
                        let message = 'Incorrect Password.'
                        res.render('login', {user: user, error: true, message: message})
                    }
                })
            } else {
                let message = 'Account does not exist.'
                res.render('login', {user: user, error: true, message: message})
            }
        }
    )
})

// signup: display form
app.get('/signup', (req, res) => {
    const user = {
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
    }
    res.render('signup', {user: user, error: false})
})

// signup: submit form
app.post('/signup', (req, res) => {
    const user = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    // check if passwords match
    if (user.password === user.confirmPassword) {
        
        
        let sql = 'SELECT * FROM profile WHERE email = ?'
        connection.query(
            sql, [user.email], (error, results) => {
                // check if user exists
                if (results.length > 0) {
                    let message = 'Account already exists with the email provided.'
                    res.render('signup', {user: user, error: true, message: message})
                } else {
                    // encrypt password
                    bcrypt.hash(user.password, 10, (error, hash) => {
                        // create account
                        let sql = 'INSERT INTO profile (fullname, email, password) VALUES (?,?,?)'
                        connection.query(
                            sql, 
                            [
                                user.fullname, 
                                user.email,
                                hash
                            ], 
                            (error, results) => {
                                res.redirect('/login')
                            }
                        )
                    })


                }
            }
        )

    } else {
        let message = 'Password Mismatch.'
        res.render('signup', {user: user, error: true, message: message})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`)
})