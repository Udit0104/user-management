const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getUsers, getUserById, createUser, updateUser, deleteUser,
} = require('../controllers/user.controller');

router.use(protect);

router.get('/', authorize('admin', 'manager'), getUsers);
router.post('/', authorize('admin'), createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
