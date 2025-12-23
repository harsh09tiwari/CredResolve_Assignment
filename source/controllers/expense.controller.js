import db from '../config/db.js';
import { calculateSplits } from '../utils/splitLogic.js';

export const addExpense = async (req, res) => {
    const { groupId, payerId, description, amount, splitType, splitDetails } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [group] = await connection.query('SELECT * FROM expense_groups WHERE id = ?', [groupId]);
        if (group.length === 0) throw new Error('Group not found');

        const [members] = await connection.query('SELECT user_id FROM group_members WHERE group_id = ?', [groupId]);
        const memberIds = members.map(m => m.user_id);

        const finalSplits = calculateSplits(amount, splitType, memberIds, splitDetails);

        const [expenseResult] = await connection.query(
            'INSERT INTO expenses (group_id, payer_id, description, amount, split_type) VALUES (?, ?, ?, ?, ?)',
            [groupId, payerId, description, amount, splitType]
        );
        
        const expenseId = expenseResult.insertId;
        const splitValues = finalSplits.map(s => [expenseId, s.userId, s.amount]);
        
        await connection.query(
            'INSERT INTO expense_splits (expense_id, user_id, amount_owed) VALUES ?',
            [splitValues]
        );

        await connection.commit();
        res.status(201).json({ message: 'Expense added', expenseId });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
};