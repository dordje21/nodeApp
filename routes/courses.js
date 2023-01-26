const {Router} = require('express')
const Courses = require('../models/course')
const router = Router();

router.get('/',async (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'about.html'))
    const courses = await Courses.getAll();
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req,res) => {
    const course = await Courses.getById(req.params.id)
    res.render('course', {
        layout: 'empty',
        course
    })

})

router.get('/:id/edit', async (req, res) => {
    if(!req.query.allow == true){
        return res.redirect('/')
    }

    const course = await Courses.getById(req.params.id)

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/edit', async (req, res) => {
    await Courses.update(req.body)
    res.redirect('/courses')
})

module.exports = router