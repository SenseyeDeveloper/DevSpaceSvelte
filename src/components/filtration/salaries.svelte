<script>
    import Salary from "./salary.svelte"
    import localization from "../../i18n/ukrainian"
    import { createEventDispatcher } from "svelte";

    import {
        R_500_TO_1000,
        R_1000_TO_2000,
        R_2000_TO_3000,
        R_3000_TO_5000,
        R_5000_TO_MORE,
        R_ALL,
    } from "../../core/default_price_ranges";

    const dispatch = createEventDispatcher();

    export let value;

    function setSalaryRange(update) {
        value = update;

        dispatch("salary_changed", {
            value,
        });
    }

    function getRangeIndex() {
        if (value === R_5000_TO_MORE) {
            return 5;
        }

        if (value === R_3000_TO_5000) {
            return 4;
        }

        if (value === R_2000_TO_3000) {
            return 3;
        }

        if (value === R_1000_TO_2000) {
            return 2;
        }

        if (value === R_500_TO_1000) {
            return 1;
        }

        if (value === R_ALL) {
            return 0;
        }

        return 0;
    }

    $: index = getRangeIndex();
</script>

<div class="filters__it filter">
    <div class="filter__head">
        <p class="filter__h">{localization.salary}</p>
    </div>
    <div class="filter__body">
        <Salary group={index} value="{5}" on:change="{() => setSalaryRange(R_5000_TO_MORE)}">{localization.great} 5000$</Salary>
        <Salary group={index} value="{4}" on:change="{() => setSalaryRange(R_3000_TO_5000)}">3000–5000$</Salary>
        <Salary group={index} value="{3}" on:change="{() => setSalaryRange(R_2000_TO_3000)}">2000–3000$</Salary>
        <Salary group={index} value="{2}" on:change="{() => setSalaryRange(R_1000_TO_2000)}">1000–2000$</Salary>
        <Salary group={index} value="{1}" on:change="{() => setSalaryRange(R_500_TO_1000)}">{localization.less} 1000$</Salary>
        <Salary group={index} value="{0}" on:change="{() => setSalaryRange(R_ALL)}">{localization.show_all}</Salary>
    </div>
</div>