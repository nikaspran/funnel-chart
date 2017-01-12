import './polyfills.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/';

function bootstrapGoogleAnalytics() {
  (<any> function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * <any> new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  window['ga']('create', 'UA-90262944-1', 'auto');
  window['ga']('send', 'pageview');
}

if (environment.production) {
  enableProdMode();
  bootstrapGoogleAnalytics();
}

platformBrowserDynamic().bootstrapModule(AppModule);
