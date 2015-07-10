#!/usr/bin/env node
'use strict';

var handlebars = require('handlebars');
var fs = require('fs');
var d3 = require('d3');

var template = fs.readFileSync('template.html', { encoding : 'utf-8' });
var cover = d3.tsv.parse(fs.readFileSync('data.tsv', { encoding : 'utf-8'}), function(d) {
    var id = parseInt(d.Id);
    return {
        id : +id,
        title : new handlebars.SafeString(d.Titre.replace('XXIe', 'XXI<sup>e</sup>').replace(/\n/g, '<br />')),
        text : d.Texte.replace('XXIe', 'XXI<sup>e</sup>').replace('11e', '11<sup>e</sup>').split('\n'),
        svg : d.SVG,
        hasN1 : (d['Chiffre 1'] || '').length > 0,
        n1 : {
            n : new handlebars.SafeString((d['Chiffre 1'] || '').replace('8e', '8<sup>e</sup>')),
            tweet : d['Tweet chiffre 1'],
            text : new handlebars.SafeString((d['Texte chiffre 1 '] || '').replace('8e', '8<sup>e</sup>'))
        },
        hasN2 : (d['Chiffre 2'] || '').length > 0,
        n2 : {
            n : d['Chiffre 2'],
            tweet : d['Tweet chiffre 2'],
            text : new handlebars.SafeString(d['Texte chiffre 2'])
        },
        isBlue : [5, 6, 9, 10, 11, 12].indexOf(id) >= 0 ? 'mobile-blue' : '',
        showMap : [5, 6, 7, 8].indexOf(id) >= 0,
        mapTitle : new handlebars.SafeString((d['Titre carte'] != null ? d['Titre carte'] : '').replace(/\n/g, '<br />').replace('XXIe', 'XXI<sup>e</sup>')),
        mapLegend : d['SVG Légende'],
        hasX : (d.x || '').length > 0,
        x : new handlebars.SafeString(d.x),
        hasN2Mob : (d['Texte chiffre trop long pour mobile'] || '').length > 0,
        n2Mob : d['Texte chiffre trop long pour mobile'],
        hasSpecialMobileMap : id === 7
    };
});

for (var i = 0; i < cover.length; ++i) {
    var j;
    for (j = 0; j < cover[i].text.length; ++j) {
        if (j === 0 && cover[i].hasX) {
            var twitter = '<a href="#" class="main-content__sections__section__text__hl__twitter" rel="' + cover[i].n1.tweet + '"><i class="fa fa-twitter"></i></a>';
            cover[i].text[j] = '<span class="dyn-color">' + cover[i].x + twitter + '</span>' + cover[i].text[j];
        }
        cover[i].text[j] = new handlebars.SafeString(cover[i].text[j]);
    }
}

var sections = cover.splice(1).sort(function(a, b) {
    return a.id - b.id;
});
cover = cover[0];

fs.writeFileSync('www/index.html', handlebars.compile(template)({
    cover : cover,
    sections : sections
}), { encoding : 'utf-8' });
