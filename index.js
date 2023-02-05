const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const homeRout = require('./routes/home')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const cartRout = require('./routes/cart')
const coursesRout = require('./routes/courses')
const addRout = require('./routes/add')
const authRout = require('./routes/auth')
const orderRout = require('./routes/order')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const DBPASS = 'Ckn47kkAiR3OCM9V';
const DBURL = `mongodb+srv://mikl:${DBPASS}@cluster0.bq4oh28.mongodb.net/shop?retryWrites=true&w=majority`
const User = require('./models/user')
const varMiddleWare = require('./middleware/variables')
const userMiddleWare = require('./middleware/user')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = MongoStore({
    collection: 'sessions',
    uri: DBURL
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(varMiddleWare)
app.use(userMiddleWare)
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
// app.use( async (req, res, next) => {
//     try{
//         const user = await User.findById('63d3320471f85f51b66a277e')
//         req.user = user
//         next()
//     }catch (e){
//         console.log(e)
//     }
// })
app.use('/',homeRout)
app.use('/courses',coursesRout)
app.use('/add',addRout)
app.use('/cart',cartRout)
app.use('/order',orderRout)
app.use('/auth',authRout)
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
        mongoose.set('strictQuery', true);
        await mongoose.connect(DBURL)
        const users = await User.findOne()
        if(!users){
            const user = new User({
                email: 'test@gmail.com',
                name: 'Test',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(3000, () => {
            console.log(`server started on port ${PORT}`)
        })
    }catch (err){
        console.log(err)
    }
}

start()