import {vacancyUrl, companyUrl, salary} from "./format"
import {Company} from "./entities";

export default class DataMarker {
    constructor(
        private readonly companies: Array<Company>,
    ) {}

    getTitle(): string {
        const titles = new Array(this.companies.length);

        for (let i = 0; i < this.companies.length; i++) {
            titles[i] = this.companies[i].name;
        }

        return titles.join(" | ");
    }

    getContent(): string {
        const contents = new Array(this.companies.length);

        for (let i = 0; i < this.companies.length; i++) {
            const company = this.companies[i];
            const vacancies = [];

            for (let vacancy of company.vacancies) {
                vacancies.push(`<a href="` + vacancyUrl(company.alias, vacancy.id) + `" target="_blank">` + vacancy.title + `</a>` + salary(vacancy.salary))
            }

            const office = company.offices[0];

            contents[i] = `<div class="gm-iw"><a class="gm-iw-t" href=${companyUrl(company.alias)} target="_blank"><b>${company.name}</b></a></br><p class="gm-iw-c">${office.address}</p>${vacancies.join("<br/>")}</div>`;
        }

        return contents.join("<br/><br/>");
    }
}

