const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { 
      username, email, password, 
      role } = req.body;
    
    const checkExistingUser = await User
      .findOne({ $or: [ { username }, { email }]});

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: 'username or email already exists.',
      })
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt
      .hash(password, salt)

    // Create new user
    const newUser = new User({
      username,
      email, 
      password: hashedPassword,
      role: role || 'user',
    })

    const savedUser = await newUser.save()

    if (!savedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to register user',
      })
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: savedUser
    })

  } catch(err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something wrong occured!'
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // current user exists?
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist',
      })
    }

    // is the password right?
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      return res.status(401).json({
        success: false,
        massage: 'Invalid credentials'
      })
    }

    // Create user token
    const accessToken = jwt.sign({
      userId: user.id,
      username: user.username,
      role: user.role,
    }, 
      process.env.JWT_SECRET_KEY,
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
    })

  } catch(err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something wrong occured!'
    })

  }
}

const changePassword = async (req, res) => {
  try {
    const { userId } = req.userInfo;

    // Extract old and new password
    const { oldPassword, newPassword } = req.body;

    // Find the current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(403).json({
        success: false,
        message: 'user not found',
      })
    }

    // Check if the old password is correct
    const isPasswordMatch = await bcrypt
      .compare(oldPassword, currentUser.password);

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: 'Old password not correct. Try again.'
      })
    }

    // Hashed the new password
    const salt = await bcrypt.genSalt(10);
    const updatedPassword = await bcrypt.hash(
      newPassword,
      salt
    )

    // Update current user password
    currentUser.password = updatedPassword;
    await currentUser.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    })

  } catch(err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong! Try again.'
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  changePassword,
}