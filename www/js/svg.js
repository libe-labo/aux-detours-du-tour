'use strict';

$(function() {
    var tsv;
    d3.tsv('assets/steps.tsv').row(function(d) {
        return {
            mapId : +d['Id Carte'],
            stepId : +d['Étape'],
            label : d.Texte
        };
    }).get(function(error, rows) {
        tsv = _.groupBy(rows, 'mapId');
        for (var i in tsv) {
            if (tsv.hasOwnProperty(i)) {
                tsv[i] = _.indexBy(tsv[i], 'stepId');
            }
        }
    });
    var dptsTsv;
    d3.tsv('assets/dpts.tsv').row(function(d) {
        return {
            dpt : d['Département'],
            '2' : d['2'],
            '3' : d['3'],
            '4' : d['4'],
            '6' : d['6']
        };
    }).get(function(error, rows) {
        dptsTsv = _.groupBy(rows, 'dpt');
    });
    var townTsv;
    d3.tsv('assets/towns.tsv').row(function(d) {
        return {
            town : d.Ville,
            n : d['Départs et arrivées']
        };
    }).get(function(error, rows) {
        townTsv = _.groupBy(rows, 'town');
    });
    var belgiumTsv;
    d3.tsv('assets/belgium.tsv').row(function(d) {
        return {
            town : d.Ville,
            n : d['Départs et arrivées']
        };
    }).get(function(error, rows) {
        belgiumTsv = _.groupBy(rows, 'town');
    });
    var countriesTsv;
    d3.tsv('assets/countries.tsv').row(function(d) {
        return {
            country : d.Pays,
            n : d['Départs et arrivées']
        };
    }).get(function(error, rows) {
        countriesTsv = _.groupBy(rows, 'country');
    });

    var moveTooltip = function(x, y) {
        x = x - ($('.main-content__tooltip').width() / 2);
        y = y > $(window).height() / 2 ? y - $('.main-content__tooltip').height() - 40 : y + 40;

        $('.main-content__tooltip').css({
            top : y,
            left : x
        });
    };

    var getPrologIfNeeded = function(mapId, name) {
        // if (mapId === 9 && name === 'Dunkerque' ||
        //     mapId === 11 && name === 'Nantes' ||
        //     mapId === 12 && name === 'Liège') {
        //     return tsv[mapId][0].label;
        // }
        return name;
    };

    var getText = function(mapId, name) {
        if ([2, 3, 4, 7].indexOf(mapId) >= 0) {
            if (dptsTsv[name] != null) {
                name = name + ' : ' + dptsTsv[name][0][mapId];
            }
        } else if ([5, 6].indexOf(mapId) >= 0) {
            if (townTsv[name] != null) {
                name = name + ' : ' + townTsv[name][0].n;
            }
        } else if ([8, 9].indexOf(mapId) >= 0) {
            if (countriesTsv[name] != null) {
                name = name + ' : ' + countriesTsv[name][0].n;
            }
        } else if ([10, 11].indexOf(mapId) >= 0) {
            if (belgiumTsv[name] != null) {
                name = name + ' : ' + belgiumTsv[name][0].n;
            }
        }
        return name;
    };

    var svgHandlers = [];
    for (var i = 0; i < 15; ++i) {
        svgHandlers[i] = function(svgDocument, mapId) {
            mapId = parseInt(mapId.replace(/[^0-9]/g, ''));
            _.each(['.hover', 'polygon', 'circle', 'path', 'ellipse'], function(selector) {
                svgDocument.find(selector).on('mouseenter', function() {
                    if ($(this).attr('id') == null) { return; }
                    var name = $(this).attr('id').replace(/_x27_/g, '\'')
                                                 .replace(/_x29_/g, '-')
                                                 .replace(/_[0-9]+_/, '')
                                                 .replace(/_/g, ' ');
                    if (name.toUpperCase().indexOf('FRANCE') < 0 && name.toUpperCase().indexOf('XMLID') < 0) {
                        if (name.indexOf('etape') >= 0) {
                            name = tsv[mapId][name.replace(/[^0-9]/g, '')].label;
                        }
                        name = getPrologIfNeeded(mapId, name);
                        name = getText(mapId, name);
                        $(this).css('cursor', 'pointer');
                        $('.main-content__tooltip').text(name).css('display', 'block');
                        $(this).on('mousemove', function(event) {
                            var offset = $('#overmap-' + mapId).offset();
                            if ($('#overmap-' + mapId).css('display') === 'none') {
                                offset = $('#map-' + mapId).offset();
                            }
                            moveTooltip(event.pageX + offset.left,
                                        event.pageY + offset.top);
                        }).on('mouseleave', function() {
                            $('.main-content__tooltip').css('display', 'none');
                        });
                    }
                });
            });
        }.bind(this);
    }

    $('.main-content__sections__section__map__map').each(function(index) {
        this.addEventListener('load', (function(index) {
            return function() {
                var svgDocument = $(this.getSVGDocument());
                svgHandlers[index](svgDocument, $(this).attr('id'));
            };
        })(index));
    });
});
