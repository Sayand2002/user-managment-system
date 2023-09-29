
const mongoose = require("mongoose");

//imported express
const express = require("express")
const app = express();

//establishing connection
mongoose.connect("mongodb://localhost:27017/UserDetails");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:2000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

//importing and using user route
const userRoute = require("./routes/userRoutes"); 
app.use('/',userRoute);

//importing and using admin route 
const adminRoute = require("./routes/adminRoute");

app.use('/admin',adminRoute);

//port setting
const port = process.env.PORT || 2000;
 
app.get('*',(req,res)=>{
  if(req.session.user_id){
    res.redirect('/home');
  }else{
    res.redirect('/')
  }
})

app.listen(port,() => {
    console.log(`Server running @ http://localhost:${port}`);
    console.log(`Server running @ http://localhost:${port}/admin`);
})
