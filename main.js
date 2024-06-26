var cartIcon = document.querySelector('#cart-icon');
var cart = document.querySelector('.cart');
var closeCart = document.querySelector('#close-cart');

cartIcon.addEventListener('click', function() {
    cart.classList.add('active');
});

closeCart.addEventListener('click', function() {
    cart.classList.remove('active');    
});


// works

if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// making the cart empty
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('cart-remove')
    for(var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    // changing the quantity of the product
    var quantityInputs = document.getElementsByClassName('cart-quantity')
    for(var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    // adding the product to the cart
    var addToCartButtons = document.getElementsByClassName('add-cart')
    console.log(addToCartButtons)
    for(var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    // buy button
    var buyButton = document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked)
    
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.remove()
    updateCartCount()
    updateCartTotal()
}

// update the cart count

// changing the quantity of the product
function quantityChanged(event) {
    var input = event.target
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

// update the cart count
function updateCartCount() {
    var cartItemContainer = document.getElementsByClassName('cart-content')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-box');
    var total = 0;
    for(var i = 0; i < cartRows.length; i++) {
        total = total + 1;
    }
    document.getElementById('cart-count').innerText = total;
}
// adding the product to the cart
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement;
    var title = shopItem.getElementsByClassName('product-title')[0].innerText;
    var price = shopItem.getElementsByClassName('price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('product-img')[0].src

    addItemToCart(title, price, imageSrc)
    updateCartCount()
    updateCartTotal()
}
// adding the product to the cart
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-box')
    var cartItems = document.getElementsByClassName('cart-content')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-product-title')
    for(var i = 0; i < cartItemNames.length; i++) {
        if(cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return;
        }
    }
    var cartRowContents = `
    <img
    src="${imageSrc}"
    alt=""
    class="cart-img"
  />
  <div class="deltail-box">
    <div class="cart-product-title">${title}</div>
    <div class="cart-product-price">${price}</div>
    <input type="number" value="1" class="cart-quantity" />
  </div>
  <!-- remove cart -->
  <i class="bx bxs-trash-alt cart-remove"></i>
    `
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)
}
//
function buyButtonClicked() {
    var cartItems = document.getElementsByClassName('cart-content')[0]
    while(cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartCount()
    updateCartTotal()
}


function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-content')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-box')
    var total = 0
    for(var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-product-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('total-price')[0].innerText = '$' + total
}

document.addEventListener('DOMContentLoaded', async (event) => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxTk8Ez9-UQCvR7bPknsjsF08HcGahOvk866hspZul2dJz-m1k2OLPngFl64XODU3x2/exec');
        const data = await response.json();
        const categoryButtons = document.querySelectorAll('.btn-category');
        for (let button of categoryButtons) {
            button.addEventListener('click', () => {
                // Remove the active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Add the active class to the clicked button
                button.classList.add('active');
                filterProducts(button.dataset.id, data.data);
            });
        }
        // Load all products when the page loads
        filterProducts('all', data.data);
    } catch (error) {
        console.error('Error:', error);
    }
});

function filterProducts(category, products) {
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    const shopContent = document.querySelector('.shop-content');
    shopContent.innerHTML = ''; // Clear the shop content
    for (let product of filteredProducts) {
        addProductToPage(product);
    }
    // Update the cart count after all products have been loaded
    updateCartCount();
}

function addProductToPage(product) {
    var shopContent = document.querySelector('.shop-content');
    var productBox = document.createElement('div');
    productBox.classList.add('product-box');

    productBox.innerHTML = `
        <img src="${product.img}" alt="" class="product-img" />
        <h2 class="product-title">${product.productName}</h2>
        <span class="price">$${product.price}</span>
        <i class="bx bx-shopping-bag add-cart"></i>
    `;

    shopContent.appendChild(productBox);

    // Add event listener to the add-cart button
    productBox.getElementsByClassName('add-cart')[0].addEventListener('click', addToCartClicked);
}

// document.querySelector('.cart .btn-buy').addEventListener('click', () => {
//     const shopContent = document.querySelector('.shop-content');
//     const category = document.querySelector('.category');
//     shopContent.innerHTML = createCheckoutHTML();
//     category.style.display = 'none'; // Hide the category
// });

// function createCheckoutHTML() {
//     return `
//         <div class="checkout">
//             <h2>Thanh toán</h2>
//             <!-- Add your checkout form here -->
//         </div>
//     `;
// }