const priceFormat = (price) => {
    return new Intl.NumberFormat('ua-UA', {
        currency: 'uah',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(price => {
    price.textContent = priceFormat(price.textContent)
})


const $card = document.querySelector('#card')

if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            console.log(id)

            fetch('card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(card => {
                    console.log(card)
                    if (card.courses.length) {
                        const html = card.courses.map(c => {
                            return `<tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td><div class="price">${priceFormat(c.price)}</div></td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                </td>
                            </tr>`
                        }).join('')
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.card-price').innerHTML = priceFormat(card.price);
                    } else {
                        $card.innerHTML = 'Cart id empty!'
                    }
                })
        }
    })
}