const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const handlebar = require('express-handlebars')
const homeRout = require('./routes/home')
const cardRout = require('./routes/card')
const coursesRout = require('./routes/courses')
const addRout = require('./routes/add')
const path = require('path')
const mongoose = require('mongoose')
const DBPASS = 'Ckn47kkAiR3OCM9V';
const DBURL = `mongodb+srv://mikl:${DBPASS}@cluster0.bq4oh28.mongodb.net/?retryWrites=true&w=majority`


const hbs = handlebar.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/',homeRout)
app.use('/courses',coursesRout)
app.use('/add',addRout)
app.use('/card',cardRout)
// app.get('/',(req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'index.html'))
//     res.render('index', {
//         title: 'Home',
//         isHome: true
//     })
// })

// app.get('/courses',(req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'about.html'))
//     res.render('courses',{
//         title: 'Courses',
//         isCourses: true
//     })
// })

// app.get('/add',(req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'about.html'))
//     res.render('add',{
//         title: 'Add course',
//         isAdd: true
//     })
// })

async function start(){
    try{
        await mongoose.connect(DBURL)
        app.listen(3000, () => {
            console.log(`server started on port ${PORT}`)
        })
    }catch (err){
        console.log(err)
    }
}

start()