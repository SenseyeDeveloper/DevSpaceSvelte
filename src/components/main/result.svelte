<script>
    import {companyUrl, vacancyUrl, salary} from "../../core/format"

    export let result;
</script>

{#if result.length > 0 }
<div class="tabs__body">
    <div class="tabs__it tabs__it_active">
        <div class="result__list">
            {#each result as company }
                <div class="result__it">
                    <div class="company">
                        <div class="company__head">
                            <a class="company__name" href="{companyUrl(company.alias)}" target="_blank">{company.name}</a>
                        </div>
                        <div class="company__body">
                            <div class="company__vacancies">
                                {#each company.vacancies as vacancy }
                                    <div class="company__vacancies-it">
                                        <a class="company__vacancy vacancy" href="{vacancyUrl(company.alias, vacancy.id)}" target="_blank">
                                            <span class="vacancy__name">{vacancy.title} {salary(vacancy.salary)}</span>
                                        </a>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
{/if}