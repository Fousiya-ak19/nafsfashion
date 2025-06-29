const express=require("express");
const app=express();
const path=require("path");
require("dotenv").config();
console.log("Loaded SESSION_SECRET:", process.env.SESSION_SECRET);
const session=require("express-session");
const db=require("./config/db");
const userRouter=require("./routes/userRouter");
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
app.use((req,res,next)=>{
    res.set('cache-control','no-store');
    next();
});
app.set("view engine", "ejs");
app.set("views",[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')]);
app.use(express.static(path.join(__dirname,"public")));

app.use("/",userRouter)
const PORT=process.env.PORT||3000
console.log("port from env:",PORT);
app.listen(PORT, ()=>{
    console.log("Server Runningg");
})
module.exports=app;



