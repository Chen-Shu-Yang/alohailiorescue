//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');

const Shop = {
    // Get All Product Categories
    getAllCategories(callback) {
        const sql = 'SELECT * FROM alohailiorescue.shop_categories;';
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get All Products
    getAllProducts(categoryId, callback) {
        const sql = `SELECT * FROM alohailiorescue.shop_products WHERE CATID = ?`;
        pool.query(sql, [categoryId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get Size Variants
    getProductVariants(productId, callback) {
        const sql = `SELECT * FROM alohailiorescue.product_size WHERE PRODUCTID = ?;`;
        pool.query(sql, [productId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Filter Products By Size Variants
    getProductBySize(categoryId, productSize, callback) {
        const sql = `
            SELECT 
                P.*, S.PRODUCT_SIZE, S.SIZE_NAME
            FROM
                alohailiorescue.product_size AS S, 
                alohailiorescue.shop_products AS P
            WHERE
                S.CATID = ? AND S.PRODUCT_SIZE IN( ? ) AND
                PRODUCT_STOCK <> 0 AND P.PRODUCTID = S.PRODUCTID
            GROUP BY
                P.PRODUCT_NAME;
        `;
        pool.query(sql, [categoryId, productSize], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Sort Product List
    sortProductList(categoryId, sortBy, callback) {
        let sql = '';
        if (sortBy === 'newest') {
            sql = `SELECT * FROM alohailiorescue.shop_products WHERE CATID = ? ORDER BY CREATED_ON DESC;`;
        } else if (sortBy === 'L-H Price') {
            sql = `SELECT * FROM alohailiorescue.shop_products WHERE CATID = ? ORDER BY INITIAL_PRICE, DISCOUNT ASC`;
        } else if (sortBy === 'H-L Price') {
            sql = `SELECT * FROM alohailiorescue.shop_products WHERE CATID = ? ORDER BY INITIAL_PRICE, DISCOUNT DESC`;
        } else if (sortBy === 'A-Z') {
            sql = `SELECT * FROM alohailiorescue.shop_products WHERE CATID = ? ORDER BY PRODUCT_NAME ASC;`;
        } else if (sortBy === 'Z-A') {
            sql = `SELECT * FROM alohailiorescue.shop_products WHERE CATID = ? ORDER BY PRODUCT_NAME DESC;`;
        } else if (sortBy === '' || sortBy === undefined) {
            sql = `SELECT * FROM alohailiorescue.shop_products WHERE CATID = ?;`;
        }
        
        pool.query(sql, [categoryId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get Discounted Product Price
    getProductDiscount(productId, callback) {
        const sql = `SELECT DISCOUNT_AMOUNT FROM alohailiorescue.product_discounts WHERE PRODUCTID = ?;`;
        pool.query(sql, [productId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Filter Products By Size Variants
    filterProductsByPrice(categoryId, priceStart, priceEnd, callback) {
        const sql = `
            SELECT
                P.*, D.DISCOUNTED_PRICE, D.DISCOUNT_AMOUNT
            FROM
                alohailiorescue.product_discounts AS D, 
                alohailiorescue.shop_products AS P
            WHERE
                P.CATID = ? AND P.PRODUCTID = D.PRODUCTID
                AND D.DISCOUNTED_PRICE >= ? AND D.DISCOUNTED_PRICE <= ?
        `;
        pool.query(sql, [categoryId, priceStart, priceEnd], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get All Cart Items by deviceId
    getCartItemsByDeviceId(deviceId, callback) {
        const sql = `
            SELECT
                C.CARTID, C.PRODUCTID, P.PRODUCT_NAME, P.PRODUCT_IMG,
                C.QUANTITY, C.PRODUCT_VARIANT, C.TOTAL_PRICE, C.CREATED_ON
            FROM
                alohailiorescue.customer_carts AS C,
                alohailiorescue.users AS U,
                alohailiorescue.shop_products AS P
            WHERE
                C.PRODUCTID = P.PRODUCTID AND
                C.USERID = U.USERID AND
                CART_STATUS IN('Pending', 'Checkout') AND
                U.USER_DEVICE = ?;
        `;
        pool.query(sql, [deviceId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get product info to be added into cart
    getProductForAddCart(productId, productSize, callback) {
        let sql;
        let placeholder = [];
        if (productSize !== undefined) {
            sql = `
                SELECT 
                    P.PRODUCTID, P.CATID, P.PRODUCT_NAME, P.PRODUCT_IMG,
                    S.PRODUCT_PRICE, D.DISCOUNT_LABEL, D.DISCOUNT_AMOUNT, D.DISCOUNTED_PRICE
                FROM
                    alohailiorescue.shop_products AS P
                LEFT JOIN
                    alohailiorescue.product_size AS S ON P.PRODUCTID = S.PRODUCTID
                LEFT JOIN
                    alohailiorescue.product_discounts AS D ON P.PRODUCTID = D.PRODUCTID
                WHERE
                    P.PRODUCTID = ? AND S.PRODUCT_SIZE = ?;
            `;
            placeholder.push(productId);
            placeholder.push(productSize);
        } else {
            sql = `
                SELECT 
                    P.PRODUCTID, P.CATID, P.PRODUCT_NAME, P.PRODUCT_IMG,
                    S.PRODUCT_PRICE, D.DISCOUNT_LABEL, D.DISCOUNT_AMOUNT, D.DISCOUNTED_PRICE
                FROM
                    alohailiorescue.shop_products AS P
                LEFT JOIN
                    alohailiorescue.product_size AS S ON P.PRODUCTID = S.PRODUCTID
                LEFT JOIN
                    alohailiorescue.product_discounts AS D ON P.PRODUCTID = D.PRODUCTID
                WHERE
                    P.PRODUCTID = ?;
            `;
            placeholder.push(productId);
        }
        
        pool.query(sql, placeholder, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Add Selected Products to Cart
    addProductToCart(userId, productId, quantity, totalPrice, productSize, callback) {
        const sql = `
            INSERT INTO 
                alohailiorescue.customer_carts (USERID, PRODUCTID, QUANTITY, TOTAL_PRICE, PRODUCT_VARIANT)
            VALUES 
                (?,?,?,?,?);
        `;
        pool.query(sql, [userId, productId, quantity, totalPrice, productSize], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get cart product check for quantity
    checkCartProdQuantity(userId, productId, productVariant, callback) {
        console.log(productVariant);
        let sql;
        let placeholder = [];
        if (productVariant !== undefined) {
            sql = `SELECT CARTID, QUANTITY FROM alohailiorescue.customer_carts WHERE USERID = ? AND PRODUCTID = ? AND PRODUCT_VARIANT = ? AND CART_STATUS IN('Pending', 'Checkout');`;
            placeholder.push(userId);
            placeholder.push(productId);
            placeholder.push(productVariant);
        } else {
            sql = `SELECT CARTID, QUANTITY FROM alohailiorescue.customer_carts WHERE USERID = ? AND PRODUCTID = ? AND CART_STATUS IN('Pending', 'Checkout');`;
            placeholder.push(userId);
            placeholder.push(productId);
        }
        pool.query(sql, placeholder, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Update quantity of cart product
    incrementQuantity(quantity, totalPrice, cartId, callback) {
        const sql = `UPDATE alohailiorescue.customer_carts SET QUANTITY = ?, TOTAL_PRICE = ? WHERE CARTID = ?;`;
        pool.query(sql, [quantity, totalPrice, cartId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get cart product check for quantity
    getShippingTypes(callback) {
        const sql = `SELECT * FROM alohailiorescue.shipping_types;`;
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get Cart Item
    getCartItem(cartId, callback) {
        const sql = `SELECT * FROM alohailiorescue.customer_carts WHERE CARTID = ? AND CART_STATUS IN('Pending', 'Checkout');`;
        pool.query(sql, [cartId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Delete Cart Item
    deleteCartItem(cartId, callback) {
        const sql = `DELETE FROM alohailiorescue.customer_carts WHERE CARTID = ?;`;
        pool.query(sql, [cartId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get pending order by user
    getPendingOrderByUser(userId, callback) {
        const sql = `SELECT * FROM alohailiorescue.customer_order WHERE ORDER_STATUS = 'P' AND USERID = ?;`;
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get pending order by order Id
    getPendingOrderById(orderId, callback) {
        const sql = `SELECT * FROM alohailiorescue.customer_order WHERE ORDERID = ?;`;
        pool.query(sql, [orderId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Add Selected Products to Cart
    addCustomerOrder(userId, cartTotal, shipping, orderNote, callback) {
        const sql = `
            INSERT INTO 
                alohailiorescue.customer_order (USERID, CART_TOTAL, SHIPPINGID, ORDER_NOTE)
            VALUES 
                (?,?,?,?);
        `;
        pool.query(sql, [userId, cartTotal, shipping, orderNote], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Updated selected Products to Cart
    updateCustomerOrder(userId, cartTotal, shipping, orderNote, callback) {
        const sql = `UPDATE alohailiorescue.customer_order SET USERID = ?, CART_TOTAL = ?, SHIPPINGID = ?, ORDER_NOTE = ?;`;
        pool.query(sql, [userId, cartTotal, shipping, orderNote], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Clear Cart Items by user when checkout
    clearCartCheckout(userId, callback) {
        const sql = `UPDATE alohailiorescue.customer_carts SET CART_STATUS = 'Checkout' WHERE USERID= ?;`;
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get shipping Details by user
    getShippingDetails(userId, callback) {
        const sql = `
            SELECT
                U.USER_EMAIL, U.FIRSTNAME, U.LASTNAME, U.USER_CONTACT, S.*
            FROM
                alohailiorescue.shipping_details AS S,
                alohailiorescue.users AS U 
            WHERE
                S.USERID = U.USERID AND S.USERID = ?
        `;
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get shipping types
    getShippingTypes(callback) {
        const sql = `SELECT * FROM alohailiorescue.shipping_types;`;
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get shipping types by Id
    getShippingTypesById(shippingId, callback) {
        const sql = `SELECT * FROM alohailiorescue.shipping_types WHERE SHIPPINGID = ?;`;
        pool.query(sql, [shippingId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Add user shipping Details
    addShippingDetails(
        userId, address, userState,
        userCity, userPostalCode, callback) {
            const sql = `
                INSERT INTO
                    alohailiorescue.shipping_details (USERID, SHIPPING_ADDRESS, SHIPPING_STATE, SHIPPING_CITY, SHIPPING_POSTAL)
                VALUES
                    (?,?,?,?,?);
            `;
            pool.query(sql, [
                userId, address, userState,
                userCity, userPostalCode], (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    return callback(null, result);
            });
    },
    // Update shipping in customer order
    updateShippingCustOrder(shippingId, totalPrice, orderId, callback) {
        const sql = `UPDATE alohailiorescue.customer_order SET SHIPPINGID = ?, ORDER_TOTAL = ? WHERE ORDERID = ?`;
        pool.query(sql, [shippingId, totalPrice, orderId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get promocode by promocode
    getPromocodeByLabel(promocode, callback) {
        console.log(promocode);
        const sql = `SELECT * FROM alohailiorescue.promotion_codes WHERE PROMO_CODE = ?;`;
        pool.query(sql, [promocode], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get shipping types by customer order
    getShippingTypesByOrder(userId, callback) {
        const sql = `
            SELECT
                O.*, S.*
            FROM
                alohailiorescue.customer_order AS O,
                alohailiorescue.shipping_types AS S
            WHERE 
                O.SHIPPINGID = S.SHIPPINGID AND O.USERID = ?;
        `;
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Update Order Status after payment
    updateOrderStatusAfterPayment(userId, callback) {
        const sql = `UPDATE alohailiorescue.customer_order SET ORDER_STATUS = 'Paid' WHERE ORDER_STATUS = 'P' AND USERID= ?;`;
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Clear cart items after payment
    clearCartAfterPayment(userId, callback) {
        const sql = `UPDATE alohailiorescue.customer_carts SET CART_STATUS = 'Unfulfilled' WHERE CART_STATUS IN ('Checkout', 'Pending') AND USERID= ?;`;
        pool.query(sql, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
}

//= ======================================================
//              Exports
//= ======================================================
module.exports = Shop;