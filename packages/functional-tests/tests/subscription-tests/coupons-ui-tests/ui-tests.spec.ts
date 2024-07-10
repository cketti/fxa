/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { MetricsObserver } from '../../../lib/metrics';
import { VALID_VISA } from '../../../lib/paymentArtifacts';
import { Coupon } from '../../../pages/products';
import { expect, test } from '../subscriptionFixtures';

test.describe('severity-2 #smoke', () => {
  test.describe('ui functionality', () => {
    test('verify plan change funnel metrics & coupon feature not available when changing plans', async ({
      pages: { relier, subscribe },
    }, { project }) => {
      test.skip(
        project.name === 'production',
        'no real payment method available in prod'
      );
      const metricsObserver = new MetricsObserver(subscribe);
      metricsObserver.startTracking();

      await relier.goto();
      await relier.clickSubscribe6Month();

      // Verify discount section is displayed
      await expect(subscribe.promoCodeHeading).toBeVisible();

      // 'auto10pforever' is a 10% forever discount coupon for a 6mo plan
      await subscribe.addCouponCode(Coupon.AUTO_10_PERCENT_FOREVER);

      // Verify the coupon is applied successfully
      await expect(subscribe.promoCodeAppliedHeading).toBeVisible();

      //Subscribe successfully with Stripe
      await subscribe.confirmPaymentCheckbox.check();
      await subscribe.paymentInformation.fillOutCreditCardInfo(VALID_VISA);
      await subscribe.paymentInformation.clickPayNow();

      await expect(subscribe.subscriptionConfirmationHeading).toBeVisible();

      await relier.goto();
      //Change the plan
      await relier.clickSubscribe12Month();

      //Verify Discount section is not displayed
      await expect(subscribe.planUpgradeDetails).not.toContainText('Promo');

      //Submit the changes
      await subscribe.confirmPaymentCheckbox.check();
      await subscribe.paymentInformation.clickPayNow();

      //Verify the subscription is successful
      await expect(subscribe.subscriptionConfirmationHeading).toBeVisible();

      // check conversion funnel metrics
      const expectedEventTypes = [
        'amplitude.subPaySetup.view',
        'amplitude.subPaySetup.engage',
        'amplitude.subPaySetup.submit',
        'amplitude.subPaySetup.success',
        'amplitude.subPaySubChange.view',
        'amplitude.subPaySubChange.engage',
        'amplitude.subPaySubChange.submit',
        'amplitude.subPaySubChange.success',
      ];

      const actualEventTypes = metricsObserver.rawEvents.map((event) => {
        return event.type;
      });

      // Added as part of FXA-9467 to resolve flaky bug
      // See also FXA-9322 (https://github.com/mozilla/fxa/pull/16689)
      // Compares the tail of both arrays in the event of duplicate initial view events
      expect(
        actualEventTypes.slice(
          actualEventTypes.length - expectedEventTypes.length
        )
      ).toMatchObject(expectedEventTypes);
    });
  });
});
