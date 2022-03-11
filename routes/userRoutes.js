//Core Module
const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

//----------> Exported from user controller file
// const getUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const createUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const getUser = (req, res) => {
//     res.status(500).json({userController.
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
//********************************************************/

router.route('/').get(userController.getUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
