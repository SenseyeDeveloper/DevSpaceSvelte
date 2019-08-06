<script>
    import localization from "../../i18n/ukrainian"
    import { createEventDispatcher } from "svelte";

    export let reviews;
    export let topLargest;
    export let newest;
    export let photoExists;

    const dispatch = createEventDispatcher();

    function setReviews(checked) {
        dispatch("reviews_changed", {
            checked,
        });
    }

    function setPhotoExists(checked) {
        dispatch("photo_exists_changed", {
            checked,
        });
    }

    function setLargest(checked) {
        dispatch("in_top_largest_changed", {
            checked,
        });
    }

    function setNewest(checked) {
        dispatch("newest_changed", {
            checked,
        });
    }
</script>

<div class="filters__it filter">
    <div class="filter__head">
        <p class="filter__h">{localization.additional}</p>
    </div>
    <div class="filter__body">
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{reviews}"
                    on:change="{(e) => setReviews(e.target.checked)}"
                />
                <span>{localization.company_with_reviews}</span>
            </label>
        </div>
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{photoExists}"
                    on:change="{(e) => setPhotoExists(e.target.checked)}"
                />
                <span>{localization.photo_exists}</span>
            </label>
        </div>
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{topLargest}"
                    on:change="{(e) => setLargest(e.target.checked)}"
                />
                <span>{localization.company_in_top_largest}</span>
            </label>
        </div>
        <div class="filter__it">
            <label>
                <input
                    type="checkbox"
                    checked="{newest}"
                    on:change="{(e) => setNewest(e.target.checked)}"
                />
                <span>{localization.last_week}</span>
            </label>
        </div>
    </div>
</div>