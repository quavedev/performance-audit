# Performance Audit by Quave

Easily check the performance of a web address according to Google's PageSpeed and compare with an expected baseline. To know more about the scores, see https://developers.google.com/web/tools/lighthouse.
This test is designed to run on a CI to monitor the scores over time and notify when a regression occurs.

## Installation

`npm install @quave/performance-audit`

## How to use

Pass a array of tests to the `checkPerformance` function.

Test object structure:
- `url`: The link to test
- `stategy`: Should be `desktop` or `mobile`
- `threshold`: How much the results need to differ to trigger a fail 
- `pwa`, `bestPractices`, `accessibility`, `seo`, `performance`: Scores baselines for the tests (optional)
- `appJsTransferSize`, `appCssTransferSize`: Sizes baselines of the js and css bundles (optional)
- `jsIdentifier`, `cssIdentifier`: String used to identify your app's bundle. (required if using `appJsTransferSize` or `appCssTrasnferSize`)

Additionally, you may pass a `options` as a second argument, to use values commom for all tests.

#### Example
```js
// Example file app.slow.test.js
import { checkPerformance } from "@quave/performance-audit";

checkPerformance({
  applications: [
    {
      url: "https://www.meteor.com",
      strategy: "desktop",
      pwa: 0.69,
      bestPractices: 0.77,
      accessibility: 0.55,
      seo: 0.6,
      performance: 0.2,
      appJsTransferSize: 2168542,
      appCssTransferSize: 4513,
    },
  ],
  options: {
    threshold: 0.95,
    jsIdentifier: '.js?meteor_js_resource=true',
    cssIdentifier: '.css?meteor_css_resource=true',
  },
)
```

## Jest
The library uses jest to run the test. It is set as a peer dependency, so you may choose which
version to install.

## Slow tests
This test usually takes several seconds to complete, and that is not great. We recommend creating a new test group e.g. _slow_ group:

```js
//File jest.slow.config.js
module.exports = {
  ...
  testRegex: '(/__tests__/.*|(\\.|/)(slow\\.test))\\.jsx?$',
  ...
};
```

And then creating the performance tests in a file with the suffix `slow.test.js`.
These tests then can be executed by calling `jest -c jest.slow.config.js`.