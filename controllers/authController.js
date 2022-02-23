const User = require("../models/UserModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const schedule = require("node-schedule");
const cloudinary = require("cloudinary").v2;
const os = require("os");

// Register a user => api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  console.log(" error don't know")
  // let result;
  // if (req.body.avatar) {
  //   const type = req.body.avatar.split(";")[0].split("/")[1];
  //   if (type !== "jpg" && type !== "png" && type !== "jpeg") {
  //     return next(
  //       new ErrorHandler("Only jpg, png and jpeg files are allowed", 400)
  //     );
  //   }
  //   result = await cloudinary.uploader.upload(req.body.avatar, {
  //     folder: "avatar",
  //     width: "150",
  //     crop: "scale",
  //   });
  // }
  const { username, name, email, password, phone, areaName, placeId } =
    req.body;
  const user = await User.create({
    username,
    name,
    email,
    password,
    phone,
    area: {
      areaName: areaName,
      placeId: placeId,
    },
    // avatar: {
    //   public_id: result && result.public_id,
    //   url: result && result.secure_url,
    // },
    billingAddress: " ",
    shippingAddress: " ",
    birthDay: "",
  });
  sendToken(user, 200, res);
});

// Login User => api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password, remember } = req.body;
  if (((!email || username) && (email || !username)) || !password) {
    return next(
      new ErrorHandler("Please enter username or email & password", 400)
    );
  }
  // Finding user in DB
  const user = await User.findOne({ $or: [{ email }, { username }] }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or username & password", 401));
  }
  // Checks if password is correct
  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or username & password", 401));
  }

  if (user.status !== "Active") {
    return next(
      new ErrorHandler(
        `your account is banned  ${
          "for " + user.ban.banPeriod + " days" ||
          (user.status === "Permanent Banned" && "permanently")
        } , contact with administrator`,
        401
      )
    );
  }
  user.lastLoginDate = Date.now();
  user.device = os.version();
  await user.save();
  sendToken(user, 200, res, remember);
});

// Logout user => api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get current login user profile=> api/v1/profile/:id
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Update profile => api/v1/profile/update/
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const {
    email,
    username,
    name,
    phone,
    gender,
    shippingAddress,
    billingAddress,
    birthDay,
    areaName,
    placeId,
  } = req.body;
  const newUserData = {
    name,
    email,
    username,
    phone,
    gender,
    shippingAddress,
    billingAddress,
    birthDay,
    area: {
      areaName: areaName,
      placeId: placeId,
    },
  };
  // update avatar
  if (req.body.avatar) {
    const user = await User.findById(req.user.id);
    if (user.avatar.public_id) {
      const image_id = user.avatar.public_id;
      await cloudinary.uploader.destroy(image_id);
    }
    const type = req.body.avatar.split(";")[0].split("/")[1];
    if (type !== "jpg" && type !== "png" && type !== "jpeg") {
      return next(
        new ErrorHandler("Only jpg, png and jpeg files are allowed", 400)
      );
    }
    result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatar",
      width: "150",
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
    context: "query",
  });
  res.status(200).json({
    success: true,
  });
});

// Update or change password => api/v1/password/update-password/:id
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check previous password
  const isMatch = await user.comparePassword(req.body.oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Old Password is incorrect"));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// Forgot password => api/v1/password/forgot-password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (!user) {
    return next(new ErrorHandler("User not exists", 401));
  }

  // Get reset token
  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // create reset password url
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset-password/${resetToken}`;
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `Your reset password token is as follow:\n\n${resetUrl}\n\nIf you haven't request it then ignore`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Go Mart Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password  => api/v1/password/reset-password/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(
      new ErrorHandler("reset password token is invalid or expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// Admin route
// Get All users /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// Get single users /api/v1/admin/user/
exports.getUsersDetails = catchAsyncErrors(async (req, res, next) => {
  const { email, username } = req.query;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    return next(
      new ErrorHandler(
        `User not found with ${
          (email && "email") || (username && "username")
        } of  ${email || username} `
      )
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Delete users /api/v1/admin/user/delete
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { email, username } = req.query;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    return next(
      new ErrorHandler(
        `User not found with ${
          (email && "email") || (username && "username")
        } of  ${email || username} `
      )
    );
  }
  // Remove avatar todo
  await user.remove();
  res.status(200).json({
    success: true,
  });
});

// Update user profile By Admin => api/v1/admin/user/update?email=email or api/v1/admin/user/update?username=username
exports.updateUserProfileByAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, username } = req.query;
  const {
    name,
    newEmail,
    newUsername,
    role,
    status,
    banPeriod,
    typeOfBanned,
    reason,
  } = req.body;
  const newUserData = {
    name,
    email: newEmail,
    username: newUsername,
    role,
    status: banPeriod ? "Banned" : "Active",
    ban: banPeriod && { banPeriod, reason, typeOfBanned, date: new Date() },
  };
  //If there is a ban, update the last ban field first, then the user when the ban term has ended.
  if (banPeriod > 0) {
    const banWithdrawDate = new Date(
      new Date().setMinutes(new Date().getMinutes() + banPeriod)
    );
    // remove the ban after the ban period ends
    schedule.scheduleJob(banWithdrawDate, async function () {
      await User.findOneAndUpdate(
        { $or: [{ email }, { username }] },
        {
          ban: { banPeriod: 0, reason: "", typeOfBanned: "", date: "" },
          status: "Active",
          lastBan: { $set: ["$ban"] },
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    });
  }
  await User.findOneAndUpdate({ $or: [{ email }, { username }] }, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});
