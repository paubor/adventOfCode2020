import { Dir } from "fs";
import { CLIENT_RENEG_LIMIT } from "tls";
import { getIntLines, getLines } from "../shared/fileReaderUtils";
const DAY = 3;

enum Direction {
    Right, Down
}

interface SlopeSection {
    right: number,
    down: number,
}

interface GridPosition {
    x: number;
    y: number;
}
enum Ground {
    Tree = "#",
    Nothing = "."
}

const slopes: SlopeSection[] = [{ right: 1, down: 1}, {right: 3, down: 1}, {right: 5, down: 1}, { right: 7, down: 1}, {right: 1, down:2}]


const parseLine = (line: string): Ground[] => {
    const ground = [];
    for(const c of line) {
        switch(c) {
            case "#": 
                ground.push(Ground.Tree);
                break;
            case ".":
                ground.push(Ground.Nothing);
                break;
            default:
                break;
        }
    }
    return ground;
}

const updatePosition = (position: GridPosition, slope: SlopeSection, grid: Ground[][], patternLength: number) => {
    position.x +=slope.down;
    position.y = (position.y + slope.right) % grid[patternLength-1].length;
}

const part1 = () => {
    const grid = getLines(DAY)
        .map(line => parseLine(line));
        console.log(grid[323])
    const patternLength = grid[0].length;
    let position = {
        x: 0,
        y: 0,
    }
    let numberOfTrees = 0;
    while(position.x < grid.length) {
        updatePosition(position, {right: 3, down: 1}, grid, patternLength)
        if(position.x < grid.length) {
            const ground = grid[position.x][position.y]
            numberOfTrees += (ground === Ground.Tree ? 1 : 0)
        }
    }
    return numberOfTrees;
}

const part2 = () => {
    const grid = getLines(DAY)
        .map(line => parseLine(line));
        console.log(grid[323])
    const patternLength = grid[0].length;
    let treesSeen = []
    for(const slope of slopes){
        let position = {
            x: 0,
            y: 0,
        }
        let numberOfTrees = 0;
        while(position.x < grid.length) {
            updatePosition(position, slope, grid, patternLength)
            if(position.x < grid.length) {
                const ground = grid[position.x][position.y]
                numberOfTrees += (ground === Ground.Tree ? 1 : 0)
            }
        }
        treesSeen.push(numberOfTrees);
    }
    return treesSeen.reduce((a,b) => a*b);
}

export {
    part1,
    part2,
};