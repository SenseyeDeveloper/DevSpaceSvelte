export function vacancyUrl(companyAlias, vacancyId) {
    return `https://jobs.dou.ua/companies/${companyAlias}/vacancies/${vacancyId}/`;
}

export function companyUrl(alias) {
    return `https://jobs.dou.ua/companies/${alias}/`;
}

export function salary(value) {
    if (value) {
        return " (" + value + ")"
    }

    return "";
}