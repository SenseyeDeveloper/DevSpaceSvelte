<script>
    import { createEventDispatcher } from "svelte";
    import localization from "../../i18n/ukrainian"
    import {R_3000_TO_5000} from "../../core/default_price_ranges"
    import {hintCitiesProvider} from "../../core/cities"
    import {hintCompaniesProvider} from "../../core/companies"

    import CloseSVG from "../svg/close.svg.svelte"
    import Salaries from "../filtration/salaries.svelte"
    import SearchAlias from "../filtration/search_alias.svelte"
    import CompanySizes from "../filtration/company_sizes.svelte"
    import Additional from "../filtration/additional.svelte"

    export let open;

    // filters
    export let salaryFilterValue;
    export let companySizesFilterValue;
    export let reviewsFilterValue;
    export let topLargestFilterValue;
    export let newestFilterValue;
    export let photoExistsFilterValue;

    // filter pretty view
    export let selectedCityName;
    export let selectedCompanyName;

    // fast
    export let fastCities;
    export let fastCompanies;

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function search() {
        dispatch("search");

        dispatch("close");
    }

    function cityChanged(event) {
        dispatch("city_changed", {
            value: event.detail.value,
        });
    }

    function companyChanged(event) {
        dispatch("company_changed", {
            value: event.detail.value,
        });
    }

    $: openClassName = open ? "pop_open" : "";
</script>

<div class="popup-filter sn_popup_filter pop pop_up pop_slide_from_left {openClassName}">
    <div class="pop__mask"></div>
    <div class="pop__out">
        <div class="pop__out-h">{localization.configuration}</div>
        <div class="pop__out-x pop__x btn btn_40" on:click={close}>
            <div class="btn__i">
                <CloseSVG/>
            </div>
        </div>
    </div>
    <div class="pop__in">
        <div class="pop__wr">
            <div class="pop__body">
                <div class="filters">
                    <Salaries
                        value="{salaryFilterValue}"
                        on:salary_changed
                    />
                    <SearchAlias
                        search="{selectedCityName}"
                        fast="{fastCities}"
                        hintProvider="{hintCitiesProvider}"
                        placeholder="{localization.city}"
                        on:change="{cityChanged}"
                    />
                    <SearchAlias
                        search="{selectedCompanyName}"
                        fast="{fastCompanies}"
                        hintProvider="{hintCompaniesProvider}"
                        placeholder="{localization.company}"
                        on:change="{companyChanged}"
                    />
                    <CompanySizes
                        sizes="{companySizesFilterValue}"
                        on:company_sizes_changed
                    />
                    <Additional
                        reviews="{reviewsFilterValue}"
                        on:reviews_changed
                        topLargest="{topLargestFilterValue}"
                        on:in_top_largest_changed
                        newest="{newestFilterValue}"
                        on:newest_changed
                        photoExists="{photoExistsFilterValue}"
                        on:photo_exists_changed
                    />
                    <div class="filters__it filters__it_btn" on:click={search}>
                        <div class="btn btn_50">
                            <div class="btn__c">{localization.search}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

