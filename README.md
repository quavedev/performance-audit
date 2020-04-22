# Performance Audit by Quave

Easily check the performance of a web address according to Google's PageSpeed and compare with an expected
baseline.

## How to use

```js
// Example file app.slow.test.js
import { createTest } from "@quave/performance-audit";

createTest([
  {
    url: "appurl.com",
    strategy: "desktop",
    pwa: 0.69,
    bestPractices: 0.77,
    accessibility: 0.55,
    seo: 0.6,
    performance: 0.2,
    appJsTransferSize: 2168542,
    appCssTransferSize: 4513,
    threshold: 0.3,
  },
  {
    url: "appurl.com",
    strategy: "mobile",
    pwa: 0.69,
    bestPractices: 0.77,
    accessibility: 0.78,
    seo: 0.6,
    performance: 0.2,
    appJsTransferSize: 2168542,
    appCssTransferSize: 64513,
    threshold: 0.3,
  }
])
```

Then run `jest` at the project's folder to run it.

## Jest
The library uses jest to run the test. It is set as a peer dependency, so you may choose which
version to install.

## Slow tests
This test usually takes several seconds to complete. We recommend creating a new test group e.g. _slow_
group.