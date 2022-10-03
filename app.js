import express from 'express'
import mysql from 'mysql'

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
    res.render('login')
})

// login: submit form
app.post('/login', (req, res) => {

})

// signup: display form
app.get('/signup', (req, res) => {
    res.render('signup')
})

// signup: submit form
app.post('/signup', (req, res) => {

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`)
})