import fs from 'fs';

const getLines = (dayNumber: number, filename: string = "input.txt"): string[] => {
    const raw = fs.readFileSync(`src/day${dayNumber}/${filename}`, 
        'utf-8');
    return raw.split("\n");
}

const getIntLines = (dayNumber: number, sorted: boolean = false, filename: string = "input.txt" ): number[] => {
    const numbers = getLines(dayNumber, filename).map(s => parseInt(s, 10));
    return sorted ? numbers.sort((a,b) => b-a) : numbers;
}

export { getLines, getIntLines }