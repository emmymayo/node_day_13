var express = require('express');
var router = express.Router();
let {stripe_sk, base_url} = require('../env');
const stripe = require('stripe')(stripe_sk);

/* GET home page. */
router.get('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let products = await db.products.findAll();

  // res.status = 200;
  res.render('products',{
    products: products
  });
  res.end();

});

router.get('/products/:id', async (req, res, next)=>{
    const db = req.app.get('db');
    let id = req.params.id;

    let product = await db.products.findByPk(id);

    res.render("product", {
      product
    })

})


router.post('/checkout', async (req, res, next)=>{
  const db = req.app.get('db');

  let product_id = req.body.product_id;
  let product = await db.products.findByPk(product_id);

  // Create price
  const price = await stripe.prices.create({
    unit_amount: 100,
    currency: 'usd',
    product_data:{
      "name": product.title
    } 
  });

  console.log(`price ${price}`);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${base_url}/success?product=${product.id}`,
    cancel_url: `${base_url}/cancel?product=${product.id}`,
  });

  res.redirect(303, session.url+'&session_id='+session.id);
})

router.get('/success', async (req, res, next)=>{
  let product_id = req.query.product;
  let session_id = req.query.session_id;
  const db = req.app.get('db');
  let product = await db.products.findByPk(product_id);
  let order = await db.orders.create({
    product_id:   product.id,
    total:        product.price * 1,
    stripe_id:    session_id,
    payment_method: "card",
    status:   "paid"
  })
  
  res.render('success', {
    title:          product.title,
    price:          product.price,
    payment_method: "card"
  });
})

router.get('/cancel', async (req, res, next)=>{

  let product_id = req.query.product;
  let session_id = req.query.session_id;
  const db = req.app.get('db');
  let product = await db.products.findByPk(product_id);
  let order = await db.orders.create({
    product_id:   product.id,
    total:        product.price * 1,
    stripe_id:    session_id,
    payment_method: "card",
    status:   "failed"
  })
  res.render('fail');
})

module.exports = router;
