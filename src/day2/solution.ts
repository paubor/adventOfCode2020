import { getIntLines, getLines } from "../shared/fileReaderUtils";
const DAY = 2;

const LINE_REGEX = /(\d*)-(\d*) (.): (.*)/

interface PasswordSpec {
    from: number;
    to: number;
    letter: string;
    rawPassword: string;
}

const isValid1  = (spec?: PasswordSpec): boolean => {
    if(!spec) {
        return false;
    }
    const {rawPassword, letter, from, to} = spec;
    const match = rawPassword.match(new RegExp(letter, "g")) || [];
    return match.length <= to && match.length >= from;
}

const isValid2  = (spec?: PasswordSpec): boolean => {
    if(!spec) {
        return false;
    }
    const {rawPassword, letter, from, to} = spec;
    const matches = [rawPassword.charAt(from-1), rawPassword.charAt(to-1)];
    
    return matches.filter(c => c === letter).length === 1;
} 

const mapToPasswordSpec = (line: string): PasswordSpec | undefined => {
    const matching = line.match(LINE_REGEX);
    if(matching === null) {
        console.error("Impossible to match: ", line);
        return undefined;
    }
    return {
        from: parseInt(matching[1], 10),
        to: parseInt(matching[2], 10),
        letter: matching[3],
        rawPassword: matching[4],
    }
}

const part1 = () => {
    const raw = getLines(DAY)
        .map(line => mapToPasswordSpec(line))
        .filter(spec => isValid1(spec))
    
    return raw.length;
}

const part2 = () => {
    const raw = getLines(DAY)
        .map(line => mapToPasswordSpec(line))
        .filter(spec => isValid2(spec));

    return  raw.length;
    
}

export {
    part1,
    part2,
};