<script>
    import localization from "../../i18n/ukrainian"
    import {createAliasMap, filterAliasMap} from "../../core/alias-map"
    import {CS_1500, CS_800, CS_200, CS_81, CS_1} from "../../core/company-sizes"
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let sizes;

    const sizeCheckedMap = createAliasMap(sizes, true);

    function update(aliases) {
        dispatch("company_sizes_changed", {
            aliases,
        });
    }

    function checked(alias) {
        return sizeCheckedMap.hasOwnProperty(alias) && sizeCheckedMap[alias] === true;
    }

    function change(alias, checked) {
        sizeCheckedMap[alias] = checked;

        update(filterAliasMap(sizeCheckedMap));
    }
</script>

<div class="filters__it filter">
    <div class="filter__head">
        <p class="filter__h">{localization.company_size}</p>
    </div>
    <div class="filter__body">
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{checked(CS_1500)}"
                    on:change="{(e) => change(CS_1500, e.target.checked)}"
                />
                <span>{localization.great} 1500</span>
            </label>
        </div>
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{checked(CS_800)}"
                    on:change="{(e) => change(CS_800, e.target.checked)}"
                />
                <span>800–1500</span>
            </label>
        </div>
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{checked(CS_200)}"
                    on:change="{(e) => change(CS_200, e.target.checked)}"
                />
                <span>200–800</span>
            </label>
        </div>
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{checked(CS_81)}"
                    on:change="{(e) => change(CS_81, e.target.checked)}"
                />
                <span>80–200</span>
            </label>
        </div>
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{checked(CS_1)}"
                    on:change="{(e) => change(CS_1, e.target.checked)}"
                />
                <span>{localization.less} 80 {localization.humans}</span>
            </label>
        </div>
    </div>
</div>