const {Router} = require('express')
const router = Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
    res.render('auth',{
        title: 'Auth',
        isLogin: true
    })
})

router.post('/login', async (req, res) => {

    try{
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            const areSame = password === candidate.password
            if(areSame){
                // const user = await User.findById('63d3320471f85f51b66a277e')
                // req.session.user = user
                req.session.user = candidate
                req.session.isAuth = true;
                req.session.save(err => {
                    if(err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                res.redirect('/auth')
            }
        } else {
            res.redirect('/auth')
        }
    }catch (e) {
        console.log(e)
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth')
    })
})

router.post('/register', async (req, res) => {
    console.log(req.body)
  try{
      const {email, name, password, confirmPassword } = req.body
      const candidate = await User.findOne({email})
      if(candidate){
          res.redirect('/auth')
      } else {
          const user = new User({
              email, name, password, cart: {items: []}
          })
          await user.save()
          res.redirect('/')
      }

  } catch (e) {
      console.log(e)
  }
})

module.exports = router