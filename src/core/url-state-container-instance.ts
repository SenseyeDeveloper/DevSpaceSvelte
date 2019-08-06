import UrlStateContainer from "./url-state-container"
import {
    CITY_CRITERIA_NAME,
    COMPANY_CRITERIA_NAME,
    COMPANY_PHOTO_EXISTS_CRITERIA_NAME,
    COMPANY_SIZE_CRITERIA_NAME,
    COMPANY_TYPE_CRITERIA_NAME,
    NAMES,
    NEWEST_CRITERIA_NAME,
    REVIEW_COUNT_CRITERIA_NAME,
    SALARY_CRITERIA_NAME,
    SEARCH_QUERY_VACANCY,
    TOP_50_LARGEST_CRITERIA_NAME
} from "./names";
import {
    CheckedCriteriaConverter,
    IdentityCriteriaConverter,
    AliasCriteriaConverter,
    MultiSelectCriteriaConverter,
} from "./criteria-converter";
import SalaryRangeCriteriaConverter from "./salary-criteria-converter";

const multiCheckboxCriteriaConverter = new AliasCriteriaConverter();
const identityCriteriaConverter = new IdentityCriteriaConverter();
const checkedCriteriaConverter = new CheckedCriteriaConverter();
const multiSelectCriteriaConverter = new MultiSelectCriteriaConverter();
const salaryCriteriaConverter = new SalaryRangeCriteriaConverter();

const instance = new UrlStateContainer(NAMES, {
    [REVIEW_COUNT_CRITERIA_NAME]: checkedCriteriaConverter,
    [TOP_50_LARGEST_CRITERIA_NAME]: checkedCriteriaConverter,
    [SEARCH_QUERY_VACANCY]: identityCriteriaConverter,
    [COMPANY_CRITERIA_NAME]: multiCheckboxCriteriaConverter,
    [CITY_CRITERIA_NAME]: multiCheckboxCriteriaConverter,
    [NEWEST_CRITERIA_NAME]: checkedCriteriaConverter,
    [COMPANY_PHOTO_EXISTS_CRITERIA_NAME]: checkedCriteriaConverter,
    [SALARY_CRITERIA_NAME]: salaryCriteriaConverter,
    [COMPANY_SIZE_CRITERIA_NAME]: multiSelectCriteriaConverter,
    [COMPANY_TYPE_CRITERIA_NAME]: multiSelectCriteriaConverter,
}, 500);

export default instance;