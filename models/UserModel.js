const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please Enter Your username'],
        maxLength: [20, 'Your Username cannot exceed 20 characters'],
        unique: true,
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'Please Enter Your name'],
        maxLength: [255, 'Your name cannot exceeds 255 characters'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please Enter Your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid Email address']
    },
    phoneNumber:{
        type: String,
        trim: true,
        required: [true, 'Please Enter Your Phone Number'],
        unique: true, 
    },
    gender:{
        type: String,
        enum: {values:['','male', 'female']}
    },
    area:{
        areaName: {
            type: String,
            trim: true,
            required: [true, 'Please Enter Area Name'],
        },
        placeId: {
            type: String,
        }
    },
    birthDay:{
        type: String,
    },
    address: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    postalCode: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your password'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    lastLoginDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: [
                'Active',
                'Banned',
                'Restricted'
            ],
        },
        default: 'Active'
    },
    ban: {
        date: {
            type: Date,
        },
        typeOfBanned: {
            type: String,
        },
        banPeriod: {
            type: Number,
        },
        reason: {
            type: String,
        }
    },
    lastBan: {
        date: {
            type: Date,
        },
        typeOfBanned: {
            type: String,
        },
        banPeriod: {
            type: Number,
        },
        reason: {
            type: String,
        }
    }
    ,
    accountCreatedAt: {
        type: String,
        default: `${new Date().toDateString()} Time ${((new Date().getHours() % 12) || 12)}:${new Date().getMinutes()} ${((new Date().getHours() >= 12 ? 'pm' : 'am'))}`,
    },
    device: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
})

// Encrypting password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password, async (err, result) => {
        return result
    })
}

// Return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION
    });
}

// Generate password reset token
userSchema.methods.getPasswordResetToken = function () {
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // set token expire time
    this.resetPasswordExpires = Date.now() + 5 * 60 * 1000

    return resetToken;
}
module.exports = mongoose.model('User', userSchema);