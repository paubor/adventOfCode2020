import { Dir } from "fs";
import { CLIENT_RENEG_LIMIT } from "tls";
import { getIntLines, getLines } from "../shared/fileReaderUtils";
const DAY = 5;


type Divide = ""
enum Command {
    Front = "F",
    Back = "B",
    Left = "L",
    Right = "R"
}

//[4,5,6,7,8,9,10,11,12,13,14,15] -> 4, 4+floor((15-4)/2) -> 4,4+floor(11/2) -> 4,9
const lowerHalf = (lower: number, upper: number): [number,number] => {
    return [lower, lower+Math.floor((upper-lower)/2)];
}
//[4,5,6,7,8,9,10,11,12,13,14,15] -> [15-floor((15-4)/2),15] -> [15-6,15] -> 
const upperHalf =  (lower: number, upper: number): [number, number] => {
    return [upper-Math.floor((upper-lower)/2),upper];
}

const toSeatNumber = (commands: Command[]): number => {
    let rowRange:[number, number] = [0, 127];
    let colRange:[number, number] = [0, 7];
    for(const command of commands) {
        switch(command) {
            case Command.Front:
                //Lower Half [rowRange[0], ]
                rowRange = lowerHalf(...rowRange);
                break;
            case Command.Back:
                rowRange = upperHalf(...rowRange);
                break;
            case Command.Left:
                colRange = lowerHalf(...colRange);
                break;
            case Command.Right:
                colRange = upperHalf(...colRange);
                break;
        }
        
    }

    if(rowRange[0] !== rowRange[1] || colRange[0] !== colRange[1]) {
        throw Error("Problematic sequence "+commands);
    }

    return rowRange[0] * 8 + colRange[0];
}

const toCommands = (s: string) : Command[] => {
    let commands = [];
    for(let i= 0; i< s.length; i++) {
        commands.push(s.charAt(i) as Command);
    }
    return commands;
}

const part1 = () => {
    const seatNumbers = getLines(DAY)
        .map(toCommands)
        .map(toSeatNumber);

    return Math.max(...seatNumbers);
}

const part2 = () => {
    const seatNumbers = getLines(DAY)
        .map(toCommands)
        .map(toSeatNumber);
    const maxId = Math.max(...seatNumbers);

    const seats = [];
    for(const seatNumber of seatNumbers) {
        seats[seatNumber] = seatNumber;
    }
   
    //Remove leading seats until they have a seatnumber allocated, since those are the missing ones
    //e.g.[x,x,x,x,x,x,6,7,8,....] -> [6,7,8,9....]
    while(seats[0] === undefined) {
        seats.shift();
    }
    //Now find the first seat which is free and add the first available seat
    //Since we removed the leading seats without a seatnumber allocated,
    //we have to add the first 
    //[6,7,8,...,99,undefined,101,102,103,104,105,106]
    //Now the new index of undefined is a number which is lower because we removed the undefined before, so we need to add 6 in this case
    return seats.findIndex((seat) => seat === undefined) + seats[0];
}

export {
    part1,
    part2,
};