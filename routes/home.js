const {Router} = require('express')
const router = Router();

router.get('/',(req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'index.html'))
    res.render('index', {
        title: 'Home',
        isHome: true
    })
})

router.post('/', (req, res) => {
    const name = req.body.name;

    res.render('index', {
        title: 'Home',
        isHome: true,
        name: `Hello ${name}`
    })
})

module.exports = router