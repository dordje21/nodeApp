const {Router} = require('express')
const router = Router();
const CourseModel = require('../models/course')

router.get('/',(req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'about.html'))
    res.render('add',{
        title: 'Add course',
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    // const course = new CourseModel(req.body.title, req.body.price, req.body.img)

    const course = new CourseModel({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (e){
        console.log(e)
    }
})

module.exports = router