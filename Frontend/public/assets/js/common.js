const buttons = document.querySelectorAll("[data-carousel-button]");
const BackEndURL = 'http://localhost:5000';
const FrontEndURL = 'http://localhost:3001';

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1;
        const slides = button.closest("[data-carousel]").querySelector("[data-slides]");
        const activeSlide = slides.querySelector("[data-active]");
        let newIndex = [...slides.children].indexOf(activeSlide) + offset;
        if (newIndex < 0) newIndex = slides.children.length - 1;
        if (newIndex >= slides.children.length) newIndex = 0;

        slides.children[newIndex].dataset.active = true;
        delete activeSlide.dataset.active;
    });
});

// slide-up script
$('.scroll-up-btn').click(function () {
    $('html').animate({ scrollTop: 0 });
});

setInterval(function () {
    $(".carousel-button.next").click()
}, 5000);

// toggle menu/navbar script
$('.menu-btn').click(function () {
    $('.navbar .menu').toggleClass("active");
    $('.menu-btn i').toggleClass("active");
});

// toggle Cart script
$('.cart-btn').click(function () {
    viewCartSidebar();
});

$('.close-cart').click(function () {
    $('.overlay').toggleClass("active");
    $('.cart').toggleClass("active");
});

$('.overlay').click(function () {
    $('.overlay').toggleClass("active");
    $('.cart').toggleClass("active");
});

// Increment/Decrement Cart Item Number
// function decrement(element) {
//     value = parseInt(element.getAttribute('value'), 10) - 1;

//     if (value <= 0) {
//         value = 0;
//     }

//     element.setAttribute('value', value);
//     element.innerHTML = value;
// }

// function increment(element) {
//     value = parseInt(element.getAttribute('value'), 10) + 1;
//     element.setAttribute('value', value);
//     element.innerHTML = value;
// }

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function createCartItemSidebar(info) {
    let card;

    if (info.productVariant !== null && info.productVariant !== 'null') {
        card = `
            <div class="cart-item">
                <img src="../assets/img/${info.productImg}" alt="">
                <div class="cart-item-content">
                    <p class="product-name">${info.productLabel}</p>
                    <p class="product-price">$${info.productTotalPrice}</p>
                    <p class="product-size">Size/Thickness: ${info.productVariant}</p>
                    <div class="counter">
                        <i class="fa-solid fa-minus" onclick="changeCartItemQuantity(${info.cartId}, ${info.productId}, ${info.productQuantity}-1, '${info.productVariant}')"></i>
                        <div class="count" id="cartItem${info.cartId}" value="${info.productQuantity}">${info.productQuantity}</div>
                        <i class="fa-solid fa-plus" onclick="changeCartItemQuantity(${info.cartId}, ${info.productId}, ${info.productQuantity}+1, '${info.productVariant}')"></i>
                    </div>
                </div>
            </div>
        `;
    } else {
        card = `
            <div class="cart-item">
                <img src="../assets/img/${info.productImg}" alt="">
                <div class="cart-item-content">
                    <p class="product-name">${info.productLabel}</p>
                    <p class="product-price">$${info.productTotalPrice}</p>
                    <div class="counter">
                        <i class="fa-solid fa-minus" onclick="changeCartItemQuantity(${info.cartId}, ${info.productId}, ${info.productQuantity}-1)"></i>
                        <div class="count" id="cartItem${info.cartId}" value="${info.productQuantity}">${info.productQuantity}</div>
                        <i class="fa-solid fa-plus" onclick="changeCartItemQuantity(${info.cartId}, ${info.productId}, ${info.productQuantity}+1)"></i>
                    </div>
                </div>
            </div>
        `;
    }

    return card;
}

function viewCartSidebar() {
    const guestDevice = getCookie('device');
    let subtotal = 0;
    $(".item-list").html("");
    $(".subtotal h4").html("");

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/cart/${guestDevice}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            if (data.length > 0) {
                $(".cart .subtotal").css("display", "block");
                for (let i = 0; i < data.length; i++) {
                    const cartItem = data[i];

                    const cartItemObj = {
                        cartId: cartItem.CARTID,
                        productId: cartItem.PRODUCTID,
                        productLabel: cartItem.PRODUCT_NAME,
                        productImg: cartItem.PRODUCT_IMG,
                        productQuantity: cartItem.QUANTITY,
                        productVariant: cartItem.PRODUCT_VARIANT,
                        productTotalPrice: cartItem.TOTAL_PRICE
                    }

                    subtotal += cartItem.TOTAL_PRICE;
                    let cartItemRow = createCartItemSidebar(cartItemObj);
                    $(".item-list").append(cartItemRow);
                }
            } else {
                $(".cart .subtotal").css("display", "none");
                $(".cart h1").html("");
                $(".cart h1").append("Cart is Empty");
            }


            $(".subtotal h4").append('$' + subtotal.toFixed(2));
            $('.overlay').toggleClass("active");
            $('.cart').toggleClass("active");
        },
    });
}

function changeCartItemQuantity(cartId, productId, quantity, productVariant) {
    if (quantity > 0) {
        const body = {
            productId: productId,
            productSize: productVariant,
            quantity: quantity
        };

        $.ajax({
            // headers: { authorization: `Bearer ${tmpToken}` },
            url: `${BackEndURL}/cart/product/${cartId}`,
            type: 'PUT',
            data: JSON.stringify(body),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success() {
                viewCartSidebar();
            },
        });
    } else {
        $.ajax({
            // headers: { authorization: `Bearer ${tmpToken}` },
            url: `${BackEndURL}/cart/${cartId}`,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success() {
                viewCartSidebar();
            },
        });
    }
    $('.overlay').toggleClass("active");
    $('.cart').toggleClass("active");
}

$(document).ready(() => {

    let device = getCookie('device');

    if (device === null || device === undefined) {
        device = uuidv4();
    }
    document.cookie = 'device=' + device + ';domain=;path=';

});