const User = require("../../models/userSchema");


// const customerInfo=async(req,res)=>{
//     try {
        
//         let search="";
//         if(req.query.search){
//             search=req.query.search;
//         }
//         let page=1;
//         if(req.query.page){
//             if(req.query.page){
//                 page=req.query.page
//             }
//         }
//         const limit=3
//         const userData=await User.find({
//             isAdmin:false,
//             $or:[
//                 {name:{$regex:".*"+search+".*"}},
//                 {email:{$regex:".*"+search+".*"}}
//             ],
//         }) 
//         .limit(limit*1)
//         .skip((page-1)*limit)
//         .exec();
//         const count=await User.find({
//              isAdmin:false,
//             $or:[
//                 {name:{$regex:".*"+search+".*"}},
//                 {email:{$regex:".*"+search+".*"}}
//             ],
//         }).countDocuments();
//         res.render('customers')
//         console.log("Route Hit: /admin/users");
// res.send("Customer route working");

//         } catch (error) {
        
//     }
// }
const customerInfo = async (req, res) => {
    try {
        res.render("admin/customers"); // ✅ Correct view path
        console.log("Route Hit: /admin/users"); // Optional debug log
    } catch (error) {
        console.error(error);
    }
}
module.exports={
    customerInfo,
}