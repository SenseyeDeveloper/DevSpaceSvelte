<script>
    import { createEventDispatcher } from "svelte";

    import SearchText from "../filtration/search_text.svelte"
    import Result from "./result.svelte"

    import localization from "../../i18n/ukrainian"

    export let result;
    export let search;
    let focusState = false;
    let hintState = false;

    $: focusClassName = focusState ? "search_focus" : "";
    $: hintClassName = hintState ? "search_hint" : "";

    const dispatch = createEventDispatcher();

    function showMap() {
        dispatch("show_map");
    }

    function focus(event) {
        focusState = event.detail.state;
    }

    function hint(event) {
        hintState = event.detail.state;
    }
</script>

<main class="main">
    <div class="index__head gr">
        <div class="gc">
            <div class="index__h1 h1">{localization.header.title}</div>
        </div>
    </div>
    <div class="main-tabs tabs">
        <div class="tabs__body gr">
            <div class="index__body gc">
                <div class="index__content">
                    <div class="tabs__it tabs__it_active">
                        <div class="main-tabs__search search sn__search search_result {focusClassName} {hintClassName}">
                            <SearchText
                                bind:search
                                on:show_configuration
                                on:search_sumbit
                                on:focus="{focus}"
                                on:hint="{hint}"
                            />
                            <div class="search__result result">
                                <div class="tabs tabs_btn">
                                    <div class="tabs__head">
                                        <div class="tabs__nav">
                                            <div class="tabs__nav-it">
                                                <div class="tabs__tab tabs__tab_active btn btn_30"><div class="btn__c">{localization.list}</div></div>
                                            </div>
                                            <div class="tabs__nav-it" on:click={showMap}>
                                                <div class="tabs__tab btn btn_30"><div class="btn__c">{localization.map}</div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <Result result="{result}"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>