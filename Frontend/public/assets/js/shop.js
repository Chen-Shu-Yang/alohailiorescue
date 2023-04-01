function createCategoryCard(info) {
    const CategoryCard = `
        <div class="category" onclick="location.href='/product?category=${info.shopId}&catname=${info.shopName}'">
            <div class="cat-img">
                <img src="../assets/img/${info.shopImg}" alt="${info.shopAlt}" loading="lazy">
            </div>
            <div class="card-overlay"></div>
            <div class="cat-content">
                <h3>${info.shopName}</h3>
                <span>${info.shopDes}</span>
            </div>
        </div>
    `;

    return CategoryCard;
}

function getAllCategories() {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/shop`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            for (let i = 0; i < data.length; i++) {
                const shop = data[i];
                let shopInfo = {
                    shopId: shop.CATID,
                    shopImg: shop.CATIMG,
                    shopAlt: shop.CATIMGALT,
                    shopName: shop.CATNAME,
                    shopDes: shop.CATDES,
                };

                let categoryCard = createCategoryCard(shopInfo);
                $('#allCategories').append(categoryCard);
            }
        },
    });
}

$(document).ready(() => {
    getAllCategories();
});