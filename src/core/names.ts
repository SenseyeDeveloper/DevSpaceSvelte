const map = {};
const list = [];

function unique(key: string): string {
    if (map.hasOwnProperty(key)) {
        throw new Error(`already exists: ${key}`);
    }

    map[key] = true;
    list.push(key);

    return key;
}

export const SEARCH_QUERY_VACANCY = unique("vacancy-query");
export const CITY_CRITERIA_NAME = unique("vacancy-city");
export const REVIEW_COUNT_CRITERIA_NAME = unique("company-review");
export const TOP_50_LARGEST_CRITERIA_NAME = unique("company-top-50-largest");
export const COMPANY_CRITERIA_NAME = unique("company");
export const NEWEST_CRITERIA_NAME = unique("vacancy-newest");
export const SALARY_CRITERIA_NAME = unique("vacancy-salary");
export const COMPANY_SIZE_CRITERIA_NAME = unique("company-size");
export const COMPANY_TYPE_CRITERIA_NAME = unique("company-type");
export const COMPANY_PHOTO_EXISTS_CRITERIA_NAME = unique("company-photo-exists");
export const NAMES = list;
