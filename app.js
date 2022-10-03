import express from 'express'

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

app.get('/', (req, res) => {
    render('index')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`)
})