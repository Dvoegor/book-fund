const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
require('dotenv').config({ path: '.env' });

router.get('/', (req, res) => {
  res.status(200).send('auth');
});

router.post('/', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const profile = await Profile.findAll({
    where: { email: email, password: password },
    raw: true,
  });
  const user = profile[0];
  if (!user) {
    return res.status(200).send('Неверные данные');
  }
  const userId = user.id;
  const isAdmin = user.is_admin;
  const payload = { id: userId, admin: isAdmin };
  const token = jwt.sign(payload, process.env.SECRET);
  res.setHeader('auth-token', token);
  res.status(200).send('Верные данные');
});

module.exports = router;
