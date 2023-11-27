//Need to determine where to import StripeCheckout
import StripeCheckout from ejs;

//Below is code in typescript
interface CartItem {
    id: string;
    quantity: number;
}

interface Token {
    // Define the structure of the token object if needed
}

const stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: (token: Token) => {
        // console.log(token)
        const items: CartItem[] = [];
        const cartItemContainer = document.getElementsByClassName('cart-items')[0];
        const cartRows = cartItemContainer.getElementsByClassName('cart-row');

        for (let i = 0; i < cartRows.length; i++) {
            const cartRow = cartRows[i];
            const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0] as HTMLInputElement;
            const quantity = parseInt(quantityElement.value, 10);
            const id = cartRow.dataset.itemId as string;

            items.push({
                id: id,
                quantity: quantity,
            });
        }

        // Now you can use the 'items' array and 'token' object in a type-safe manner
    },
});
//***JS below
// var stripeHandler = StripeCheckout.configure({
//     key:stripePublicKey,
//     locale: 'auto', 
//     token: function(token){
//         // console.log(token)
//         var items = []
//         var cartItemContainer = document.getElementsByClassName('cart-items')[0]
//         var cartRows = cartItemContainer.getElementsByClassName('cart-row')
//         for (var i = 0; i < cartRows.length; i++ ){
//             var cartRow = cartRows[i]
//             var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
//             var quantity = quantityElement.value
//             var id = cartRow.dataset.itemId
//             items.push({
//                 id: id,
//                 quantity: quantity
//             })

//         }
//     }
// })

        // fetch('/purchase', {
        //     method: "POST",
        //     headers:{
        //         'Content-Type': 'application/json',
        //         "Accept": 'application/json',
        //     },
        //     body: JSON.strongify({
        //         stripeTokenId: token.id,
        //         items: items
        //     })
        // }).then(function(res) {
        //     return res.json()
        // }).then(function(data) {
        //     alert(data.message)
        //     while (cartItems.hasChildNodes()) {
        //         cartItems.removeChild(cartItems.firstChild)
        //     }
        //     updateCartTotal()
        // }).catch(function(error) {
        //     console.error(error)
        // })

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items,
            }),
        })
            .then((res: Response) => res.json())
            .then((data: { message: string }) => {
                alert(data.message);
                while (cartItems.hasChildNodes()) {
                    cartItems.removeChild(cartItems.firstChild);
                }
                updateCartTotal();
            })
            .catch((error: Error) => {
                console.error(error);
            });
        
    

function purchaseClicked() {
    const priceElement = document.getElementsByClassName('cart-total-price')[0] as HTMLElement;
    const price = parseFloat(priceElement.innerText.replace('$', '')) * 100;
            
    stripeHandler.open({
         amount: price,
    });
}

function removeCartItem(event: MouseEvent) {
    const buttonClicked = event.target as HTMLElement;
    buttonClicked.parentElement?.parentElement?.remove();
    updateCartTotal();
}


function addToCartClicked(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const shopItem = button.parentElement?.parentElement as HTMLElement;
    const title = shopItem.getElementsByClassName('shop-item-title')[0]?.innerText;
    const price = shopItem.getElementsByClassName('shop-item-price')[0]?.innerText;
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0]?.innerText;
    const id = shopItem.dataset.itemId;

    if (title && price && imageSrc && id) {
        addItemToCart(title, price, imageSrc, id);
        updateCartTotal();
    }
}


function addItemToCart(title: string, price: string, imageSrc: string, id: string) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    cartRow.dataset.itemId = id;

    const cartItems = document.getElementsByClassName('cart-items')[0] as HTMLElement;
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    for (let i = 0; i < cartItemNames.length; i++) {
        const cartItemTitle = cartItemNames[i] as HTMLElement;

        if (cartItemTitle.innerText === title) {
            alert('This item is already added to the cart');
            return;
        }
    }
}

