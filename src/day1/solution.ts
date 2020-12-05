import { getIntLines, getLines } from "../shared/fileReaderUtils";
const DAY = 1;


const part1 = () => {
    const sortedExpenses = getIntLines(DAY, true);

    for(const item1 of sortedExpenses) {
        for(const item2 of sortedExpenses) {
            if(item1 + item2  === 2020) {
                    return item1*item2;
            }
        }
    }
    
}

const part2 = () => {
    const sortedExpenses = getIntLines(DAY);

    for(let i1 = 0; i1 < sortedExpenses.length; i1++) {
        const item1 = sortedExpenses[i1];
        for(let i2 = 0; i2 <= sortedExpenses.length; i2++) {
            const item2 = sortedExpenses[i2];
            for(let i3 = 0; i3 <= sortedExpenses.length; i3++) {
                const item3 = sortedExpenses[i3];
                if(item1 + item2 + item3 === 2020) {
                    return item1*item2*item3;
                }
            }
        }
    }
    
}

export {
    part1,
    part2,
};