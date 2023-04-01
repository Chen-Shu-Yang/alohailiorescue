function preloadFormInfo() {
    const guestDevice = getCookie('device');

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/shipping-form/${guestDevice}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            if (data.length > 0) {
                const shipping = data[0];
                $("#emailForCfm").val(shipping.USER_EMAIL);
                $("#checkoutFirstName").val(shipping.FIRSTNAME);
                $("#checkoutLastName").val(shipping.LASTNAME);
                $("#checkoutAddr").val(shipping.SHIPPING_ADDRESS);
                $("#checkoutStateCountry").val(shipping.SHIPPING_STATE);
                $("#checkoutTownCity").val(shipping.SHIPPING_CITY);
                $("#checkoutPostal").val(shipping.SHIPPING_POSTAL);
                $("#checkoutPhone").val(shipping.USER_CONTACT);
            }
        },
    });
}

function preloadDeliveryInfo() {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/delivery-form`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].SHIPPING_LABEL === "Standard Shipping") {
                    $("#standardShipping").val(data[i].SHIPPINGID);
                } else if (data[i].SHIPPING_LABEL === "Local Pickup") {
                    $("#pickupAddr").val(data[i].SHIPPINGID);
                }
            }
        },
    });
}

function submitShippingDtlForm() {
    const guestDevice = getCookie('device');
    const guestEmail = $("#emailForCfm").val();
    const firstName = $("#checkoutFirstName").val();
    const lastName = $("#checkoutLastName").val();
    const address = $("#checkoutAddr").val();
    const userState = $("#checkoutStateCountry").val();
    const userCity = $("#checkoutTownCity").val();
    const userPostalCode = $("#checkoutPostal").val();
    const userPhoneNo = $("#checkoutPhone").val();

    const body = {
        guestEmail: guestEmail,
        guestDevice: guestDevice,
        firstName: firstName,
        lastName: lastName,
        address: address,
        userState: userState,
        userCity: userCity,
        userPostalCode: userPostalCode,
        userPhoneNo: userPhoneNo
    };

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/checkout/shipping-form`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function () {
            $('#shippingDtl').collapse('hide');
            $('#deliveryMethodDtl').collapse('show');
        }
    });
    return false;
}

function preloadCustomerOrder() {
    const guestDevice = getCookie('device');
    let subTotal;
    let cartTotal;
    let shippingPrice;
    $("#deliveryTypeLabel").html("");
    $("#deliveryPrice").html("");
    $("#subtotal").html("");
    $("#totalPrice").html("");

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/checkout/customer-order/${guestDevice}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (data) {
            $("#orderId").val(data[0].ORDERID);
            cartTotal = data[0].CART_TOTAL;
            if (data[0].PROMO_CODE !== "" && data[0].PROMO_CODE !== undefined) {
                $.ajax({
                    url: `${BackEndURL}/promocode/${data[0].PROMO_CODE}`,
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success(data) {
                        let discountPct = (100 - data[0].PROMO_DISCOUNT_PCT) / 100;
                        subTotal = discountPct * cartTotal;
                        $("#subtotal").append('$' + subTotal.toFixed(2));
                        $("#promocodeInput").css('display', 'none');
                        $("#promoCode").attr('disabled', 'disabled');
                        $("#promocodeCheck").text("Promocode has been applied!");
                    }
                });
            } else {
                subTotal = cartTotal;
                $("#subtotal").append('$' + cartTotal.toFixed(2));
            }
            let shippingId = data[0].SHIPPINGID;
            $.ajax({
                // headers: { authorization: `Bearer ${tmpToken}` },
                url: `${BackEndURL}/delivery-form/${shippingId}`,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: false,
                success: function (data) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].SHIPPING_LABEL === "Standard Shipping") {
                            $('#standardShipping').attr('checked', 'checked');
                        } else if (data[i].SHIPPING_LABEL === "Local Pickup") {
                            $("#pickupAddr").attr('checked', 'checked');
                        }

                        if (data[i].SHIPPINGID === shippingId) {
                            shippingPrice = data[i].SHIPPING_PRICE;
                            $("#deliveryTypeLabel").append(data[i].SHIPPING_LABEL);
                            $("#deliveryPrice").append('$' + data[i].SHIPPING_PRICE.toFixed(2));
                            return;
                        }
                    }
                }
            });
        }
    });
    let totalPrice = subTotal + shippingPrice;
    $("#totalPrice").append('$' + totalPrice.toFixed(2));
}

function createCardSmryRow(info) {
    const row = `
        <div class="smry-product">
            <img src="../assets/img/${info.productImg}" alt="">
            <div class="prod-dtl">
                <div class="dtl-header">
                    <span><b>${info.productLabel}</b></span>
                    <span>$${info.productTotalPrice}</span>
                </div>
                <span>Qty: ${info.productQuantity}</span><br>
                <span data-toggle="tooltip" data-placement="bottom" title="Size/Thickness: ${info.productVariant}">More Details
                    +</span>
            </div>
        </div>
    `;

    return row;
}

function preloadCustomerCart() {
    $("#itemCount").html("");
    const guestDevice = getCookie('device');

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/cart/${guestDevice}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success(data) {
            let itemCount;
            itemCount = data.length;
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

                let cartItemRow = createCardSmryRow(cartItemObj);
                $(".summary-prod-list").append(cartItemRow);
            }
            $("#itemCount").append(itemCount);
        },
    });
}

function changeDeliveryMethod() {
    $('.pickup-dtl').toggleClass('active');
    let ele = document.getElementsByName('deliveryMethod');
    let orderId = $("#orderId").val();

    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            let shippingId = ele[i].value;
            $.ajax({
                // headers: { authorization: `Bearer ${tmpToken}` },
                url: `${BackEndURL}/cart/shipping/${shippingId}/${orderId}`,
                type: 'PUT',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success() {
                    preloadCustomerOrder();
                },
            });
        }
    }
}

function submitCheckout() {
    const guestDevice = getCookie('device');
    const email = $("#emailForCfm").val();

    const body = {
        guestDevice: guestDevice,
        email: email
    };

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/stripe/checkout`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            window.location = data.url;
        }
    });
}

$(document).ready(() => {
    preloadFormInfo();
    preloadDeliveryInfo();
    preloadCustomerOrder();
    preloadCustomerCart();
});