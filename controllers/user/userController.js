
const User=require("../../models/userSchema");
const env=require("dotenv").config();
const nodemailer=require("nodemailer");
const bcrypt=require("bcrypt");
const pageNotFound=async (req,res)=>{
    try {
        res.render("page-404");
    } catch (error) {
        res.redirect("/pageNotFound")
    }
}
const loadHomepage = async (req, res) => {
  try {
    const user = req.session.user;

    if (user) {
      const userData = await User.findOne({ _id: user._id });
      return res.render("home", { user: userData });
    } else {
      return res.render("home");
    }

  } catch (error) {
    console.log("Home page not found", error);
    res.status(500).send("Server error");
  }
};
const loadSignup=async (req,res)=>{
    try {
        return res.render('signup');
    } catch (error) {
        console.log('Home page not loading:',error);
        res.status(500).send('Server Error');
    }
}
const loadShopping=async (req,res)=>{
    try {

        return res.render('shop');
    } catch (error) {
        console.log("Shopping page not loading:",error);
        res.status(500).send('Server Error');
    }
}

function generateOtp(){
  return Math.floor(10000+Math.random()*900000).toString();  
}

async function sendVerificationEmail(email,otp){
    try {
        const transporter=nodemailer.createTransport({
         service:'gmail',
         port:587,
         secure:false,
         requireTLS:true,
         auth:{
            user:process.env.NODEMAILER_EMAIL,
            pass:process.env.NODEMAILER_PASSWORD
         }   
        })

        const info=await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"verify your account",
            text:`Your OTP is ${otp}`,
            html:`<b>Your OTP:${otp}</b>`,
        })
        return info.accepted.length>0
    } catch (error) {
       console.error("❌ Error sending OTP email:", error.message);
        return false;
    }
}
  const signup=async (req,res)=>{
    try {
        const {name,phone,email,password,cPassword}=req.body;
        if(password !==cPassword){
            return res.render("signup",{message:"Passwords donot match"})
        }
        const findUser=await User.findOne({email});
        if(findUser){
            return res.render("signup",{message:"User with this email already exists"});
        }
        const otp=generateOtp();

        const emailSent=await sendVerificationEmail(email,otp);
        if(!emailSent){
            return res.json("email.error")
        }
        req.session.userOtp=otp;
        req.session.userData={name,phone,email,password};
        res.render("verify-otp");
        console.log("OTP Sent",otp);

    } catch (error) {
        console.error("Signup error",error);
        res.redirect("/pageNotFound");
    }
  }
  const securePassword=async(password)=>{
    try {
        const passwordHash= await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.error("Password hashing error:", error);
    }
  }
  const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log("✅ Entered OTP:", otp);
    console.log("✅ Session OTP:", req.session.userOtp);
    console.log("✅ Session Data:", req.session.userData);

    if (otp == req.session.userOtp) {
      const user = req.session.userData;
      const passwordHash = await securePassword(user.password);

      const saveUserData = new User({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: passwordHash
      });

      await saveUserData.save();

      req.session.user = saveUserData._id;

      // ✅ Add this line:
      req.session.userData = {
        name: saveUserData.name,
        email: saveUserData.email
      };

      res.json({ success: true, redirectUrl: "/" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP, Please try again" });
    }
  } catch (error) {
    console.error("Error Verifying OTP", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
  const resendOtp=async (req,res)=>{
    try {
        const {email}=req.session.userData;
        if(!email){
            return res.status(400).json({success:false,message:"Email not find in session"})
        }
        const otp=generateOtp();
        req.session.userOtp=otp;
        const emailSent=await sendVerificationEmail(email,otp);
    
        if(emailSent){
             console.log("Resend OTP");
        res.status(200).json({success:true,message:"OTP Resens Successfully"})
        }else{
            res.status(500).json({success:false,message:"Failed to resend OTP. Please try againn"})
        }
           
    } catch (error) {
        console.error("Error resending otp",error);
        res.status(500).json({success:false,message:"Internal server error.Please try again"})
        
    }
  }
const loadLogin=async (req,res)=>{
    try {
        if(!req.session.user){
            return res.render("login");
        }
        else{
            res.redirect("/");
        }
    } catch (error) {
        res.redirect("/pageNotFound");
    }
}

const login= async (req,res)=>{
    try {
        const {email,password}=req.body;
        const findUser=await User.findOne({isAdmin:0,email:email});
        if(!findUser){
            return  res.render("login",{message:"User not found"});
        }
        if(findUser.isBlocked){
            return res.render("login",{message:'user is blocked bi admin'})

        }
        const passwordMatch=await bcrypt.compare(password,findUser.password);
        if(!passwordMatch){
            return res.render("login",{messaage:"Incorrect Password"});

        }
        req.session.user = {
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        };
        res.redirect("/");
    } catch (error) {
        console.error("login error",error);
        res.render("login",{message:"login failed.Please try again later"})


    }
}

module.exports={
    loadHomepage,
    pageNotFound,
    loadSignup,
    loadShopping,
    signup,
    verifyOtp,
    resendOtp,
    loadLogin,
    login

};