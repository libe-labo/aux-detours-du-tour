'use strict';

$(function() {
    $('#sections').fullpage({
        sectionSelector : '.main-content__sections__section'
    });

    $('.main-content__sections__section__text--cover h1').fitText(0.5);
});
