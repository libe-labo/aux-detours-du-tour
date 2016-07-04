'use strict';

$(function() {
    var isLandscape;
    var isMobile = $(window).width() < 960;

    var currentSlide = 0;

    var backgroundMapSvgDocument;

    $('#background-map').each(function() {
        backgroundMapSvgDocument = $(this.getSVGDocument());
        this.addEventListener('load', function() {
            backgroundMapSvgDocument = $(this.getSVGDocument());
        });
    });

    var resizeSVGs = function() {
        isLandscape = $('.main-content__background__map').width() > $('.main-content__background__map').height() - 50;

        _.each(['.main-content__background__map object', '.main-content__sections__section__map__map'],function(selector) {
            $(selector).css({
                width : isLandscape ? '100%' : 'auto',
                height : isLandscape ? 'auto' : '100%'
            });
        });
    };

    // Main layout
    if (!isMobile) {
        var lastWas = ['', 0];
        $('#sections').fullpage({
            sectionSelector : '.main-content__sections__section',
            anchors : ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15'],
            onLeave: function(index, nextIndex, direction) {
                if (index > 1) {
                    var _index = index - 2;
                    var elem = $('#section-' + String(_index) + ' .main-content__sections__section__text'),
                        oldScrollTop = elem.scrollTop();
                    elem.scrollTop(elem.scrollTop() + (20 * (direction === 'down' ? 1 : -1)));
                    if (Math.abs(oldScrollTop - elem.scrollTop()) >= 5) {
                        return false;
                    } else {
                        if (lastWas[0] !== String(index) + direction) {
                            lastWas = [String(index) + direction, 0];
                            return false;
                        } else if (lastWas[1] < 5) {
                            ++lastWas[1];
                            return false;
                        }
                    }
                }

                currentSlide = nextIndex;

                // $('.dyn-color').css('color', [5, 6, 9, 10, 11, 12].indexOf(currentSlide) >= 0 ? '#0aa9af' : '#e61e49');

                $('.main-content__tooltip').css('display', 'none');
                $('#map-' + (index - 2)).css('opacity', 0).css('z-index', 1);
                $('#map-' + (nextIndex - 2)).css('opacity', 1).css('z-index', 500);
            }
        });

        $('.begin').on('click', function() {
            $.fn.fullpage.moveSectionDown();
        });
    } else {
        $('.main-content__sections__section').first().css('height', $(window).height());
    }

    // Cover title
    // $('.main-content__sections__section__text--cover h1').fitText(0.6);

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

        var isNowMobile = $(window).width() < 960;
        if (isNowMobile !== isMobile) {
            window.location.reload();
        }
    }, 100));

    resizeSVGs();

    // Twitter buttons
    $('.main-content__sections__section__text__hl__twitter').on('click', function(event) {
        event.preventDefault();

        var text = encodeURIComponent($(this).attr('rel')),
            url  = encodeURIComponent(window.location.href),
            link = 'https://twitter.com/intent/tweet?original_referer=' + '' + '&text=' + text + ' ' + url;

        window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
    });
});
