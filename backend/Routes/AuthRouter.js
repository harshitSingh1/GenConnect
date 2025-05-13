// backend\Routes\AuthRouter.js
const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const { getProfile, updateProfile } = require('../Controllers/AuthController');

router.get('/profile', ensureAuthenticated, getProfile);
router.put('/update-profile', ensureAuthenticated, updateProfile);

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
const UserModel = require("../Models/User");
router.get("/users", async (req, res) => {
  let query = {};
  if (req.query.profileType) query.profileType = req.query.profileType;
  if (req.query.skills) query.skills = req.query.skills;
  if (req.query.interests) query.interests = req.query.interests;
  if (req.query.searchQuery) query.name = new RegExp(req.query.searchQuery, "i");

  const users = await UserModel.find(query);
  res.json({ users });
});
  

module.exports = router;

