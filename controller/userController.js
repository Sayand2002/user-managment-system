//importing model
const userDetails = require("../models/userModel");

//importing bcrypt for encryption of password
const bcrypt = require("bcryptjs");
// const userRoute = require("../routes/userRoutes");

const securePassword = async (password) =>{
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch(err){
        res.send(err.message);
    }
}

//importing nodemailer
const nodemailer = require("nodemailer");
const sendVerifyMail = async (name, email, user_id )=> {
    try {
        console.log(user_id);
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "sayand2k2@gmail.com",
                pass: "hbkn okff lalf axbp"
            }
        });
        const mailoptions = {
            from:"sayand2k2@gmail.com",
            to:email,
            subject:"Verification Mail",
            html: '<p>Hello, ' + name + ', please click here to <a href="http://localhost:2021/verifyEmail?id=' + user_id + '"> verify </a> your mail</p>'
        }

        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log("Email has been send",info.response);
            }
        })
    } catch (error) {
        console.log("error",error.message);
    }
}



//renderinlogin page
const loadLogin = (req, res) => {
    try{
        res.render("userLogin");
    }
    catch(err){
        res.send(err.message)
    }
}

//loginDetails
const loginVerification = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userData = await userDetails.findOne({
            email:email
        })
        if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){
                if (userData.is_verified === 0) {
                    res.render('userLogin',{message:"please verify your email"})
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            }
            else{
                res.render("userLogin",{message:"Email and password is incorrect"})
            }
        }else{
            res.render("userLogin",{message:"Email and password is incorrect"})
        }
    }
    catch(err){
        console.log(err.message);
    }
}

//rendering signup page
const loadRegister = async (req, res) => {
    try{
        res.render("userRegistration")
    }
    catch(err){
        res.send(err.message)
    }
}

//inserting data
const insertUser = async (req, res) =>{
    try{
        const userCheck = await userDetails.findOne({email:req.body.email})
        if(userCheck)
        {
            res.render("userRegistration",{successMessage:"User already exist !"});
        }
        else{
            const spassword = await securePassword(req.body.password);
            const user = new userDetails({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone_no: req.body.phone_no,
            password: spassword,
            image:req.file.filename,
            is_admin:0,
            is_verified:0
            })
            const result = await user.save();
            if(result)
            {
                sendVerifyMail(result.firstname,result.email,result._id);
                res.redirect("/");         
            }
            else{
                res.render("userRegistration",{successMessage:"registrartion failed"});
            }
        }
    }
    catch(error){
        res.render("userRegistration",{successMessage:"Please enter some data!"});
    }
}

// load Home
const loadHome = async (req, res) => {
    try{
       const user = await userDetails.findById({_id:req.session.user_id})
        res.render("home",{
            message: (user.firstname).toUpperCase()+" "+(user.lastname).toUpperCase(),
            image:user.image
        });
    }
    catch(err){
        console.log(err.message)
    }
}


const userLogout = async (req, res) => {
    try{
        req.session.destroy();
        res.redirect('/');
    }
    catch(error){
        console.log(error.message);
    }
}


const verifyMail = async (req, res) => {
    try {
        const userId = req.query.id;
        console.log(userId,"................");
        const updated = await userDetails.updateOne(
            { _id: userId },
            { $set: { is_verified: 1 } }
        );
        res.redirect('/login');
       
    } catch (error) {
        console.error(error);
    }
}







//exporting file
module.exports = {
    loadRegister,
    loadLogin,
    loginVerification,
    loadHome,
    insertUser,
    userLogout,
    verifyMail,
}
