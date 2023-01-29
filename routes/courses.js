const {Router} = require('express')
const Courses = require('../models/course')
const router = Router();

router.get('/', async (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'about.html'))
    // const courses = await Courses.getAll();
    const courses = await Courses.find();
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res) => {
    const course = await Courses.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        course
    })

})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow == true) {
        return res.redirect('/')
    }

    const course = await Courses.findById(req.params.id)

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/delete', async (req, res) => {
    try {
        await Courses.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    }catch (e) {
        console.log(e)
    }
})

router.post('/edit', async (req, res) => {
    // await Courses.update(req.body)
    const {id} = req.body
    delete req.body.id
    await Courses.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

module.exports = router