const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }]
    }
})

userSchema.methods.addToCart = function (course){
    const clonedItems = [...this.cart.items]
    const xid = clonedItems.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })

    if(xid >= 0){
        clonedItems[xid].count = clonedItems[xid].count + 1
    } else {
        clonedItems.push({
            courseId: course._id,
            count: 1
        })
    }

    this.cart = {items: clonedItems}
    return this.save()
}

userSchema.methods.removeFromCart = function(id){
    let items = [...this.cart.items]
    console.log(items)
    console.log(id)
    const idx = items.findIndex(c => {
        return c._id.toString() === id.toString()
    })

    if(items[idx].count == 1) {
        items = items.filter(c => c._id.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items: items}
    return this.save()
}

userSchema.methods.clearCart = function (){
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)