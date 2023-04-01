let price = [];
function createCollarProdCard(info) {
    let productCard = '';
    if (info.stockStatus != 'OUT OF STOCK') {
        productCard = `
            <div class="product-card">
                <img src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">${info.initialPrice}</p>
                <select id="collar${info.productId}" class="sizeMenu" onclick="getProductVariants('#collar${info.productId}',${info.productId});" 
                    onchange="changePrice('#collar${info.productId}', '#price${info.productId}', '${info.initialPrice}');">
                        <option value="${info.initialPrice}">Select Size</option>
                </select>
                <button class="atc-btn" onclick="addToCart('${info.productId}', '#collar${info.productId}');">Add To Cart</button>
            </div>
        `;
    } else {
        productCard = `
            <div class="product-card">
                <img src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">${info.initialPrice}</p>
                <button class="atc-btn out-of-stock" disabled>${info.stockStatus}</button>
            </div>
        `;
    }

    return productCard;
}

function createLeadProdCard(info) {
    let productCard = '';
    if (info.stockStatus != 'OUT OF STOCK') {
        productCard = `
            <div class="product-card">
                <img style="object-fit: contain;" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">$${info.initialPrice}</p>
                <select id="lead${info.productId}" class="sizeMenu" onclick="getProductVariants('#lead${info.productId}',${info.productId});" 
                    onchange="changePrice('#lead${info.productId}', '#price${info.productId}', '${info.initialPrice}');">
                        <option value="${info.initialPrice}">Select Thickness</option>
                </select>
                <button class="atc-btn" onclick="addToCart('${info.productId}', '#lead${info.productId}');">Add To Cart</button>
            </div>
        `;
    } else {
        productCard = `
            <div class="product-card">
                <img style="object-fit: contain;" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">$${info.initialPrice}</p>
                <button class="atc-btn out-of-stock" disabled>${info.stockStatus}</button>
            </div>
        `;
    }

    return productCard;
}

function createCupsProdCard(info) {
    let productCard = '';

    if (info.stockStatus != 'OUT OF STOCK') {
        productCard = `
            <div class="product-card">
                <img class="cup-img" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">${info.initialPrice}</p>
            </div>
        `;
    } else {
        productCard = `
            <div class="product-card">
                <img class="cup-img" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">${info.initialPrice}</p>
            </div>
        `;
    }

    return productCard;
}

function createAccessoriesProdCard(info) {
    let productCard = '';
    if (info.discountBy > 0) {
        if (info.stockStatus != 'OUT OF STOCK') {
            productCard = `
            <div class="product-card">
                <img class="accessories-img" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <div>
                    <span class="price cancel" id="price${info.productId}">$${info.initialPrice}</span>
                    <span class="price discount" id="discount${info.productId}">$${info.discountedPrice}</span>
                </div>
                <button class="atc-btn" onclick="addToCart('${info.productId}');">Add To Cart</button>
            </div>
        `;
        } else {
            productCard = `
            <div class="product-card">
                <img class="accessories-img" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <div>
                    <span class="price cancel" id="price${info.productId}">$${info.initialPrice}</span>
                    <span class="price discount" id="discount${info.productId}">$${info.discountedPrice}</span>
                </div>
                <button class="atc-btn out-of-stock">Add To Cart</button>
            </div>
            `;
        }
    } else {
        if (info.stockStatus != 'OUT OF STOCK') {
            productCard = `
            <div class="product-card">
                <img class="accessories-img" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">${info.initialPrice}</p>
                <button class="atc-btn" onclick="addToCart('${info.productId}');">Add To Cart</button>
            </div>
        `;
        } else {
            productCard = `
            <div class="product-card">
                <img class="accessories-img" src="../assets/img/${info.productImg}" alt="">
                <span>${info.productName}</span>
                <p id="price${info.productId}">${info.initialPrice}</p>
                <button class="atc-btn out-of-stock">Add To Cart</button>
            </div>
            `;
        }
    }

    return productCard;
}

function createSoapsProdCard(info) {
    let productCard = '';

    if (info.discountBy > 0) {
        if (info.stockStatus != 'OUT OF STOCK') {
            productCard = `
                <div class="product-card">
                    <img style="object-fit:contain;" src="../assets/img/${info.productImg}" alt="">
                    <span>${info.productName}</span>
                    <div>
                        <span class="price cancel" id="price${info.productId}">$${info.initialPrice}</span>
                        <span class="price discount" id="discount${info.productId}">$${info.discountedPrice}</span>
                    </div>
                    <button class="atc-btn" onclick="addToCart('${info.productId}');">Add To Cart</button>
                </div>
            `;
        } else {
            productCard = `
                <div class="product-card">
                    <img style="object-fit:contain;" src="../assets/img/${info.productImg}" alt="">
                    <span>${info.productName}</span>
                    <div>
                        <span class="price cancel" id="price${info.productId}">$${info.initialPrice}</span>
                        <span class="price discount" id="discount${info.productId}">$${info.discountedPrice}</span>
                    </div>
                    <button class="atc-btn out-of-stock">Add To Cart</button>
                </div>
            `;
        }
    } else {
        if (info.stockStatus != 'OUT OF STOCK') {
            productCard = `
                <div class="product-card">
                    <img style="object-fit:contain;" src="../assets/img/${info.productImg}" alt="">
                    <span>${info.productName}</span>
                    <div>
                        <p class="price" id="price${info.productId}">$${info.initialPrice}</p>
                    </div>
                    <button class="atc-btn" onclick="addToCart('${info.productId}');">Add To Cart</button>
                </div>
            `;
        } else {
            productCard = `
                <div class="product-card">
                    <img style="object-fit:contain;" src="../assets/img/${info.productImg}" alt="">
                    <span>${info.productName}</span>
                    <div>
                        <p class="price" id="price${info.productId}">$${info.initialPrice}</p>
                    </div>
                    <button class="atc-btn out-of-stock">Add To Cart</button>
                </div>
            `;
        }
    }


    return productCard;
}

function getProductVariants(sizeMenuId, productId) {
    if (!$(sizeMenuId).hasClass("active")) {
        $(sizeMenuId).addClass("active");
        $.ajax({
            // headers: { authorization: `Bearer ${tmpToken}` },
            url: `${BackEndURL}/variant/${productId}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success(data) {
                for (let x = 0; x < data.length; x++) {
                    let variant = data[x];

                    let variantInfo = {
                        productId: variant.PRODUCTID,
                        productImg: variant.PRODUCT_IMG,
                        productName: variant.PRODUCT_NAME,
                        productPrice: variant.PRODUCT_PRICE,
                        productSize: variant.PRODUCT_SIZE,
                        sizeName: variant.SIZE_NAME,
                        stockStatus: variant.STOCK_STATUS,
                        initialPrice: variant.INITIAL_PRICE,
                    };

                    price.push(variantInfo);

                    if (variant.STOCK_STATUS != 'IN STOCK') {
                        $(sizeMenuId).append(`<option value="${variant.PRODUCT_SIZE}" disabled>${variant.SIZE_NAME}</option>`);
                    } else {
                        $(sizeMenuId).append(`<option value="${variant.PRODUCT_SIZE}">${variant.SIZE_NAME}</option>`);
                    }
                }
            },
        });
    }
}

function changePrice(sizeMenuId, priceId, initialPrice) {
    $(priceId).html("");
    for (let i = 0; i < price.length; i++) {
        if ($(sizeMenuId).val() === price[i].productSize) {
            $(priceId).text('$' + price[i].productPrice);
        }
    }
    if ($(sizeMenuId).val() === initialPrice) {
        $(priceId).text(initialPrice);
    }
}

function getAllProductsByCat(categoryId, categoryName) {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/products/${categoryId}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {

            for (let x = 0; x < data.length; x++) {
                let product = data[x];

                let productInfo = {
                    productId: product.PRODUCTID,
                    productImg: product.PRODUCT_IMG,
                    productName: product.PRODUCT_NAME,
                    initialPrice: product.INITIAL_PRICE,
                    stockStatus: product.STOCK_STATUS,
                };

                let productCard;
                if (categoryName === "COLLARS") {
                    productCard = createCollarProdCard(productInfo);
                } else if (categoryName === "CUPS") {
                    productCard = createCupsProdCard(productInfo);
                } else if (categoryName === "LEADS") {
                    productCard = createLeadProdCard(productInfo);
                } else if (categoryName === "SOAPS") {
                    let discountBy = getProductDiscount(product.PRODUCTID);
                    productInfo.discountBy = discountBy;
                    productInfo.discountedPrice = parseFloat(product.INITIAL_PRICE) - discountBy;
                    productCard = createSoapsProdCard(productInfo);
                } else if (categoryName === "ACCESSORIES") {
                    let discountBy = getProductDiscount(product.PRODUCTID);
                    productInfo.discountBy = discountBy;
                    productInfo.discountedPrice = parseFloat(product.INITIAL_PRICE) - discountBy;
                    productCard = createAccessoriesProdCard(productInfo);
                }
                $('#productList').append(productCard);
            }
        },
    });
}

function getProductDiscount(productId) {
    let discountAmt = 0;
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/discount/${productId}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success(data) {
            discountAmt = parseFloat(data.DISCOUNT_AMOUNT);
        },
    });
    return discountAmt;
}

function getProductsByFilter(categoryId, sizeArr) {
    $('#productList').html("");
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/variant/filter/${categoryId}`,
        type: 'POST',
        data: JSON.stringify({ productSize: sizeArr }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            for (let x = 0; x < data.length; x++) {
                let product = data[x];

                let productInfo = {
                    productId: product.PRODUCTID,
                    productImg: product.PRODUCT_IMG,
                    productName: product.PRODUCT_NAME,
                    initialPrice: product.INITIAL_PRICE,
                    stockStatus: product.STOCK_STATUS,
                };

                let productCard = createCollarProdCard(productInfo);
                $('#productList').append(productCard);
            }
        },
    });
}

function submitFilterForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');

    var sizeArr = [];
    $('#sizeFilter').find("input:checkbox:checked").each(function (e) {
        sizeArr.push($(this).val());
    });

    getProductsByFilter(categoryId, sizeArr);
}

function clear(filterType) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');

    if (filterType === 'size') {
        $('#sizeFilter').find("input:checkbox:checked").each(function (e) {
            $(this).prop('checked', false);
        });
        getProductsByFilter(categoryId, []);
    }
}

function sortProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const categoryName = urlParams.get('catname');
    $('#productList').html("");
    let sortMenu = $("#sortMenu").val();

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/filter/${categoryId}`,
        type: 'POST',
        data: JSON.stringify({ sortBy: sortMenu }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            for (let x = 0; x < data.length; x++) {
                let product = data[x];

                let productInfo = {
                    productId: product.PRODUCTID,
                    productImg: product.PRODUCT_IMG,
                    productName: product.PRODUCT_NAME,
                    initialPrice: product.INITIAL_PRICE,
                    stockStatus: product.STOCK_STATUS,
                };

                let productCard;
                if (categoryName === "LEADS") {
                    productCard = createLeadProdCard(productInfo);
                } else if (categoryName === "SOAPS") {
                    let discountBy = getProductDiscount(product.PRODUCTID);
                    productInfo.discountBy = discountBy;
                    productInfo.discountedPrice = parseFloat(product.INITIAL_PRICE) - discountBy;
                    productCard = createSoapsProdCard(productInfo);
                } else if (categoryName === "ACCESSORIES") {
                    let discountBy = getProductDiscount(product.PRODUCTID);
                    productInfo.discountBy = discountBy;
                    productInfo.discountedPrice = parseFloat(product.INITIAL_PRICE) - discountBy;
                    productCard = createAccessoriesProdCard(productInfo);
                }

                $('#productList').append(productCard);
            }
        },
    });
}

function filterByPriceSlider(priceRange) {
    $('#productList').html("");
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/price/filter/${categoryId}`,
        type: 'POST',
        data: JSON.stringify({ priceRange: priceRange }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            for (let x = 0; x < data.length; x++) {
                let product = data[x];

                let productInfo = {
                    productId: product.PRODUCTID,
                    productImg: product.PRODUCT_IMG,
                    productName: product.PRODUCT_NAME,
                    initialPrice: product.INITIAL_PRICE,
                    stockStatus: product.STOCK_STATUS,
                };

                let discountBy = getProductDiscount(product.PRODUCTID);
                productInfo.discountBy = discountBy;
                productInfo.discountedPrice = parseFloat(product.INITIAL_PRICE) - discountBy;
                productCard = createSoapsProdCard(productInfo);
                $('#productList').append(productCard);
            }
        },
    });
}

function addToCart(productId, sizeMenuId) {
    const guestDevice = getCookie('device');
    const productVariant = $(sizeMenuId).val();
    const body = {
        productSize: productVariant,
        guestDevice: guestDevice, 
        quantity: 1
    };

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/cart/product/${productId}`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success() {
            viewCartSidebar();
        },
    });
}

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 5,
        max: 6,
        step: 0.1,
        values: [5, 6],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        },
        stop: function (event, ui) {
            filterByPriceSlider(ui.values);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));
});

$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const categoryName = urlParams.get('catname');
    $('#bannerTitle').html(categoryName);

    if (categoryName === "CUPS" || categoryName === "LEADS" || categoryName === "ACCESSORIES") {
        $(".product-filter").css("display", "none");
        $(".product-content").css("justify-content", "center");
        $(".pagination").css("justify-content", "center");
    }

    if (categoryName === "LEADS" || categoryName === "SOAPS" || categoryName === "ACCESSORIES") {
        $(".sort").css("display", "flex");
    }

    if (categoryName === "SOAPS") {
        $("#prizeRange").css("display", "block");
        $("#sizeFilter").css("display", "none");
    }
    getAllProductsByCat(categoryId, categoryName);
});