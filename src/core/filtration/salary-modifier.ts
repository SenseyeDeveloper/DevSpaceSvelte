import Range from "../range";
import {ModifierBuilder} from "./modifier";
import VacancyModifier from "./vacancy-modifier";

export default class SalaryModifierBuilder implements ModifierBuilder {
    constructor(
        private readonly state: () => Range,
    ) {
    }

    build(): SalaryModifier {
        const range = this.state();

        if (range === null) {
            return null;
        }

        return new SalaryModifier(range);
    }
}

class SalaryModifier extends VacancyModifier {
    constructor(criteria: Range) {
        let from = criteria.from;
        let to = criteria.to;

        if (to === 0) {
            to = Number.MAX_SAFE_INTEGER;
        }

        super(function (vacancy) {
            if (vacancy.salary === "") {
                return false;
            }

            return salaryBetweenRange(vacancy.salary, from, to);
        });
    }
}

function salaryBetweenRange(source, from, to) {
    const strings = source.split("–");
    const salaries = [];

    for (let i = 0; i < strings.length; i++) {
        const salary = parseInt(strings[i].replace(/\D/g, ""), 10);

        if (between(from, to, salary)) {
            return true;
        }

        salaries.push(salary);
    }

    if (salaries.length === 1) {
        salaries[1] = salaries[0];
    }

    return between(salaries[0], salaries[1], from) || between(salaries[0], salaries[1], to);
}

function between(from, to, value) {
    return from <= value && value <= to;
}