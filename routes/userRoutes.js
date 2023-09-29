const express = require("express");
const userRoute = express();

//importing controller
const userController = require('../controller/userController');

//importing middleware
const auth = require("../middleware/auth");

//importing path
const path = require("path");

//body parsing
userRoute.use(express.json())
userRoute.use(express.urlencoded({extended:true}));

//setting views
userRoute.set("view engine", "pug");
userRoute.set("views", path.join(__dirname, "../views"))

//route of script code
userRoute.use('/script',express.static(path.join(__dirname,'../script')));


//static files
userRoute.use('/public',express.static(path.join(__dirname, '../public')));
userRoute.use('/assets',express.static(path.join(__dirname,'../public/assets')))

//session
const secretKey = require("../config/config"); 
const  session = require("express-session");
userRoute.use(session({
    secret:secretKey.sessionSecret,
    saveUninitialized:true,
    resave:false
}));


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

//cache control
const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, must-revalidate, max-age=0, private')
    next();
}

userRoute.use(noCache);

const upload = multer({storage: storage});
 
userRoute.get('/',auth.isLogout, userController.loadLogin); 

userRoute.get('/login',auth.isLogout, userController.loadLogin);

userRoute.post('/login',userController.loginVerification);   


userRoute.get('/register',auth.isLogout, userController.loadRegister);

userRoute.post('/register', upload.single('image'), userController.insertUser);

userRoute.get('/home',auth.isLogin,userController.loadHome);

userRoute.get('/logout',auth.isLogin,userController.userLogout);

userRoute.get('/verifyEmail',userController.verifyMail);


module.exports = userRoute;
