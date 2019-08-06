<script>
    import { createEventDispatcher } from "svelte";
    import localization from "../../i18n/ukrainian"

    import SearchSVG from "../svg/search.svg.svelte"
    import CloseSWG from "../svg/close.svg.svelte"

    import {ENTER, ESCAPE} from "../../core/key_code"

    export let search;
    export let placeholder;

    export let fast;
    export let hintProvider;

    let focusState = false;
    let hintState = false;
    let searchHintList = [];

    const dispatch = createEventDispatcher();

    function select(item) {
        focus(false);
        hint(false);

        search = item.name;

        dispatch("change", {
            value: item,
        });
    }

    function clear() {
        search = "";

        dispatch("change", {
            value: null,
        });
    }

    function focus(state) {
        focusState = state;
    }

    function hint(state) {
        hintState = state;
    }

    function keyUp(keyCode) {
        switch (keyCode) {
            case ENTER:
                return;
            case ESCAPE:
                focus(false);
                hint(false);

                return;
            default:
                const hintState = search.length > 0;
                focus(true);
                hint(hintState);

                if (hintState) {
                    searchHintList = hintProvider(search);
                }

                return;
        }
    }

    $: focusClassName = focusState ? "search_focus" : "";
    $: hintClassName = hintState ? "search_hint" : "";
</script>

<div class="filters__it filter">
    <div class="filters__body">
        <div class="search {focusClassName} {hintClassName}">
            <div class="search__ctrl">
                <div class="search__wr">
                    <div class="search__in">
                        <input
                            type="text"
                            bind:value="{search}"
                            on:focus="{() => focus(true)}"
                            on:click="{() => focus(true)}"
                            on:keyup="{(event) => keyUp(event.keyCode)}"
                            placeholder="{placeholder}"
                            class="search__input"
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
                                <div class="btn__p">{searchHint.name}</div>
                            </div>
                        {/each}
                    {/if}
                    </div>
                </div>
            </div>
            <div class="search__help help">
                {#each fast as popular}
                    <div class="help__a" on:click="{() => select(popular)}"><span>{popular.name}</span></div>
                {/each}
            </div>
        </div>
    </div>
</div>