<script>
    import { createEventDispatcher } from "svelte";

    import SearchText from "../filtration/search_text.svelte"
    import CloseSVG from  "../svg/close.svg.svelte"

    import localization from "../../i18n/ukrainian"

    export let open;
    export let search;
    let focusState = false;
    let hintState = false;

    $: openClassName = open ? "pop_open" : "";
    $: focusClassName = focusState ? "search_focus" : "";
    $: hintClassName = hintState ? "search_hint" : "";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function focus(event) {
        focusState = event.detail.state;
    }

    function hint(event) {
        hintState = event.detail.state;
    }
</script>

<div class="popup-map sn_popup_map pop pop_up {openClassName}">
    <div class="pop__out">
        <div class="search {focusClassName} {hintClassName}">
            <SearchText
                bind:search
                on:show_configuration
                on:search_sumbit
                on:focus="{focus}"
                on:hint="{hint}"
            />
        </div>
        <div class="pop__out-x pop__x btn btn_40" on:click={close}>
            <div class="btn__i">
                <CloseSVG/>
            </div>
        </div>
    </div>
    <div class="pop__in">
        <div class="pop__wr">
            <div class="pop__body">
                <div class="popup-map__map" id="map"></div>
            </div>
        </div>
    </div>
</div>