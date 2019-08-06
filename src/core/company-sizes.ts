import {createAliasMap} from "./alias-map";

export const CS_1500 = "1500+";
export const CS_800 = "800—1500";
export const CS_200 = "200—800";
export const CS_81 = "81—200";
export const CS_1 = "1—80";

export const COMPANY_SIZES = [
    CS_1500,
    CS_800,
    CS_200,
    CS_81,
    CS_1,
];

export function companySizesFilterByExists(aliases: Array<string>): Array<string> {
    if (aliases.length === 0) {
        return aliases;
    }

    const aliasMap = createAliasMap(aliases, true);

    const result = [];

    for (let i = 0; i < COMPANY_SIZES.length; i++) {
        const size = COMPANY_SIZES[i];

        if (aliasMap.hasOwnProperty(size)) {
            result.push(size);
        }
    }

    return result;
}