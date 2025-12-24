import db from '../config/db.js';
import { simplifyDebts } from '../utils/balanceLogic.js';

export const createGroup = async (req, res) => {
    const { name, memberIds } = req.body;
    if (!name || !memberIds || memberIds.length === 0) return res.status(400).json({ error: 'Invalid data' });

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [groupResult] = await connection.query('INSERT INTO expense_groups (name) VALUES (?)', [name]);
        const newGroupId = groupResult.insertId;
        const memberValues = memberIds.map(userId => [newGroupId, userId]);
        await connection.query('INSERT INTO group_members (group_id, user_id) VALUES ?', [memberValues]);
        await connection.commit();
        res.status(201).json({ message: 'Group created', groupId: newGroupId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};


export const getGroupBalance = async (req, res) => {
    const { groupId } = req.params;
    try {
        const [expenses] = await db.query('SELECT * FROM expenses WHERE group_id = ?', [groupId]);

        if (expenses.length === 0) {
            return res.json({ groupId, transactions: [] });
        }
        const expenseIds = expenses.map(e => e.id);
        const [splits] = await db.query('SELECT * FROM expense_splits WHERE expense_id IN (?)', [expenseIds]);

        let balances = {}; 

        expenses.forEach(exp => {
            balances[exp.payer_id] = (balances[exp.payer_id] || 0) + exp.amount;
        });

        splits.forEach(split => {
            balances[split.user_id] = (balances[split.user_id] || 0) - split.amount_owed;
        });

        const userIds = Object.keys(balances);
        const [users] = await db.query('SELECT id, name FROM users WHERE id IN (?)', [userIds]);
        const userMap = new Map(users.map(user => [user.id.toString(), user.name]));

        const summary = Object.keys(balances).map(userId => {
            return {
                userId,
                userName: userMap.get(userId), 
                netBalance: (balances[userId] / 100).toFixed(2), 
                status: balances[userId] > 0 ? "Gets back money" : 
                        balances[userId] < 0 ? "Owes money" : "Settled"
            };
        });

        const simplifiedTransactions = simplifyDebts({ ...balances });

        const readableTransactions = simplifiedTransactions.map(t => ({
            fromUser: t.from,
            toUser: t.to,
            amount: (t.amount / 100).toFixed(2)
        }));

        res.json({ 
            groupId, 
            currency: "INR", 
            summary,               
            simplifiedDebts: readableTransactions 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllGroups = async (req, res) => {
    try {
        const [groups] = await db.query('SELECT * FROM expense_groups');
        res.json({groups});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Add this to controllers/groupController.js

export const getGroupMembers = async (req, res) => {
    const { groupId } = req.params;

    try {
        // Fetch users linked to this group ID
        const [members] = await db.query(
            `SELECT u.id, u.name, u.email, u.mobile 
             FROM users u 
             JOIN group_members gm ON u.id = gm.user_id 
             WHERE gm.group_id = ?`,
            [groupId]
        );

        if (members.length === 0) {
            return res.status(404).json({ message: "Group not found or has no members" });
        }

        res.json({ groupId, members });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};