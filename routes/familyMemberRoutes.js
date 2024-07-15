const express = require('express');
const { createFamilyMember, getFamilyMembersByUser } = require('../controllers/familyMemberController');

const router = express.Router();

router.post('/', createFamilyMember);
router.get('/user/:userId', getFamilyMembersByUser);

module.exports = router;
