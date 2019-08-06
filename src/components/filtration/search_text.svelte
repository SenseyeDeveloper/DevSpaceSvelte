<script>
    import { createEventDispatcher } from "svelte";

    import ConfigSVG from "../svg/config.svg.svelte"
    import SearchSVG from "../svg/search.svg.svelte"
    import CloseSWG from "../svg/close.svg.svelte"

    import localization from "../../i18n/ukrainian"
    import {ENTER, ESCAPE} from "../../core/key_code"
    import {dataProviderHints} from "../../core/normalizer"

    const dispatch = createEventDispatcher();

    export let search;
    let searchHintList = [];

    function showConfiguration() {
        dispatch("show_configuration");
    }

    function focus(state) {
        dispatch("focus", {
            state,
        });
    }

    function hint(state) {
        dispatch("hint", {
            state,
        });
    }

    function searchSubmit() {
        focus(false);
        hint(false);

        dispatch("search_sumbit", {
            search,
        });
    }

    function keyUp(keyCode) {
        switch (keyCode) {
            case ENTER:
                searchSubmit();

                return;
            case ESCAPE:
                focus(false);
                hint(false);

                return;
            default:
                const hintState = search.length > 1;
                focus(true);
                hint(hintState);

                if (hintState) {
                    searchHintList = dataProviderHints(search);
                }

                return;
        }
    }

    function clear() {
        search = "";

        searchSubmit();
    }

    function select(hint) {
        search = hint;

        searchSubmit();
    }
</script>

<div class="search__ctrl">
    <div class="search__wr">
        <div class="search__in">
            <div class="search__config btn btn_40" on:click={showConfiguration}>
                <div class="btn__i">
                    <ConfigSVG/>
                </div>
            </div>
            <input
                type="text"
                class="search__input"
                bind:value="{search}"
                on:focus="{() => focus(true)}"
                on:click="{() => focus(true)}"
                on:keyup="{(event) => keyUp(event.keyCode)}"
                placeholder="{localization.placeholder.search}"
                autocomplete="off"
            />
            {#if search !== ""}
                <div class="search__x btn btn_40" on:click="{clear}">
                    <div class="btn__i">
                        <CloseSWG/>
                    </div>
                </div>
            {/if}
        </div>
        <div class="search__submit btn btn_40 fill_blue" on:click="{searchSubmit}">
            <div class="btn__i">
                <SearchSVG/>
            </div>
        </div>
    </div>
    <div class="search__hint">
        <div class="search__hint-body">
        {#if searchHintList.length === 0}
            <div class="search__hint-it btn btn_40">
                <div class="btn__i">
                    <SearchSVG/>
                </div>
                <div class="btn__p">{localization.empty}</div>
            </div>
        {:else}
            {#each searchHintList as searchHint }
                <div class="search__hint-it btn btn_40" on:click="{() => select(searchHint)}">
                    <div class="btn__i">
                        <SearchSVG/>
                    </div>
                    <div class="btn__p">{searchHint}</div>
                </div>
            {/each}
        {/if}
        </div>
    </div>
</div>