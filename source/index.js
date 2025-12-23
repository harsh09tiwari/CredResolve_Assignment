import express from 'express';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expense.route.js'; 
import groupRoutes from './routes/group.route.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', expenseRoutes);
app.use('/api', groupRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});