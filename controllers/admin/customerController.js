const User = require("../../models/userSchema");

const customerInfo = async (req, res) => {
  try {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    const limit = 3;

    const data = await User.find({
      isAdmin: false,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments({
      isAdmin: false,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });

    console.log("Route Hit: /admin/users");

    // ✅ Render only once, with data
    console.log("userData:", data);
    res.render("customers", {
      data,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      search,
    });
  } catch (error) {
    console.error("Customer Info Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const customerBlocked=async(req,res)=>{
  try {
    let id=req.query.id;
    await User.updateOne({_id:id},{$set:{isBlocked:true}});
    res.redirect("/admin/users");
  } catch (error) {
    res.redirect("/pageerror");
    
  }
};
const customerunBlocked=async(req,res)=>{
try {

  let id=req.query.id;
  await User.updateOne({_id:id},{$set:{isBlocked:false}});
  res.redirect("/admin/users");

  
} catch (error) {
  res.redirect("/pageerror");
}
}
module.exports = {
  customerInfo,
  customerBlocked,
  customerunBlocked
};
