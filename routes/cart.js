const {Router} = require('express')
const Courses = require('../models/course')
const router = Router();

complitPrice = (coursesClone) => {
    return coursesClone.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Courses.findById(req.body.id)
    await req.user.addToCart(course)
    // await Cart.add(course)
    res.redirect('/cart')
})

router.get('/', async (req, res) => {
    const user = await req.user
    const userCourses = user.cart.items
    const allCourses = await Courses.find();

    let coursesClone = [];

    userCourses.forEach(c => {
        const xid = allCourses.findIndex(x => {
            return x._id.toString() === c.courseId.toString()
        })
        coursesClone.push({
            title: allCourses[xid].title,
            price: allCourses[xid].price,
            courseId: c.courseId.toString(),
            count: c.count,
            id: c._id.toString()
        })
    })

    res.render('cart', {
        title: 'Cart',
        isCard: true,
        courses: coursesClone,
        price: complitPrice(coursesClone)
    })
})

router.delete('/remove/:id', async (req, res) => {
    // const card = await Cart.remove(req.params.id)
    await req.user.removeFromCart(req.params.id)

    const user = await req.user
    const userCourses = user.cart.items
    const allCourses = await Courses.find();

    let courses = [];

    userCourses.forEach(c => {
        const xid = allCourses.findIndex(x => {
            return x._id.toString() === c.courseId.toString()
        })
        courses.push({
            title: allCourses[xid].title,
            price: allCourses[xid].price,
            courseId: c.courseId.toString(),
            count: c.count,
            id: c._id.toString()
        })
    })

    const cart = {
        courses,
        price: complitPrice(courses)
    }
    res.json(cart)
})

module.exports = router