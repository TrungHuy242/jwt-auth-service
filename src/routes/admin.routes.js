const express = require('express');
const { getAllUsers } = require('../controllers/admin.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, getAllUsers);

module.exports = router;