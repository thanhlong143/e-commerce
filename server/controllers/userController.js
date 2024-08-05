const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail");
const crypto = require("crypto");
const makeToken = require("uniqid");
const { btoa, atob } = require("buffer");
const { users } = require("../utils/contants");

const register = asyncHandler(async (req, res) => {
   const { email, password, firstname, lastname, mobile } = req.body;
   if (!email || !password || !firstname || !lastname || !mobile) {
      return res.status(400).json({
         success: false,
         message: "Missing inputs"
      });
   }
   const userEmail = await User.findOne({ email });
   const userMobile = await User.findOne({ mobile });
   if (userEmail) {
      throw new Error("This email address already exists");
   } else if (userMobile) {
      throw new Error("This phone number address already exists");
   } else {
      const token = makeToken();
      const emailEdited = btoa(email) + "@" + token;
      const newUser = await User.create({
         email: emailEdited,
         password: password,
         firstname: firstname,
         lastname: lastname,
         mobile: mobile
      });
      if (newUser) {
         const html = `<h2>Mã đăng ký:</h2><br/><blockquote>${token}</blockquote>`;
         await sendMail({ email, html, subject: "Xác nhận đăng ký tài khoản!" });
      }
      setTimeout(async () => {
         await User.deleteOne({ email: emailEdited });
      }, [180000])
      return res.json({
         success: newUser ? true : false,
         message: newUser ? "Please check your email to active account" : "Something went wrong, please try again!"
      });
   }
});

const finalRegister = asyncHandler(async (req, res) => {
   // const cookie = req.cookies;
   const { token } = req.params;
   const notActiveEmail = await User.findOne({ email: new RegExp(`${token}$`) })
   if (notActiveEmail) {
      notActiveEmail.email = atob(notActiveEmail.email.split("@")[0]);
      notActiveEmail.save();
   }
   return res.json({
      success: notActiveEmail ? true : false,
      message: notActiveEmail ? "Register is successfully. Please go login!" : "Something went wrong, please try again!"
   });
});

const login = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({
         success: false,
         message: "Missing inputs"
      })
   }

   const response = await User.findOne({ email });
   if (response && await response.isCorrectPassword(password)) {
      const { password, role, refreshToken, ...userData } = response.toObject();
      const accessToken = generateAccessToken(response._id, role);
      const newRefreshToken = generateRefreshToken(response._id);

      await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true });
      res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return res.status(200).json({
         success: true,
         accessToken,
         userData
      });
   } else {
      throw new Error("Wrong email or password!");
   }
});

const getCurrent = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const user = await User.findById(_id).select("-refreshToken -password");
   return res.status(200).json({
      success: user ? true : false,
      result: user ? user : "User not found"
   });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   const cookie = req.cookies;

   if (!cookie || !cookie.refreshToken) {
      throw new Error("No refresh token in cookies");
   }

   const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
   const response = await User.findOne({ _id: result._id, refreshToken: cookie.refreshToken });
   return res.status(200).json({
      success: response ? true : false,
      newAccessToken: response ? generateAccessToken(response._is, response.role) : "Refresh token is not match"
   });
});

const logout = asyncHandler(async (req, res) => {
   const cookie = req.cookies;
   if (!cookie || !cookie.refreshToken) {
      throw new Error("No refresh token in cookies");
   }
   await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: "" }, { new: true });
   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true
   });
   localStorage.clear()
   return res.status(200).json({
      success: true,
      message: "Logout is done"
   })
});

const forgotPassword = asyncHandler(async (req, res) => {
   const { email } = req.body;
   if (!email) {
      throw new Error("Missing email!");
   }
   const user = await User.findOne({ email });
   if (!user) {
      throw new Error("User not found!");
   }
   const resetToken = user.createPasswordChangedToken();
   await user.save();
   const html = `Xin vui lòng click vào đường link dưới đây để thay đổi mật khẩu. Link này sẽ hết hạn sau 15 phút. <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" >Click here</a>`;
   const data = {
      email,
      html,
      subject: "Forgot Password"
   }
   const result = await sendMail(data);
   return res.status(200).json({
      success: result.response?.includes("OK") ? true : false,
      message: result.response?.includes("OK") ? "Hãy kiểm tra email của bạn!" : "Đã có lỗi, hãy thử lại sau!"
   })
});

const resetPassword = asyncHandler(async (req, res) => {
   const { password, token } = req.body;
   if (!password || !token) {
      throw new Error("Missing inputs");
   }
   const passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
   const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } });
   if (!user) {
      throw new Error("Invalid reset token!");
   }
   user.password = password;
   user.passwordResetToken = undefined;
   user.passwordChangeAt = Date.now();
   user.passwordResetExpires = undefined;
   await user.save();
   return res.status(200).json({
      success: user ? true : false,
      message: user ? "Updated password" : "Something went wrong"
   })
})

const getUsers = asyncHandler(async (req, res) => {
   const queries = { ...req.query };
   const excludeFields = ["limit", "sort", "page", "fields"];
   excludeFields.forEach(element => delete queries[element]);
   let queryString = JSON.stringify(queries);
   queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedElement => `$${matchedElement}`);
   const formatedQueries = JSON.parse(queryString);
   if (queries?.name) { formatedQueries.name = { $regex: queries.name, $options: "i" } }

   if (req.query.q) {
      delete formatedQueries.q;
      formatedQueries["$or"] = [
         { firstname: { $regex: req.query.q, $options: "i" } },
         { lastname: { $regex: req.query.q, $options: "i" } },
         { email: { $regex: req.query.q, $options: "i" } },
      ]
   }

   let sortBy = {};
   if (req.query.sort) { sortBy = req.query.sort.split(",").join(" "); }

   let fields = {};
   if (req.query.fields) { fields = req.query.fields.split(",").join(" "); }

   const page = +req.query.page || 1
   const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
   const skip = (page - 1) * limit;

   await User.find(formatedQueries).skip(skip).limit(limit).select(fields).sort(sortBy)
      .then(async (response) => {
         const count = await User.find(formatedQueries).countDocuments();
         return res.status(200).json({
            success: response ? true : false,
            count,
            users: response ? response : "Cannot get users",
         });
      })
      .catch((error) => { return error; })
})

const deleteUsers = asyncHandler(async (req, res) => {
   const { uid } = req.params;
   const response = await User.findByIdAndDelete(uid);
   return res.status(200).json({
      success: response ? true : false,
      message: response ? `User with email ${response.email} deleted` : "No user delete"
   })
})

const updateUser = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   if (!_id || Object.keys(req.body).length === 0) {
      throw new Error("Missing inputs")
   }
   const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select("-password -role -refreshToken");
   return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong!"
   })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
   const { uid } = req.params;
   if (Object.keys(req.body).length === 0) {
      throw new Error("Missing inputs")
   }
   const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select("-password -role -refreshToken");
   return res.status(200).json({
      success: response ? true : false,
      message: response ? "Updated" : "Something went wrong!"
   })
});

const updateUserAddress = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   if (!req.body.address) {
      throw new Error("Missing inputs")
   }
   const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select("-password -role -refreshToken");
   return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong!"
   })
});

const updateUserCart = asyncHandler(async (req, res) => {
   const _id = req.user._id;
   const { pid, quantity, color } = req.body;

   if (!pid || !quantity || !color) {
      throw new Error("Missing inputs")
   }
   const user = await User.findById(_id);
   const alreadyProduct = user?.cart?.find(element => element.product.toString() === pid);
   if (alreadyProduct) {
      if (alreadyProduct.color === color) {
         const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity } }, { new: true });
         return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : "Something went wrong!"
         });
      } else {
         const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true });
         return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : "Something went wrong!"
         });
      }
   } else {
      const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true });
      return res.status(200).json({
         success: response ? true : false,
         updatedUser: response ? response : "Something went wrong!"
      });
   }
});

const createUsers = asyncHandler(async (req, res) => {
   const response = await User.create(users);
   return res.status(200).json({
      success: response ? true : false,
      users: response ? response : "Something went wrong!"
   });
});

module.exports = {
   register,
   login,
   getCurrent,
   refreshAccessToken,
   logout,
   forgotPassword,
   resetPassword,
   getUsers,
   deleteUsers,
   updateUser,
   updateUserByAdmin,
   updateUserAddress,
   updateUserCart,
   finalRegister,
   createUsers,

}