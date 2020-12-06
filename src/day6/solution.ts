import { group } from "console";
import { Dir } from "fs";
import { exit } from "process";
import { CLIENT_RENEG_LIMIT } from "tls";
import { getIntLines, getLines } from "../shared/fileReaderUtils";
const DAY = 6;

type Person = number;
interface Group {
    numberOfPeople: number;
    questions: Set<string>;
    questionSets: string[][];
}

const questionsAnsweredPerGroup = (lines: string[]): Group[] => {
    let group: Group = {
        numberOfPeople: 0,
        questions: new Set<string>(),
        questionSets: [],
    };
    const questionsPerGroup: Group[] = []
    for(const line of lines){
        const trimmed = line.trim();
        if(trimmed === "") {
            questionsPerGroup.push(group);
            group = {
                numberOfPeople: 0,
                questions: new Set<string>(),
                questionSets: [],
            }
            
        }else{
            group.numberOfPeople++;
            group.questionSets.push(trimmed.split(''));
            trimmed.split('').forEach((question) => group.questions.add(question));
        }
    }
    questionsPerGroup.push(group);

    return questionsPerGroup;
}

const part1 = () => {
    const raw = getLines(DAY);
    const questionsPerGroup = questionsAnsweredPerGroup(raw);
    return questionsPerGroup.map(m => m.questions.size).reduce((a,b) => a+b);
}

const part2 = () => {
    const raw = getLines(DAY);
    const questionsPerGroup = questionsAnsweredPerGroup(raw);
    return questionsPerGroup
        .map((group) => Array.from(group.questions)
            .filter(question => group.questionSets.every(questions => questions.includes(question)))
            .length)
        .reduce((a,b) => a+b);
}

export {
    part1,
    part2,
};