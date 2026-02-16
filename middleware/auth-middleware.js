const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  const authHeaders = req.headers['authorization'];

  const token = authHeaders 
    && authHeaders.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied. Please, log in.',
    })
  }

  // Decode token
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    )

    req.userInfo = decodedToken;

    next();

  } catch(err) {
    //...
  }

}


module.exports = authMiddleware;