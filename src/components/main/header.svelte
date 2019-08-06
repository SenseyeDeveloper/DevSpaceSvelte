<script>
    import localization from "../../i18n/ukrainian"

    const title = localization.title;
</script>

<header class="header">
    <div class="header__r gr">
        <div class="header__c gc">
            <a class="header__logo logo" href="/">
                <img class="logo__img" src="favicon.png" alt="{title}" title="{title}"/>
                <span class="logo__p">DevSpace</span>
            </a>
            <div class="header__menu">
                <a href="/about">{localization.pages.about}</a>
                <a href="/faq">{localization.pages.faq}</a>
            </div>
        </div>
    </div>
</header>