import express from 'express';
import { createUser, getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/create', createUser);
router.get('/getAll', getAllUsers);

export default router;