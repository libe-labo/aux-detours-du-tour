'use strict';

$(function() {
    var isLandscape;
    var isBackgroundZoomed = false;

    var zoomBackground = function() {
        if (isLandscape) {
            $('.main-content__background__map object').css({
                width: '300%',
                height : 'auto'
            });
        } else {
            $('.main-content__background__map object').css({
                width: 'auto',
                height : '300%'
            });
        }
    };

    var resizeSVGs = function() {
        isLandscape = $('.main-content__background__map').width() > $('.main-content__background__map').height() - 50;

        _.each(['.main-content__background__map object', '.main-content__content__map object'],function(selector) {
            $(selector).css({
                width : isLandscape ? '100%' : 'auto',
                height : isLandscape ? 'auto' : '100%'
            });
        });

        if (isBackgroundZoomed) {
            zoomBackground();
        }
    };

    var unzoomBackground = function() {
        resizeSVGs();
    };

    // Main layout
    $('#sections').fullpage({
        sectionSelector : '.main-content__sections__section',
        onLeave : function(index, nextIndex) {
            if (nextIndex === 3) {
                zoomBackground();
            } else if (index === 3) {
                unzoomBackground();
            }
        }
    });

    // Cover title
    $('.main-content__sections__section__text--cover h1').fitText(0.5);

    // Navigation
    $('.main-content__navigate--up').click(function(event) {
        event.preventDefault();
        $.fn.fullpage.moveSectionUp();
    });

    $('.main-content__navigate--down').click(function(event) {
        event.preventDefault();
        $.fn.fullpage.moveSectionDown();
    });

    // Handle window resize event
    $(window).resize(_.debounce(function() {
        resizeSVGs();
    }, 100));

    resizeSVGs();
});
