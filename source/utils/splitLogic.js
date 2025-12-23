export const calculateSplits = (totalAmount, splitType, members, splitDetails) => {
    let splits = [];
    
    // Split Type: EQUAL
    if (splitType === 'EQUAL') {
        const count = members.length;
        const share = Math.floor(totalAmount / count);
        const remainder = totalAmount % count; 

        members.forEach((memberId, index) => {
            let amount = share;
            if (index < remainder) amount += 1;
            splits.push({ userId: memberId, amount });
        });
    } 
    // Split Type: EXACT
    else if (splitType === 'EXACT') {
        const sum = splitDetails.reduce((acc, curr) => acc + curr.amount, 0);
        if (sum !== totalAmount) throw new Error(`Shares (${sum}) != Total (${totalAmount})`);
        splits = splitDetails;
    } 
    // Split Type: PERCENTAGE
    else if (splitType === 'PERCENTAGE') {
        const totalPercent = splitDetails.reduce((acc, curr) => acc + curr.percent, 0);
        if (totalPercent !== 100) throw new Error('Percentages must equal 100%');

        let calculatedSum = 0;
        splitDetails.forEach((item, index) => {
            let amount = Math.floor((totalAmount * item.percent) / 100);
            if (index === splitDetails.length - 1) amount = totalAmount - calculatedSum;
            else calculatedSum += amount;
            
            splits.push({ userId: item.userId, amount });
        });
    }
    return splits;
};