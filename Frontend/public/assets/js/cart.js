let defaultShippingPrice = 0;
let subtotal = 0;
let totalPrice = 0;
function createCartItemPage(info) {
    let card;
    
    if (info.productVariant !== null && info.productVariant !== 'null') {
        card = `
            <div class="mycart-item">
                <div class="item-dtl">
                    <img src="../assets/img/${info.productImg}" alt="">
                    <div class="content-item">
                        <p class="product-name">${info.productLabel}</p>
                        <p class="product-price">$${info.productTotalPrice}</p>
                        <p class="product-size">Size/Thickness: ${info.productVariant}</p>
                    </div>
                    <div class="counter">
                        <i class="fa-solid fa-minus" onclick="changeCartItemQuantityPage(${info.cartId}, ${info.productId}, ${info.productQuantity}-1, '${info.productVariant}')"></i>
                        <div class="count" id="#cartItemPage${info.cartId}" value="${info.productQuantity}">${info.productQuantity}</div>
                        <i class="fa-solid fa-plus" onclick="changeCartItemQuantityPage(${info.cartId}, ${info.productId}, ${info.productQuantity}+1, '${info.productVariant}')"></i>
                    </div>
                </div>
                <i class="fa-solid fa-xmark" onclick="deleteCartItem('${info.cartId}');"></i>
            </div>
            <hr>
        `;
    } else {
        card = `
            <div class="mycart-item">
                <div class="item-dtl">
                    <img src="../assets/img/${info.productImg}" alt="">
                    <div class="content-item">
                        <p class="product-name">${info.productLabel}</p>
                        <p class="product-price">$${info.productTotalPrice}</p>
                    </div>
                    <div class="counter">
                        <i class="fa-solid fa-minus" onclick="changeCartItemQuantityPage(${info.cartId}, ${info.productId}, ${info.productQuantity}-1)"></i>
                        <div class="count" id="#cartItemPage${info.cartId}" value="${info.productQuantity}">${info.productQuantity}</div>
                        <i class="fa-solid fa-plus" onclick="changeCartItemQuantityPage(${info.cartId}, ${info.productId}, ${info.productQuantity}+1)"></i>
                    </div>
                </div>
                <i class="fa-solid fa-xmark" onclick="deleteCartItem('${info.cartId}');"></i>
            </div>
            <hr>
        `;
    }
    
    return card;
}

function listCartItems() {
    const guestDevice = getCookie('device');
    $("#cart-items-list").html("");
    $(".order-summary .summary-row .overall-subtotal").html("");

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/cart/${guestDevice}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success(data) {
            if (data.length > 0) {
                $(".order-summary").css('display', 'block');
                $(".collapsible-item").css('display', 'block');
                $("#emptyCart").css('display', 'none');

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
                    let cartItemRow = createCartItemPage(cartItemObj);
                    $("#cart-items-list").append(cartItemRow);
                }
    
                $(".order-summary .summary-row .overall-subtotal").append('$' + subtotal.toFixed(2));
            } else {
                $(".order-summary").css('display', 'none');
                $(".collapsible-item").css('display', 'none');
                $("#emptyCart").css('display', 'flex');
            }
        },
    });
}

function deleteCartItem(cartId) {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/cart/${cartId}`,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            $("#totalOrderPrice").html("");
            subtotal = 0;
            listCartItems();
            totalPrice = subtotal + defaultShippingPrice;
            $("#totalOrderPrice").append('$' + totalPrice.toFixed(2));
        },
    });
}

function changeShippingType() {
    $("#shipping-label").html("");
    $("#shipping-price").html("");
    $("#totalOrderPrice").html("");
    
    defaultShippingPrice = parseFloat($("#shippingType").val());
    totalPrice = subtotal + defaultShippingPrice;
    if (defaultShippingPrice > 0) {
        $("#shipping-label").append("Standard Shipping");
        $("#shipping-price").append("$" + defaultShippingPrice.toFixed(2));
    } else {
        $("#shipping-label").append("Local Pickup");
        $("#shipping-price").append("$" + defaultShippingPrice.toFixed(2));
    }

    $("#totalOrderPrice").append("$" + totalPrice.toFixed(2));
}

function getShippingTypes() {
    // $("#shippingType").html("");
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/shipping`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success(data) {
            for (let i = 0; i < data.length; i++) {
                const shipping = data[i];

                const cartItemObj = {
                    shippingId: shipping.SHIPPINGID,
                    shippingLabel: shipping.SHIPPING_LABEL,
                    shippingDes: shipping.SHIPPING_DES,
                    shippingPrice: shipping.SHIPPING_PRICE
                }

                $("#shippingType").append(`<option value="${cartItemObj.shippingId}">${cartItemObj.shippingLabel}</option>`);
                if (i === 0) {
                    $("#shipping-label").append(cartItemObj.shippingLabel);
                    $("#shipping-price").append("$" + cartItemObj.shippingPrice);
                    defaultShippingPrice += parseFloat(cartItemObj.shippingPrice);
                }
            }
        },
    });
}

function checkout () {
    const orderNote = $("#additionalNote").val();
    const guestDevice = getCookie('device');
    const shippingId = $("#shippingType").val();
    const body = {
        deviceId: guestDevice,
        cartTotal: subtotal,
        shipping: shippingId,
        orderTotal: totalPrice,
        orderNote: orderNote
    };

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/checkout/pending`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success() {
            location.href = `${FrontEndURL}/checkout`;
        }
    });
}

function changeCartItemQuantityPage(cartId, productId, quantity, productVariant) {
    $("#totalOrderPrice").html("");
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
            async: false,
            success() {
                subtotal = 0;
                listCartItems();
            },
        });
    } else {
        $.ajax({
            // headers: { authorization: `Bearer ${tmpToken}` },
            url: `${BackEndURL}/cart/${cartId}`,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success() {
                subtotal = 0;
                listCartItems();
            },
        });
    }
    totalPrice = subtotal + defaultShippingPrice;
    $("#totalOrderPrice").append("$" + totalPrice.toFixed(2));
}

$(document).ready(() => {
    listCartItems('cart-page');
    getShippingTypes();
    totalPrice += subtotal + defaultShippingPrice;
    $("#totalOrderPrice").append('$' + totalPrice.toFixed(2));
});