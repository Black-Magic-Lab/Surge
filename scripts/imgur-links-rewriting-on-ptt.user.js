// ==UserScript==
// @name        Imgur links rewriting on Ptt
// @namespace   https://github.com/gslin/imgur-links-rewriting-on-ptt
// @match       https://www.ptt.cc/bbs/*
// @match       https://www.ptt.cc/man/*
// @grant       GM_xmlhttpRequest
// @version     0.20240912.1
// @author      Gea-Suan Lin <gslin@gslin.com>
// @description Rewrite imgur links to bypass referrer check.
// @license     MIT
// ==/UserScript==

(() => {
    'use strict';

    const get_imgur_id_suffix = url => {
        const a = url.match(/^https?:\/\/(i\.|m\.)?imgur\.com\/(\w+)\.?(\w+)?/);
        return [a[2], a[3]];
    };
    const re_imgur_album = /^https?:\/\/imgur\.com\/(a|gallery)\//;

    document.querySelectorAll('a[href*="//imgur.com/"], a[href*="//i.imgur.com/"], a[href*="//m.imgur.com/"]').forEach(async el => {
        // Remove ".richcontent" if existing.
        const next = el.nextElementSibling;
        if (next && next.classList.contains('richcontent')) {
            next.remove();
        }

        // Remove ".richcontent" if existing.
        const next2 = el.parentElement.nextElementSibling;
        if (next2 && next2.classList.contains('richcontent')) {
            next2.remove();
        }

        // Remove ".richcontent" for ".push" case.
        const el_p2 = el.parentElement.parentElement;
        if (el_p2 && el_p2.classList.contains('push')) {
            const el_p2_next = el_p2.nextElementSibling;
            if (el_p2_next && el_p2_next.classList.contains('richcontent')) {
                el_p2_next.remove();
            }
        }

        const href = el.getAttribute('href');
        let imgur_id = '';
        let imgur_suffix = '';

        if (href.match(re_imgur_album)) {
            // album case.
            const res = await new Promise(resolve => {
                GM_xmlhttpRequest({
                    'anonymous': true,
                    'headers': {
                        'Referer': 'https://imgur.com/',
                    },
                    'method': 'GET',
                    'onload': res => {
                        resolve(res.responseText);
                    },
                    'url': href,
                });
            });

            const parser = new DOMParser();
            const doc = parser.parseFromString(res, 'text/html');

            const og_image = doc.querySelector('meta[property="og:image"]');
            const img_url = og_image.getAttribute('content');

            [imgur_id, imgur_suffix] = get_imgur_id_suffix(img_url);
        } else {
            // image case.
            [imgur_id, imgur_suffix] = get_imgur_id_suffix(href);
        }

        // Change to webp only if it's not gif.
        if (imgur_suffix !== 'gif') {
            imgur_suffix = 'webp';
        }

        const container = document.createElement('div');
        container.setAttribute('style', 'margin-top:0.5em;text-align:center;');

        const img = document.createElement('img');
        img.setAttribute('referrerpolicy', 'no-referrer');
        img.setAttribute('src', 'https://i.imgur.com/' + imgur_id + '.' + imgur_suffix);
        container.appendChild(img);

        el.insertAdjacentElement('afterend', container);
    });
})();
