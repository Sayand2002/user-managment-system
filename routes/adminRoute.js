const express = require("express");
const adminRoute = express();

const auth = require("../middleware/adminAuth")
const session = require("express-session");

const adminController = require("../controller/adminController")

const secretKey = require("../config/config")

const path = require("path");

//importing multer
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join(__dirname,"../public/userImages"))
    },
    filename: (req, file, cb) => {
        const name = Date.now()+'-'+file.originalname;
        cb(null, name)
    }
})
const upload = multer({storage: storage});

adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}));

adminRoute.set('view engine','pug');
adminRoute.set("views", './views/admin');

adminRoute.use(session({
    secret:secretKey.sessionSecret,
    saveUninitialized:true,
    resave:false
}));

//cache control
const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, must-revalidate, max-age=0, private')
    next();
}
adminRoute.use(noCache);


adminRoute.get('/',auth.isLogout,adminController.loadAdminLogin);
adminRoute.post('/',auth.isLogout,adminController.verifyLogin);
adminRoute.get('/home',auth.isLogin,adminController.loadHome);
adminRoute.get('/logout',auth.isLogin,adminController.logout);
adminRoute.get('/dashboard',auth.isLogin,adminController.adminDashboard);
 
adminRoute.get('/new-user',adminController.newUserLoad);
adminRoute.post('/new-user',upload.single('image'),adminController.addNewUser);

adminRoute.get('/edit-user',auth.isLogin,adminController.editUserLoad);
adminRoute.post('/edit-user',adminController.editUserData);

adminRoute.post('/search-user',adminController.searchUser);

adminRoute.get('/delete-user',adminController.deleteUser);

adminRoute.get('/verifyEmail',adminController.verifyMail);

adminRoute.post('/verifyEmail',adminController.changePassword)

adminRoute.get('*',(req,res)=>{
    if(req.session.admin_id){
      res.redirect('/admin');
    }else{
      res.redirect('/')
    }
  })

module.exports = adminRoute