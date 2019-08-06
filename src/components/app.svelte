<script>
    import MapPopup from "./popup/map.svelte"
    import ConfigPopup from "./popup/config.svelte"
    import Header from "./main/header.svelte"
    import Main from "./main/main.svelte"
    import Footer from "./main/footer.svelte"

    import {POPUP_MAP, POPUP_CONFIG, POPUP_NONE} from "../core/popup";
    import {googleMapElementLoaded} from "../core/google-map-loader";

    export let popupOpenState;
    export let result;

    // filters
    export let search;
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

    let beforePopupOpenState;

    function setConfigPopupOpen() {
        beforePopupOpenState = popupOpenState;

        popupOpenState = POPUP_CONFIG;
    }

    function setMapPopupOpen() {
        popupOpenState = POPUP_MAP;
    }

    function setBeforeStatePopupOpen() {
        popupOpenState = beforePopupOpenState;
    }

    function setNonePopupOpen() {
        popupOpenState = POPUP_NONE;
    }

    $: popupOpenStateMap = googleMapElementLoaded(popupOpenState === POPUP_MAP)
</script>

<div id="root">
    <Header/>
    <Main
        bind:search
        on:search_sumbit

        on:show_map="{setMapPopupOpen}"
        on:show_configuration="{setConfigPopupOpen}"
        result="{result}"
    />
    <Footer/>
    <MapPopup
        bind:search
        on:search_sumbit

        open="{popupOpenStateMap}"
        on:show_configuration="{setConfigPopupOpen}"
        on:close="{setNonePopupOpen}"
    />
    <ConfigPopup
        open="{popupOpenState === POPUP_CONFIG}"
        on:close="{setBeforeStatePopupOpen}"

        salaryFilterValue="{salaryFilterValue}"
        companySizesFilterValue="{companySizesFilterValue}"
        reviewsFilterValue="{reviewsFilterValue}"
        topLargestFilterValue="{topLargestFilterValue}"
        newestFilterValue="{newestFilterValue}"
        photoExistsFilterValue="{photoExistsFilterValue}"

        selectedCityName="{selectedCityName}"
        selectedCompanyName="{selectedCompanyName}"

        fastCities="{fastCities}"
        fastCompanies="{fastCompanies}"

        on:search
        on:city_changed
        on:company_changed
        on:salary_changed
        on:company_sizes_changed
        on:reviews_changed
        on:in_top_largest_changed
        on:newest_changed
        on:photo_exists_changed
    />
</div>