var express = require('express');
var router = express.Router();
const productHelpers = require('../dbhelpers/product-helpers');

/* ADMIN. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products', { admin: true, products });
  })
});
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product',{admin:true});
});

router.post('/add-product',(req,res)=>{
  console.log(req.body)
  let image = req.files.Image;
  const parts = image.mimetype.split('/');
  const fileExtension = parts[1];
  req.body.Price=Number(req.body.Price)
  req.body.Offerprice=Number(req.body.Offerprice)
  productHelpers.addProduct(req.body, fileExtension, (imageName) => {
    
    image.mv('./public/images/' + imageName, (err) => {
      if (!err) {
        res.render('admin/add-product', { admin: true});
      }
      else {
        console.log(err);
      }
    })

  });

})

router.get('/edit-product',async(req,res)=>{
  let product= await productHelpers.getProductDetails(req.query.id);
  res.render('admin/edit-product',{product,admin:true});
});

router.get('/delete-product',(req,res)=>{
  let proId=req.query.id;
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin');
  })
});

router.post('/edit-product',(req,res)=>{
  req.body.Price=Number(req.body.Price)
  productHelpers.updateProduct(req.body);
  res.redirect('/admin');
  if(req.files.Image){
    let image=req.files.Image;
    const parts=image.mimetype.split('/');
    fileExtension=parts[1];
    let imageName=req.body.id+"."+fileExtension;
    image.mv('./public/images/' + imageName);
    productHelpers.updateProductImgExtension(fileExtension,req.body.id);
  }
  
})
module.exports = router;
