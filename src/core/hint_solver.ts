import {MAX_HINT_LIMIT} from "./settings";

// one time allocate on program start
const result = new Array<string>(MAX_HINT_LIMIT);

export default function solve(s: string, names: Array<string>, items: Array<any>, limit: number): Array<any> {
    const normalize = s.toLowerCase();
    const length = names.length;
    let resultSize = 0;

    for (let i = 0; i < length; i++) {
        const name = names[i];

        if (name.indexOf(normalize) !== -1) {
            result[resultSize] = items[i];
            resultSize += 1;

            if (resultSize >= limit) {
                break;
            }
        }
    }

    // one allocation
    return result.slice(0, resultSize);
}