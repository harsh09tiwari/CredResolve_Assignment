import express from 'express';
import { createGroup, getAllGroups, getGroupBalance, getGroupMembers } from '../controllers/group.controller.js'; // Note .js

const router = express.Router();
router.get('/', getAllGroups);
router.post('/create', createGroup);
router.get('/id/:groupId/balance', getGroupBalance);
router.get('/id/:groupId/members', getGroupMembers);

export default router;