var stripeHandler = StripeCheckout.configure({
    key:stripePublicKey,
    locale: 'auto', 
    token: function(token){
        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i =0; i < cartRows.length; i++){
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity = quantityElement.value
            var id = cartRow.dataset.itemId
            items.push({
                id: id,
                quantity: quantity
            })

        }

        fetch('/purchase', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                "Accept": 'application/json',
            },
            body: JSON.strongify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res){
            return res.json()
        }).then(function(data){
            alert(data.message)
            while (cartItems.hasChildNodes(){
                cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal()
            )
        )}.catch(function(error)){
            console.error(error)
        }

})

function purchaseClicked(){
    // alert('Thank you for your purchase')
    // var cartItems = document.getElementsByClassName('care-items')[0]
    // while (careItems.hasChildNodes()){
    //     cartItems.removeChild(careItems.firstChilds)
    // }
    // updateCartTotal()
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerText.replace('$','')) * 100
    stripeHandler.open(){
        amount: price
    }
}

function addToCartClicked(event){
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].innerText
    var id = shopItem.dataset.itemId
    addItemToCart(title, price, imageSrc, is)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc, id){
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++){
        if (cartItemNames[i].innerText == title){
            alert('This item is already added to the cart')
            return
        }
    }
}