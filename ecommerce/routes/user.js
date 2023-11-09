var express = require('express');
var router = express.Router();
const userHelpers = require('../dbhelpers/user-helpers');
const productHelpers = require('../dbhelpers/product-helpers');


const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn)
    next();
  else{
      if(req.xhr){
        res.json({redirectTo:'/login'});
      }
      else
      {
        res.redirect('/login');
      }
  }
    
}
/* GET home page. */
router.get('/',verifyLogin, async function(req, res, next) {
  let user = req.session.user;
  let categories = await productHelpers.getAllCategories();
  let highlights = await productHelpers.getHighlights();
  let cartCount = null;

  if(user){
    cartCount=await userHelpers.getCartCount(req.session.user._id);
  }
  res.render('user/home', {categories,highlights,user,cartCount,page:'home'});
});

router.get('/login', (req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/');
  }
  else{
    res.render('user/signin-signup',{title:'Login page',page:'login'});
  }
});

router.post('/signup',(req,res)=>{
  if(req.body.Password == "" || req.body.Name == "" || req.body.Email == "")
  {
    res.json({success:false,err:'input all fields!'});
  }
  else if(req.body.Password != req.body.ConfirmPassword)
  {
    res.json({success:false,err:'Password do not match, please try again.'});
  }
  else
  {
    userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.loggedIn=true;
    req.session.user=req.body;
    res.json({success:true});
  }).catch((err)=>{
    res.json({success:false,err})
  })
}
});


router.post('/signin',(req,res)=>{
  userHelpers.doLogin(req.body).then((user)=>{
      req.session.loggedIn=true;
      req.session.user=user;
      res.json({success:true})
  }).catch((err) => {
    res.json({success:false,err})
  })
});

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
