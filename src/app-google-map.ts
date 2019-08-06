import App from "./components/app.svelte";
import {POPUP_START} from "./core/popup";
import {googleMapApplicationLoaded, googleMapRender} from "./core/google-map-loader";
import dataProvider from "./core/fetch";
import unmarshal from "./core/zip";
import {Location} from "./core/location";

import {setUserAgentClassNames} from "./browser/navigator";
import urlStateContainer from "./core/url-state-container-instance";
import {R_ALL} from "./core/default_price_ranges";
import {
    CITY_CRITERIA_NAME, COMPANY_CRITERIA_NAME, COMPANY_PHOTO_EXISTS_CRITERIA_NAME, COMPANY_SIZE_CRITERIA_NAME,
    NEWEST_CRITERIA_NAME,
    REVIEW_COUNT_CRITERIA_NAME,
    SALARY_CRITERIA_NAME,
    SEARCH_QUERY_VACANCY,
    TOP_50_LARGEST_CRITERIA_NAME
} from "./core/names";
import FilterContainer from "./core/filtration/container";
import SalaryModifierBuilder from "./core/filtration/salary-modifier";
import ReviewsMatcherBuilder from "./core/filtration/reviews-matcher";
import TopLargestMatcherBuilder from "./core/filtration/top-largest-matcher";
import NewestModifierBuilder from "./core/filtration/newest-modifier";
import TitleModifierBuilder from "./core/filtration/title-modifer";
import {findCityByAlias, popularCities} from "./core/cities";
import {fillCompaniesProvider, findCompanyByAlias} from "./core/companies";
import CompanyMatcherBuilder from "./core/filtration/company-matcher";
import {City, Company} from "./core/entities";
import CityModifierBuilder from "./core/filtration/city-modifer";
import CompanyPhotoExistsMatcherBuilder from "./core/filtration/company-photo-exists-matcher";
import {companySizesFilterByExists} from "./core/company-sizes";
import CompanySizesMatcherBuilder from "./core/filtration/company-size-matcher";

const POPULAR_CITIES_LIMIT = 5;
const POPULAR_COMMPANIES_LIMIT = 5;

const body = document.body;

let companies = [];

function getSalaryCriteria() {
    return urlStateContainer.getCriteriaByName(SALARY_CRITERIA_NAME, null);
}

function getCompanySizesCriteria(): Array<string> {
    const aliases = urlStateContainer.getCriteriaByName(COMPANY_SIZE_CRITERIA_NAME, []);

    return companySizesFilterByExists(aliases);
}

function getSearchCriteria() {
    return urlStateContainer.getCriteriaByName(SEARCH_QUERY_VACANCY, "");
}

function getCompanyCriteria(): Company {
    const alias = urlStateContainer.getCriteriaByName(COMPANY_CRITERIA_NAME, "");

    return findCompanyByAlias(alias);
}

function getCityCriteria(): City {
    const alias = urlStateContainer.getCriteriaByName(CITY_CRITERIA_NAME, "");

    return findCityByAlias(alias);
}

function fetchCriteriaName(criteria: any): string {
    if (criteria === null) {
        return "";
    }

    // City or Company
    return criteria.name;
}

function getCheckedCriteria(name: string): boolean {
    return urlStateContainer.getCriteriaByName(name, false);
}

function getReviewsCriteria() {
    return getCheckedCriteria(REVIEW_COUNT_CRITERIA_NAME);
}

function getTopLargestCriteria() {
    return getCheckedCriteria(TOP_50_LARGEST_CRITERIA_NAME);
}

function getPhotoExistsCriteria() {
    return getCheckedCriteria(COMPANY_PHOTO_EXISTS_CRITERIA_NAME);
}

function getNewestCriteria() {
    return getCheckedCriteria(NEWEST_CRITERIA_NAME);
}

function setCheckedCriteriaCallback(name: string) {
    return function (event) {
        urlStateContainer.setCheckedCriteria(name, event.detail.checked);
    };
}

setUserAgentClassNames(body);

const app = new App({
    target: body,
    props: {
        popupOpenState: POPUP_START,

        search: getSearchCriteria(),
        selectedCityName: "", // will set on datd loaded
        selectedCompanyName: "", // will set on datd loaded
        salaryFilterValue: getSalaryCriteria(),
        companySizesFilterValue: getCompanySizesCriteria(),
        reviewsFilterValue: getReviewsCriteria(),
        topLargestFilterValue: getTopLargestCriteria(),
        newestFilterValue: getNewestCriteria(),
        photoExistsFilterValue: getPhotoExistsCriteria(),

        result: [],
        fastCities: [],
        fastCompanies: [],
    }
});

app.$on("city_changed", function (event) {
    const value = event.detail.value;

    urlStateContainer.setAliasCriteria(CITY_CRITERIA_NAME, value);
});

app.$on("company_changed", function (event) {
    const value = event.detail.value;

    urlStateContainer.setAliasCriteria(COMPANY_CRITERIA_NAME, value);
});

app.$on("salary_changed", function (event) {
    const value = event.detail.value;

    urlStateContainer.setOrDeleteCriteria(value !== R_ALL, SALARY_CRITERIA_NAME, value);
});

app.$on("company_sizes_changed", function (event) {
    const aliases = event.detail.aliases;

    urlStateContainer.setOrDeleteCriteria(aliases.length > 0, COMPANY_SIZE_CRITERIA_NAME, aliases);
});

app.$on("reviews_changed", setCheckedCriteriaCallback(REVIEW_COUNT_CRITERIA_NAME));
app.$on("in_top_largest_changed", setCheckedCriteriaCallback(TOP_50_LARGEST_CRITERIA_NAME));
app.$on("newest_changed", setCheckedCriteriaCallback(NEWEST_CRITERIA_NAME));
app.$on("photo_exists_changed", setCheckedCriteriaCallback(COMPANY_PHOTO_EXISTS_CRITERIA_NAME));

app.$on("search_sumbit", function (event) {
    const value = event.detail.search.trim();

    urlStateContainer.setOrDeleteCriteria(value !== "", SEARCH_QUERY_VACANCY, value);

    urlStateContainer.storeCurrentState();

    search();
});

const filterContainer = new FilterContainer(
    {
        // company matcher must be first
        [COMPANY_CRITERIA_NAME]: new CompanyMatcherBuilder(getCompanyCriteria),
        [REVIEW_COUNT_CRITERIA_NAME]: new ReviewsMatcherBuilder(getReviewsCriteria),
        [TOP_50_LARGEST_CRITERIA_NAME]: new TopLargestMatcherBuilder(getTopLargestCriteria),
        [COMPANY_PHOTO_EXISTS_CRITERIA_NAME]: new CompanyPhotoExistsMatcherBuilder(getPhotoExistsCriteria),
        [COMPANY_SIZE_CRITERIA_NAME]: new CompanySizesMatcherBuilder(getCompanySizesCriteria),
    },
    {
        [SEARCH_QUERY_VACANCY]: new TitleModifierBuilder(getSearchCriteria),
        [NEWEST_CRITERIA_NAME]: new NewestModifierBuilder(getNewestCriteria),
        [SALARY_CRITERIA_NAME]: new SalaryModifierBuilder(getSalaryCriteria),
        [CITY_CRITERIA_NAME]: new CityModifierBuilder(getCityCriteria),
    },
);

function search() {
    const result = filterContainer.filter(companies);

    googleMapRender(result);

    app.$set({
        result: result.slice(0, 50),
    });
}

function initOnce(source: Array<any>) {
    companies = unmarshal(source);

    fillCompaniesProvider(companies);

    const result = filterContainer.filter(companies);

    googleMapRender(result);

    app.$set({
        result: result.slice(0, 50),
        selectedCityName: fetchCriteriaName(getCityCriteria()),
        selectedCompanyName: fetchCriteriaName(getCompanyCriteria()),
        fastCities: popularCities().slice(0, POPULAR_CITIES_LIMIT),
        fastCompanies: companies.slice(0, POPULAR_COMMPANIES_LIMIT),
    });
}

app.$on("search", function (event) {
    urlStateContainer.storeCurrentState();

    search();
});


let zoom = urlStateContainer.getZoom();
if (zoom === 0) {
    const defaultZoom = 6;

    zoom = defaultZoom;
}

let center = urlStateContainer.getCenter();
if (center === null) {
    const defaultCenter = new Location(49.5106, 31.6016);

    center = defaultCenter;
}

googleMapApplicationLoaded(
    center,
    zoom,
    urlStateContainer.setCenter.bind(urlStateContainer),
    urlStateContainer.setZoom.bind(urlStateContainer),
);

dataProvider(initOnce, console.error);

export default app;