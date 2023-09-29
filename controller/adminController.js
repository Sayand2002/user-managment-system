//importing model
const adminDetails = require("../models/userModel");

const fs = require("fs");

const path = require("path");

const randomString = require("randomstring");


// //importing bcrypt for encryption of password
const bcrypt = require("bcrypt");

const userDetails = require("../models/userModel");

const securePassword = async (password) =>{
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch(err){
        console.log(err.message);
    }
}

//importing nodemailer
const nodemailer = require("nodemailer");
    const sendVerifyMail = async (name, email, user_id, password) => {
    try {
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
            html: '<p>Hello, ' + name + ', please click here to <a href="http://localhost:2000/admin/verifyEmail?id=' + user_id + '"> verify </a> your mail . Your password is '+password+'</p>'
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

//rendering admin login page
const loadAdminLogin = (req, res) => {
    try{
        res.render("adminLogin");
    }
    catch(err){
        res.send(err.message)
    }
}

//login verification
const verifyLogin = async (req, res) => {
   try{
    const email = req.body.email;
    const password = req.body.password;
    const adminData = await adminDetails.findOne({
        email:email
    })
    if(adminData){
        const passwordMatch = await bcrypt.compare(password,adminData.password);
        if(passwordMatch){
            if (adminDetails.is_admin === 0) {
                res.render("adminLogin",{message:"invalid username and password"})
            } else {
                req.session.admin_id = adminData._id;
                res.redirect('/admin/home');
            }
        }
        else{
            res.render("adminLogin",{message:"invalid username and password"})
        }
    }
    else{
        res.render("adminLogin",{message:"invalid username and password"})
    }
   }
   catch(error){
    console.log(error.message);
   }
}

//loading admin home
const loadHome = async (req, res) => {
    try {
        const admin = await adminDetails.findById({
            _id:req.session.admin_id
        })
        res.render("home",{message:(admin.firstname).toUpperCase()+" "+(admin.lastname).toUpperCase()});
    } catch (error) {
        console.log(error.message);
    }
}

//logout route
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/admin");
    } catch (error) {
        console.log(error.message);
    }
}

//admin adshboard
const adminDashboard = async (req, res) =>{
    try {
        const userData = await adminDetails.find({is_admin:0})
        res.render('dashboard',{userData:userData})
    } catch (error) {
        console.log(error.message);
    }
}

//page for adding new user
const newUserLoad = async (req, res) => {
    try {
        res.render('new-user');
        
    } catch (error) {
        console.log(error.message)
    }
}

//adding data of new user
const addNewUser = async (req, res) => {
    try {
        const userCheck = await userDetails.findOne({email:req.body.email})
        if(userCheck)
        {
            res.render("new-user",{successMessage:"user already exist !"});
        }
        else{
            const str = randomString.generate(8)
            const spassword = await securePassword(str);
            const newUser = new userDetails({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone_no:req.body.phone_no,
                password:spassword,
                image:req.file.filename,
                is_admin:0,
                is_verified:0
            })
            const result = await newUser.save();
            if(result){
                sendVerifyMail(result.firstname,result.email,result._id,str);
                res.render('new-user',{successMessage:"User Successfully added"});
            }
            else{
                res.render('new-user',{message:"Signup Failed"})
            }
        } 
    }

        catch (error) {
            console.log(error.message);
        }
}

//load page to edit user data
const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await adminDetails.findById({_id:id})
        if(userData)
        {
            res.render("edit-user",{user:userData});
        }
        else{
            res.redirect("/admin/dashboard");
        }
    } catch (error) {
        console.log(error.message)
    }
}

//posting edited data
const editUserData = async(req, res) => {
    try {
        const userData=await adminDetails.findByIdAndUpdate({_id:req.body.id},{$set:{firstname:req.body.firstname,lastname:req.body.lastname,email:req.body.email,phone_no:req.body.phone_no,is_verified:req.body.verify}})
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message)
    }
}

//serach user
const searchUser = async (req, res) => {
    try {
        const searchData = req.body.searchData;
        const regex = new RegExp(`^${searchData}`);
        const userData = await userDetails.find({firstname:regex, is_admin:0});
        if(userData){
            res.render('dashboard',{userData:userData});

        }
        else{
            console.log("error");
        }
    } catch (error) {
        console.log(error.message);
    }
}

//deleting user
const deleteUser = async(req, res) => {
    try {
        const id = req.query.id
       
        const imageName = await adminDetails.findById({_id:id},{image:1})
        const filepath = path.join(__dirname,`../public/userImages/${imageName.image}`);
        fs.unlink(filepath,(err)=>{
            if(err){
                console.log(err.message);
            }
            else{
                console.log("successfully deleted");
            }
        })

        await adminDetails.deleteOne({_id:id});
        res.redirect('/admin/dashboard');
        
    } catch (error) {
        console.log(error.message);
    }
}

//email verification
const verifyMail = async (req, res) => {
    try {
        const userId = req.query.id;
        const updated = await userDetails.updateOne(
            { _id: userId },
            { $set: { is_verified: 1 } }
        );
        res.render('verifyEmail',{id:userId});
    } catch (error) {
        console.error(error);
    }
}


const changePassword = async (req, res) => {
    try{
        const password = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const reEnterPassword = req.body.reEnterPassword;
        const id = req.body.id;
        const userData = await adminDetails.findOne({
            _id:id
        });
        console.log(userData)
        const passwordMatch = await bcrypt.compare(password, userData.password);
        console.log(passwordMatch);
        if (passwordMatch) {
            if (newPassword === reEnterPassword) {
                const passwordHash = await bcrypt.hash(newPassword, 10);
                console.log(passwordHash);
                const updatePassword = await adminDetails.updateOne({_id:id},{$set:{password:passwordHash}});
                if (updatePassword) {
                    res.redirect('/login');
                } else {
                    console.log("error");
                }
            } else {
                res.render('verifyEmail',{message:"password doesn't match"});
            }
           
        }
      
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadAdminLogin,
    verifyLogin,
    loadHome,
    adminDashboard,
    logout,
    newUserLoad,
    addNewUser,
    editUserLoad,
    editUserData,
    searchUser,
    deleteUser,
    verifyMail,
    changePassword 
    // anonymonus
}