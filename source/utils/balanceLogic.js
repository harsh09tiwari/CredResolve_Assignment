export const simplifyDebts = (balances) => {
    let debtors = [];
    let creditors = [];

    for (const [userId, amount] of Object.entries(balances)) {
        if (amount < 0) debtors.push({ userId, amount });
        if (amount > 0) creditors.push({ userId, amount });
    }

    debtors.sort((a, b) => a.amount - b.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const transactions = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        let debtor = debtors[i];
        let creditor = creditors[j];
        let amount = Math.min(Math.abs(debtor.amount), creditor.amount);

        transactions.push({ from: debtor.userId, to: creditor.userId, amount });

        debtor.amount += amount;
        creditor.amount -= amount;

        if (Math.abs(debtor.amount) < 1) i++;
        if (creditor.amount < 1) j++;
    }
    return transactions;
};