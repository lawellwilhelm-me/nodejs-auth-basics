const router = require('express').Router();
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware')
const { uploadImage, fetchImages, deleteImage } = require('../controllers/image-controller');
const uploadMiddleware = require('../middleware/upload-middleware');


router.post(
  '/upload', 
  authMiddleware, 
  adminMiddleware,
  uploadMiddleware.single('image'),
  uploadImage
);
router.get('', authMiddleware, fetchImages);
router.delete('/:id', authMiddleware, adminMiddleware, deleteImage);

module.exports = router;