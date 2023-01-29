const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        mapOrders = orders.map(o => {
            return{
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.course.price
                }, 0)
            }
        })
        res.render('order', {
            isOrder: true,
            title: 'Order',
            orders: mapOrders
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/', async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId');
        const courses = user.cart.items.map(c => ({
            count: c.count,
            course: {...c.courseId._doc}
        }))

        const order = new Order({
            courses: courses,
            user: {
                name: req.user.name,
                userId: req.user.id
            }
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/order')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router