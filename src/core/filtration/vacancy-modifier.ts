import {Modifier} from "./modifier";
import {Company, Vacancy} from "../entities";

export default class VacancyModifier implements Modifier {
    constructor(
        private readonly matcher: (vacancy: Vacancy) => boolean,
    ) {
    }

    modify(company: Company) {
        const matchVacancies = [];
        const matcher = this.matcher;

        for (let j = 0; j < company.vacancies.length; j++) {
            const vacancy = company.vacancies[j];

            if (matcher(vacancy)) {
                matchVacancies.push(vacancy);
            }
        }

        if (matchVacancies.length > 0) {
            return new Company(
                company.alias,
                company.name,
                company.offices,
                matchVacancies,
                company.review_count,
                company.employee_count,
                company.type,
                company.top50Largest,
                company.photoExists,
            );
        }

        return null;
    }
}