// https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed
import get from "lodash.get";
import fetch from "node-fetch";

const getScores = (data, url) => {
  const networkRequestsItems =
    get(data, "lighthouseResult.audits.network-requests.details.items") || [];
  const appJs =
    networkRequestsItems.find(
      nri =>
        nri && nri.url && nri.url.startsWith(url) && nri.url.includes(".js")
    ) || {};
  const appCss =
    networkRequestsItems.find(
      nri => nri && nri.url && nri.url.startsWith(url) && nri.url.includes(".css")
    ) || {};

  const assets = { appJs, appCss };

  const categories = get(data, "lighthouseResult.categories");
  if (!categories) {
    return assets;
  }
  return {
    pwa: +categories.pwa.score,
    bestPractices: +categories["best-practices"].score,
    accessibility: +categories.accessibility.score,
    seo: +categories.seo.score,
    performance: +categories.performance.score,
    ...assets
  };
};

export const createTest = tests =>
  describe("pagespeed", () => {
    beforeEach(() => {
      jest.setTimeout(3 * 60 * 1000);
    });

    tests
      .filter(({ skip }) => !skip)
      .forEach(
        ({
          url,
          strategy,
          pwa,
          bestPractices,
          accessibility,
          seo,
          performance,
          appJsTransferSize,
          appCssTransferSize,
          threshold
        }) =>
          test(`${url}_${strategy}`, async () => {
            expect.assertions(7);
            const response = await fetch(
              `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=pwa&category=performance&category=accessibility&category=best-practices&category=seo&strategy=${strategy}`
            );
            const data = await response.json();

            const scores = getScores(data, url);
            // eslint-disable-next-line no-console
            console.log(`${url}_${strategy}`, scores);
            const thresholdForLess = 1 + (1 - threshold);
            expect(
              scores.appJs.transferSize,
              `js size should be less than ${appJsTransferSize} bytes`
            ).toBeLessThanOrEqual(appJsTransferSize * thresholdForLess);
            expect(
              scores.appCss.transferSize,
              `css size should be less than ${appCssTransferSize} bytes`
            ).toBeLessThanOrEqual(appCssTransferSize * thresholdForLess);

            expect(
              scores.pwa,
              `pwa score should be better than ${pwa}`
            ).toBeGreaterThanOrEqual(pwa * threshold);
            expect(
              scores.bestPractices,
              `bestPractices score should be better than ${bestPractices}`
            ).toBeGreaterThanOrEqual(bestPractices * threshold);
            expect(
              scores.accessibility,
              `accessibility score should be better than ${accessibility}`
            ).toBeGreaterThanOrEqual(accessibility * threshold);
            expect(
              scores.seo,
              `seo score should be better than ${seo}`
            ).toBeGreaterThanOrEqual(seo * threshold);
            expect(
              scores.performance,
              `performance score should be better than ${performance}`
            ).toBeGreaterThanOrEqual(performance * threshold);
          })
      );
  });
