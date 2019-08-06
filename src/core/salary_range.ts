import Range from "./range"
import {
    R_1000_TO_2000,
    R_2000_TO_3000,
    R_3000_TO_5000,
    R_5000_TO_MORE,
    R_500_TO_1000,
    R_ALL
} from "./default_price_ranges";

export default function solveSalaryRange(value: Range): Range {
    if (value === null) {
        return R_ALL;
    }

    const priority = [
        R_5000_TO_MORE,
        R_3000_TO_5000,
        R_2000_TO_3000,
        R_1000_TO_2000,
        R_500_TO_1000,
    ];

    for (let i = 0; i < priority.length; i++) {
        const current = priority[i];

        if (value.equals(current)) {
            return current
        }
    }

    for (let i = 0; i < priority.length; i++) {
        const current = priority[i];

        if (value.great(current)) {
            return current
        }
    }

    return R_500_TO_1000;
}