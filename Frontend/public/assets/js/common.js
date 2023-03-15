const buttons = document.querySelectorAll("[data-carousel-button]");

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
    $('.overlay').toggleClass("active");
    $('.cart').toggleClass("active");
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
function decrement(element) {
    value = parseInt(element.getAttribute('value'), 10)-1;

    if (value <= 0) {
        value = 0;
    }

    element.setAttribute('value', value);
    element.innerHTML = value;
}

function increment(element) {
    value = parseInt(element.getAttribute('value'), 10)+1; 
    element.setAttribute('value', value);
    element.innerHTML = value;
}

// Add to Cart
function addToCart() {
    $('.overlay').toggleClass("active");
    $('.cart').toggleClass("active");
}