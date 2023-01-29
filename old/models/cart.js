const path = require('path')
const fs = require('fs')

const p = path.join(__dirname, '..', 'data', 'card.json')

class Cart {
    static async add(course){
        const card = await Cart.fetch()
        const idx = card.courses.findIndex(c => c.id === course.id)
        const candidate = card.courses[idx]

        if(candidate) {
            candidate.count++
            card.courses[idx] = candidate
        } else {
            course.count = 1;
            card.courses.push(course)
        }

        card.price += +course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if(err){
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async fetch(){
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, data) =>{
                if(err){
                    reject(err)
                } else {
                    resolve(JSON.parse(data))
                }
            })
        })
    }

    static async remove(id){
        const card = await Cart.fetch()

        const xid = card.courses.findIndex(c => c.id === id)
        const course = card.courses[xid]

        if(course.count === 1){
            card.courses = card.courses.filter(c => c.id !== id)
        } else {
            card.courses[xid].count--
        }

        card.price -= course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if(err){
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }
}

module.exports = Cart