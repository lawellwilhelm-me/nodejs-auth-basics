const isAdminuser = (req, res, next) => {

  const currentUserRole = req.userInfo.role;

  if (currentUserRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin right required',
    })
  }

  next();
}

module.exports = isAdminuser;