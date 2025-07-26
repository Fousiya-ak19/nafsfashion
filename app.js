const express=require("express");
const helmet=require('helmet');
const app=express();
const path=require("path");
require("dotenv").config();
console.log("Loaded SESSION_SECRET:", process.env.SESSION_SECRET);
const session=require("express-session");
const passport=require("./config/passport");
const db=require("./config/db");
const userRouter=require("./routes/userRouter");
const adminRouter=require('./routes/adminRouter');
const User = require('./models/userSchema');
db();




app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000
    }

}));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    res.set('cache-control','no-store');
    next();
});
app.set("view engine", "ejs");
app.set("views",[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')]);
app.use(express.static(path.join(__dirname,"public")));

app.use("/",userRouter);
app.use('/admin',adminRouter);




// Add Content Security Policy using Helmet

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    }
  })
);

const PORT=process.env.PORT||3000
console.log("port from env:",PORT);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
app.listen(PORT, ()=>{
    console.log("Server Runningg");
})
module.exports=app;



