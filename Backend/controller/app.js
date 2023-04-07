// ====================== Imports ======================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Unique String
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const printDebugInfo = require('../middlewares/printDebugInfo');
const URL = process.env.SERVER_NAME;

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// ====================== model ======================
const Shop = require('../model/shop');
const User = require('../model/user');
const Story = require('../model/story');
const { getShippingDetails } = require('../model/shop');

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
// MF Configurations
app.use(urlEncodedParser);
app.use(jsonParser);
app.options('*', cors());
app.use(cors());
app.use(cookieParser());

// ====================== Sanity Check ======================
app.get('/', (req, res) => {
  res.status(200).send('HelloWorld');
});

app.get('/shop', printDebugInfo, async (req, res) => {
  // calling getAllCategories method from Shop model
  Shop.getAllCategories((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/products/:catId', printDebugInfo, async (req, res) => {
  const categoryId = req.params.catId;

  // calling getAllProducts method from Shop model
  Shop.getAllProducts(categoryId, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/variant/:prodId', printDebugInfo, async (req, res) => {
  const productId = req.params.prodId;

  // calling getProductVariants method from Shop model
  Shop.getProductVariants(productId, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.post('/variant/filter/:catId', printDebugInfo, async (req, res) => {
  const categoryId = req.params.catId;
  const productSize = req.body.productSize;
  if (productSize === undefined || productSize.length == 0) {
    // calling getAllProducts method from Shop model
    Shop.getAllProducts(categoryId, (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(500).send('Some error');
      }
    });
  } else {
    // calling getProductBySize method from Shop model
    Shop.getProductBySize(categoryId, productSize, (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(500).send('Some error');
      }
    });
  }
});

app.post('/filter/:catId', printDebugInfo, async (req, res) => {
  const categoryId = req.params.catId;
  const sortBy = req.body.sortBy;

  // calling sortProductList method from Shop model
  Shop.sortProductList(categoryId, sortBy, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/discount/:prodId', printDebugInfo, async (req, res) => {
  const productId = req.params.prodId;

  // calling getProductDiscount method from Shop model
  Shop.getProductDiscount(productId, (err, result) => {
    if (!err) {
      res.status(200).send(result[0]);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.post('/price/filter/:catId', printDebugInfo, async (req, res) => {
  const categoryId = req.params.catId;
  const priceRange = req.body.priceRange;
  const priceStart = priceRange[0];
  const priceEnd = priceRange[1];

  // calling filterProductsByPrice method from Shop model
  Shop.filterProductsByPrice(categoryId, priceStart, priceEnd, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/cart/:deviceId', printDebugInfo, async (req, res) => {
  const deviceId = req.params.deviceId;

  // calling getCartItemsByDeviceId method from Shop model
  Shop.getCartItemsByDeviceId(deviceId, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/shipping', printDebugInfo, async (req, res) => {
  // calling getShippingTypes method from Shop model
  Shop.getShippingTypes((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.post('/cart/product/:productId', printDebugInfo, async (req, res) => {
  const productId = req.params.productId;
  const productSize = req.body.productSize;
  const quantity = req.body.quantity;
  const deviceId = req.body.guestDevice;

  function addToCart(userId) {
    // calling getProductForAddCart method from Shop model
    Shop.getProductForAddCart(productId, productSize, (err, selectedProduct) => {
      let totalPrice;
      if (selectedProduct[0].DISCOUNTED_PRICE !== 'null' && selectedProduct[0].DISCOUNTED_PRICE !== null) {
        totalPrice = selectedProduct[0].DISCOUNTED_PRICE;
      } else {
        totalPrice = selectedProduct[0].PRODUCT_PRICE;
      }

      if (!err) {
        Shop.checkCartProdQuantity(userId, productId, productSize, (err, quantityCheckResult) => {
          if (!err) {
            if (quantityCheckResult.length === 0 || quantityCheckResult === undefined) {
              Shop.addProductToCart(userId, productId, quantity, totalPrice, productSize, (err, atcResult) => {
                if (!err) {
                  res.status(200).send(atcResult);
                } else {
                  res.status(500).send('Something when wrong when adding product to cart');
                }
              });
            } else {
              let updQuantity = quantityCheckResult[0].QUANTITY + 1;
              totalPrice = totalPrice * updQuantity;
              Shop.incrementQuantity(updQuantity, totalPrice, quantityCheckResult[0].CARTID, (err, incrResult) => {
                if (!err) {
                  res.status(200).send(incrResult);
                } else {
                  res.status(500).send('Something when wrong when incrementing quantity');
                }
              });
            }
          } else {
            res.status(500).send('Something when wrong when adding product to cart');
          }
        });
      } else {
        res.status(500).send('Something went wron when getting for selected product to be added into cart');
      }
    });
  }

  // calling getGuestUser method from Shop model
  User.getGuestUser(deviceId, (err, guestUser) => {
    if (!err) {
      if (guestUser.length === 0 || guestUser === undefined) {
        User.addGuestAccount(deviceId, (err, addGuestResult) => {
          if (!err) {
            addToCart(addGuestResult.insertId);
          } else {
            res.status(500).send('Something went wrong when adding guest user');
          }
        });
      } else {
        addToCart(guestUser[0].USERID);
      }
    } else {
      res.status(500).send('Something went wrong when checking for guest user');
    }
  });
});

app.delete('/cart/:cartId', printDebugInfo, async (req, res) => {
  const cartId = req.params.cartId;

  // calling deleteCartItem method from Shop model
  Shop.deleteCartItem(cartId, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/shipping-form/:id', printDebugInfo, async (req, res) => {
  const deviceId = req.params.id;

  // calling getCartItem method from Shop model
  User.getGuestUser(deviceId, (err, guestResult) => {
    if (!err) {
      Shop.getShippingDetails(guestResult[0].USERID, (err, shippingDtl) => {
        if (!err) {
          res.status(200).send(shippingDtl);
        } else {
          res.status(500).send('Something went wrong when getting user shipping details');
        }
      });
    } else {
      res.status(500).send('Something went wrong when getting user');
    }
  });
});

app.get('/delivery-form', printDebugInfo, async (req, res) => {
  // Calling getDeliveryTypes method from Shop model
  Shop.getShippingTypes((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Something went wrong when getting shipping types');
    }
  });
});

app.get('/delivery-form/:shippingId', printDebugInfo, async (req, res) => {
  const shippingId = req.params.shippingId;

  // Calling getShippingTypesById method from Shop model
  Shop.getShippingTypesById(shippingId, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send('Something went wrong when getting shipping types');
    }
  });
});

app.put('/cart/product/:cartId', printDebugInfo, async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.body.productId;
  const productSize = req.body.productSize;
  const quantity = req.body.quantity;

  function addToCart(userId) {
    // calling getProductForAddCart method from Shop model
    Shop.getProductForAddCart(productId, productSize, (err, selectedProduct) => {
      let totalPrice;
      if (selectedProduct[0].DISCOUNTED_PRICE !== 'null' && selectedProduct[0].DISCOUNTED_PRICE !== null) {
        totalPrice = selectedProduct[0].DISCOUNTED_PRICE;
      } else {
        totalPrice = selectedProduct[0].PRODUCT_PRICE;
      }

      if (!err) {
        Shop.checkCartProdQuantity(userId, productId, productSize, (err, quantityCheckResult) => {
          if (!err) {
            if (quantityCheckResult.length === 0 || quantityCheckResult === undefined) {
              Shop.addProductToCart(userId, productId, quantity, totalPrice, productSize, (err, atcResult) => {
                if (!err) {
                  res.status(200).send(atcResult);
                } else {
                  res.status(500).send('Something when wrong when adding product to cart');
                }
              });
            } else {
              totalPrice = totalPrice * quantity;
              Shop.incrementQuantity(quantity, totalPrice, quantityCheckResult[0].CARTID, (err, incrResult) => {
                if (!err) {
                  res.status(200).send(incrResult);
                } else {
                  res.status(500).send('Something when wrong when incrementing quantity');
                }
              });
            }
          } else {
            res.status(500).send('Something when wrong when adding product to cart');
          }
        });
      } else {
        res.status(500).send('Something went wron when getting for selected product to be added into cart');
      }
    });
  }

  // calling getCartItem method from Shop model
  Shop.getCartItem(cartId, (err, cartResult) => {
    if (!err) {
      addToCart(cartResult[0].USERID);
    } else {
      res.status(500).send('Something went wrong when getting cart item');
    }
  });
});

app.post('/checkout/pending', printDebugInfo, async (req, res) => {
  const deviceId = req.body.deviceId;
  const cartTotal = req.body.cartTotal;
  const shipping = req.body.shipping;
  // const orderTotal = req.body.orderTotal;
  const orderNote = req.body.orderNote;

  function checkout(userId) {
    // calling getPendingOrderByUser method from Shop model
    // If customer order is not in the customer_order table, function is run to add it in
    // vice versa, nth is done if order is found and pending
    Shop.getPendingOrderByUser(userId, (err, guestOrder) => {
      if (!err) {
        if (guestOrder.length === 0 || guestOrder === undefined) {
          // calling addCustomerOrder method from Shop model
          // This method adds user carts to checkout table with its relavant price info
          Shop.addCustomerOrder(
            userId, cartTotal, shipping, orderNote,
            (err, addOrderResult) => {
              if (!err) {
                // Get cart items by device id
                // Get All the currently pending products in user cart
                Shop.getCartItemsByDeviceId(deviceId, (err, cartItem) => {
                  if (!err) {
                    // Changes cart item status to checkout since checkout process is done
                    for (let i = 0; i < cartItem.length; i++) {
                      Shop.clearCartCheckout(userId, (err, clearCart) => {
                        if (!err) {
                          if (i === cartItem.length - 1) {
                            res.status(200).send(clearCart);
                          }
                        } else {
                          res.status(500).send('Something went wrong when clearing cart after checkout');
                          return;
                        }
                      });
                    }
                  } else {
                    res.status(500).send('Something went wrong when getting pending cart item');
                  }
                });
              } else {
                res.status(500).send('Something went wrong when adding customer order');
              }
            });
        } else {
          if (guestOrder[0].ORDER_STATUS === 'P') {
            // calling updateCustomerOrder method from Shop model
            Shop.updateCustomerOrder(
              userId, cartTotal, shipping, orderNote,
              (err, addOrderResult) => {
                if (!err) {
                  res.status(200).send({ success: "Success" });
                } else {
                  res.status(500).send('Something went wrong when updating customer order');
                }
              });
          }
        }
      } else {
        res.status(500).send('Something went wrong when checking for pending guest orders');
      }
    });
  }

  // calling getGuestUser method from Shop model
  User.getGuestUser(deviceId, (err, guestUser) => {
    if (!err) {
      if (guestUser.length === 0 || guestUser === undefined) {
        res.status(500).send("Sorry, your guest account could not be found in our system. Please navigate to the home page and refresh your browser or create an account with us!");
      } else {
        checkout(guestUser[0].USERID);
      }
    } else {
      res.status(500).send('Something went wrong when checking for guest user');
    }
  });
});

app.post('/checkout/shipping-form', printDebugInfo, async (req, res) => {
  const deviceId = req.body.guestDevice;
  const guestEmail = req.body.guestEmail;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address = req.body.address;
  const userState = req.body.userState;
  const userCity = req.body.userCity;
  const userPostalCode = req.body.userPostalCode;
  const userPhoneNo = req.body.userPhoneNo;

  function addShippingDtls(userId) {
    Shop.getShippingDetails(userId, (err, shippingDtlResult) => {
      if (!err) {
        if (shippingDtlResult.length === 0) {
          User.updateGuestAccount(guestEmail, firstName, lastName, userPhoneNo, userId, (err, updUserResult) => {
            if (!err) {
              Shop.addShippingDetails(
                userId, address, userState,
                userCity, userPostalCode,
                (err, addShippingDtl) => {
                  res.status(200).send({ success: "Suceess" });
                });
            } else {
              res.status(500).send("Something went wrong when updating user details");
            }
          });
        } else {
          res.status(200).send({ success: "Suceess" });
        }
      } else {
        res.status(500).send("Something went wrong when checking for shipping details by user");
      }
    });
  }

  // calling getGuestUser method from Shop model
  User.getGuestUser(deviceId, (err, guestUser) => {
    if (!err) {
      if (guestUser.length === 0 || guestUser === undefined) {
        res.status(500).send("Sorry, your guest account could not be found in our system. Please navigate to the home page and refresh your browser or create an account with us!");
      } else {
        addShippingDtls(guestUser[0].USERID);
      }
    } else {
      res.status(500).send('Something went wrong when checking for guest user');
    }
  });
});

app.get('/checkout/customer-order/:id', printDebugInfo, async (req, res) => {
  const deviceId = req.params.id;

  // calling getGuestUser method from User model
  User.getGuestUser(deviceId, (err, guestResult) => {
    if (!err) {
      Shop.getPendingOrderByUser(guestResult[0].USERID, (err, orderDtl) => {
        if (!err) {
          res.status(200).send(orderDtl);
        } else {
          res.status(500).send('Something went wrong when getting user shipping details');
        }
      });
    } else {
      res.status(500).send('Something went wrong when getting user');
    }
  });
});

app.put('/cart/shipping/:shippingId/:orderId', printDebugInfo, async (req, res) => {
  const shippingId = req.params.shippingId;
  const orderId = req.params.orderId;

  Shop.getShippingTypesById(shippingId, (err, shippingType) => {
    if (!err) {
      Shop.getPendingOrderById(orderId, (err, orderDtl) => {
        if (!err) {
          // calling updateShippingCustOrder method from Shop model
          Shop.updateShippingCustOrder(shippingId, orderDtl[0].CART_TOTAL + shippingType[0].SHIPPING_PRICE, orderId, (err, result) => {
            if (!err) {
              res.status(200).send(result);
            } else {
              res.status(500).send('Something went wrong when updating shipping in customer order');
            }
          });
        } else {
          res.status(500).send('Something went wrong when getting user shipping details');
        }
      });
    } else {
      res.status(500).send('Something went wrong when getting shipping types');
    }
  });
});

app.get('/promocode/:promocode', printDebugInfo, async (req, res) => {
  const promocode = req.params.promocode;

  // calling getPromocodeByLabel method from User model
  Shop.getPromocodeByLabel(promocode, (err, orderDtl) => {
    if (!err) {
      res.status(200).send(orderDtl);
    } else {
      res.status(500).send('Something went wrong when getting user shipping details');
    }
  });
});

app.post('/stripe/checkout', printDebugInfo, async (req, res) => {
  let guestId = req.body.guestDevice;
  let email = req.body.email;

  Shop.getCartItemsByDeviceId(guestId, async (err, result) => {
    if (!err) {
      User.getGuestUser(guestId, async (err, guest) => {
        if (!err) {
          Shop.getShippingTypesByOrder(guest[0].USERID, async (err, orderObj) => {
            try {
              let session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                allow_promotion_codes: true,
                customer_email: email,
                line_items: result.map(item => {
                  return {
                    price_data: {
                      currency: 'usd',
                      product_data: {
                        name: item.PRODUCT_NAME
                      },
                      unit_amount: Math.round((Math.round(item.TOTAL_PRICE * 100) / item.QUANTITY))
                    },
                    quantity: item.QUANTITY,
                  }
                }),
                shipping_options: [
                  {
                    shipping_rate_data: {
                      type: 'fixed_amount',
                      fixed_amount: {
                        amount: Math.round(orderObj[0].SHIPPING_PRICE * 100),
                        currency: 'usd'
                      },
                      display_name: orderObj[0].SHIPPING_LABEL,
                    },
                  },
                ],
                success_url: `${process.env.FRONT_SERVER_NAME}/checkout/success`,
                cancel_url: `${process.env.FRONT_SERVER_NAME}/checkout`,
              });
              res.send({ url: session.url });
            } catch (e) {
              res.status(500).send({ error: e.message });
            }
          })
        } else {
          res.status(500).send({ err: "Error" });
        }
      });
    } else {
      res.status(500).send({ err: "Error" });
    }
  });
});

app.post('/clear/cart/:deviceId', printDebugInfo, async (req, res) => {
  const deviceId = req.params.deviceId;

  function clearCart(userId) {
    Shop.updateOrderStatusAfterPayment(userId, (err, orderStatus) => {
      if (!err) {
        Shop.clearCartAfterPayment(userId, (err, cartStatus) => {
          if (!err) {
            res.status(200).send({ msg: cartStatus });
          } else {
            res.status(500).send({ error: 'Something went wrong when updating cart status after payment' })
          }
        });
      } else {
        res.status(500).send({ error: 'Something went wrong when updating order status after payment' })
      }
    });
  }

  // calling getGuestUser method from Shop model
  User.getGuestUser(deviceId, (err, guestUser) => {
    if (!err) {
      if (guestUser.length === 0 || guestUser === undefined) {
        res.status(500).send("Sorry, your guest account could not be found in our system. Please navigate to the home page and refresh your browser or create an account with us!");
      } else {
        clearCart(guestUser[0].USERID);
      }
    } else {
      res.status(500).send('Something went wrong when checking for guest user');
    }
  });
});

app.post('/story/new', printDebugInfo, async (req, res) => {
  const title = req.body.title;
  const slug = req.body.slug;
  const description = req.body.description;
  const content = req.body.content;

  // calling postStory method from Shop model
  Story.postStory(title, slug, description, content, (err, result) => {
    if (!err) {
      res.status(200).send({ msg: 'Story posted successfully' })
    } else {
      res.status(500).send({ errMsg: 'Something went wrong when checking for guest user' });
    }
  });
});

app.get('/story/:limit', printDebugInfo, async (req, res) => {
  const limit = req.params.limit;
  
  // calling getStories method from Shop model
  Story.getStories(limit, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send({ errMsg: 'Something went wrong when checking for guest user' });
    }
  });
});

app.get('/featured/story', printDebugInfo, async (req, res) => {
  // calling getFeaturedStories method from Shop model
  Story.getFeaturedStories((err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(500).send({ errMsg: 'Something went wrong when checking for guest user' });
    }
  });
});

app.get('/story-dtl/:slug', printDebugInfo, async (req, res) => {
  const slug = req.params.slug;
  
  // calling getStoriesBySlug method from Shop model
  Story.getStoriesBySlug(slug, (err, result) => {
    if (!err) {
      res.status(200).send(result[0]);
    } else {
      res.status(500).send({ errMsg: 'Something went wrong when checking for guest user' });
    }
  });
});

app.get('/story-edit/:id', printDebugInfo, async (req, res) => {
  const id = req.params.id;
  
  // calling getStoriesById method from Shop model
  Story.getStoriesById(id, (err, result) => {
    if (!err) {
      res.status(200).send(result[0]);
    } else {
      res.status(500).send({ errMsg: 'Something went wrong when checking for guest user' });
    }
  });
});

app.put('/story/edit', printDebugInfo, async (req, res) => {
  const title = req.body.title;
  const slug = req.body.slug;
  const description = req.body.description;
  const content = req.body.content;
  const storyId = req.body.storyId;

  // calling updateStory method from Shop model
  Story.updateStory(title, slug, description, content, storyId, (err, result) => {
    if (!err) {
      res.status(200).send({ msg: 'Story updated successfully' })
    } else {
      res.status(500).send({ errMsg: 'Something went wrong when checking for guest user' });
    }
  });
});

app.delete('/story/:id', printDebugInfo, async (req, res) => {
  const storyId = req.params.id;

  // calling deleteStory method from Shop model
  Story.deleteStory(storyId, (err, result) => {
    if (!err) {
      res.status(200).send({ msg: 'Story deleted successfully' })
    } else {
      res.status(500).send({ errMsg: 'Something went wrong when checking for guest user' });
    }
  });
});

// ====================== Exports ======================
module.exports = app;