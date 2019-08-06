<script>
    export let value;
    export let group;
</script>

<div class="filter__it">
    <label>
        <input
            type="radio"
            name="salary"
            value="{value}"
            bind:group
            on:change
        />
        <span><slot></slot></span>
    </label>
</div>