import { Dir } from "fs";
import { CLIENT_RENEG_LIMIT } from "tls";
import { getIntLines, getLines } from "../shared/fileReaderUtils";
const DAY = 4;

const MandatoryFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"] as const;
type MandatoryFieldType = (typeof MandatoryFields)[number];
interface PassportFieldValue {
    value: string;
    present: boolean;
    valid?: boolean;
}

type Passport = Record<MandatoryFieldType, PassportFieldValue>

const isNumberBetween = (v: string, min: number, max: number) => {
    const num = Number(v.length === 0 ? "a": v);
    return min <= num && num <= max;
}

const FieldMatchers: Record<MandatoryFieldType, (v: string) => boolean>  =  {
    byr: (v: string) => isNumberBetween(v, 1920, 2002),
    iyr: (v: string) => isNumberBetween(v, 2010, 2020),
    eyr: (v: string) => isNumberBetween(v, 2020, 2030),
    hgt: (v: string) => {
        if(v.endsWith("cm")){
            return isNumberBetween(v.split("cm")[0], 150, 193);
        }else if (v.endsWith("in")) {
            return isNumberBetween(v.split("in")[0], 59, 76);
        }else{
            return false;
        }
    },
    hcl: (v: string) => v.match(/^#([0-9]|[a-f]){6}$/) !== null,
    ecl: (v: string) => ["amb","blu","brn","gry","grn","hzl","oth"].includes(v),
    pid: (v: string) => v.match(/^[0-9]{9}$/) !== null
}

const getFromObject = (object: Record<string, string>, fieldName: string): PassportFieldValue => {
    return {
        present: fieldName in object,
        value: object[fieldName] || "",
    }
}
const toPassportData = (raw: string[]): Passport => {
    const object: {[key: string]: string} = raw
        .reduce((obj, item) => {
            var spl = item.split(":");
            obj[spl[0]] = spl[1];
            return obj;
        }, {} as Record<string, string>);

    return Object.assign({}, ...MandatoryFields.map(fieldName => ({[fieldName]: getFromObject(object, fieldName)})));
}

const toPassports = (rawLines: string[]): Passport[] => {
    const result: Passport[] = [];
    let currentGroup: string[] = [];
    for(const line of rawLines) {
        if(line === '') {
            result.push(toPassportData(currentGroup));
            currentGroup = [];
        } else {
            line.split(' ').forEach((value) => currentGroup.push(value));
        }
    }
    return result;
} 

const  matchPart1 = (passport: Passport) => Object.values(passport).every((passportField) => passportField.present);

const part1 = () => {
    const raw = getLines(DAY);
    const passportDataList = toPassports(raw);
    return passportDataList.filter((passport) => matchPart1(passport)).length;
}

const  matchPart2 = (passport: Passport) => {
    return Object.entries(passport).every(([key, value]) => FieldMatchers[key as MandatoryFieldType](value.value))
};
const testValid = (fun: (s: string) => boolean, value: string, text: string) => {
    if(!fun(value)) {
        throw Error(`Test ${text} failed for input ${value}`);
    }
}
const testInalid = (fun: (s: string) => boolean, value: string, text: string) => {
    if(fun(value)) {
        throw Error(`Test ${text} failed for input ${value}`);
    }
}
const tests2 = () => {
    testValid(FieldMatchers.byr, "2002", "BYR");
    testInalid(FieldMatchers.byr, "2003", "BYR");
    testValid(FieldMatchers.hgt, "60in", "hgt");
    testValid(FieldMatchers.hgt, "190cm", "hgt");
    testInalid(FieldMatchers.hgt, "190in", "hgt");
    testInalid(FieldMatchers.hgt, "190", "hgt");

    testValid(FieldMatchers.hcl, "#123abc", "hcl");
    testInalid(FieldMatchers.hcl, "123abz", "hcl");
    testInalid(FieldMatchers.hcl, "123abc", "hcl");

    testValid(FieldMatchers.ecl, "brn", "ecl");
    testInalid(FieldMatchers.ecl, "wat", "ecl");

    testValid(FieldMatchers.pid, "000000001", "pid");
    testInalid(FieldMatchers.pid, "0123456789", "pid");
};
const part2 = () => {
    const raw = getLines(DAY);
    const passportDataList = toPassports(raw);
    tests2();
    return passportDataList.filter((passport) => matchPart2(passport)).length;
}

export {
    part1,
    part2,
};