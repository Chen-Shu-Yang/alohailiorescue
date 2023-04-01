function clearCart() {
    const guestDevice = getCookie('device');

    const body = {
        guestDevice: guestDevice,
    };

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/clear/cart/${guestDevice}`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            console.log(data);
        }
    });
}

$(document).ready(() => {
    clearCart();
});