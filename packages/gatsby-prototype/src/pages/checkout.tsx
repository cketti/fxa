import React from 'react';
import AppLocalizationProvider from '../AppLocalizationProvider';
import PlanDetails from '../components/PlanDetails';
import SubscriptionTitle from '../components/SubscriptionTitle';

const Checkout = () => {
  return (
    <AppLocalizationProvider
      userLocales={navigator.languages}
      bundles={['gatsby', 'react']}
    >
      <main className="main-content">
        <SubscriptionTitle
          screenType="create"
          // subtitle={plan.subtitle}
        />

        <div className="payment-panel">
          <PlanDetails
            selectedPlan={plan}
            isMobile
            showExpandButton
            invoicePreview={invoicePreview}
            coupon={coupon}
            additionalCouponInfo={additionalCouponInfo}
          />
        </div>
      </main>
    </AppLocalizationProvider>
  );
};

export default Checkout;

// delete later
const plan = {
  id: '123',
  productName: 'Testing Foxkeh',
  planName: 'Test',
  active: true,
  styles: {
    webIconBackground: '#20123a',
  },
  description: ['Testing Foxkeh', 'Product Detail line 2'],
  subtitle: 'Test Plan Subtitle',
  upgradeCTA: 'Lets get you updated',
  successActionButtonUrl: 'https://foxkeh.com/buttons/',
  successActionButtonLabel: 'You did it!',
  webIconUrl: 'https://accounts-static.cdn.mozilla.net/legal/mozilla_vpn_tos',
  tosUrl: 'https://accounts-static.cdn.mozilla.net/legal/mozilla_vpn_tos',
  tosDownloadUrl:
    'https://accounts-static.cdn.mozilla.net/legal/mozilla_vpn_tos',
  privacyNoticeUrl:
    'https://accounts-static.cdn.mozilla.net/legal/mozilla_vpn_tos',
  privacyNoticeDownloadUrl:
    'https://accounts-static.cdn.mozilla.net/legal/mozilla_vpn_tos',
  cancellationSurveyUrl:
    'https://accounts-static.cdn.mozilla.net/legal/mozilla_cancellation_survey_url',
  amount: 935,
  currency: 'usd',
  interval: 'month' as const,
  interval_count: 1,
  details: [
    'Device-level encryption',
    'Servers is 30+ countries',
    'Connects 5 devices with one subscription',
    'Available for Windows, iOS and Android',
  ],
};

const invoicePreview = {
  total: 2250,
  totalExcludingTax: 1950,
  subtotal: 2000,
  subtotalExcludingTax: 2000,
  currency: 'USD',
  tax: [
    {
      amount: 300,
      inclusive: false,
      displayName: 'Sales Tax',
    },
  ],
  discount: [
    {
      amount: 50,
      amountOff: 50,
      percentOff: null,
    },
  ],
};

const coupon = {
  promotionCode: 'mockPromotionCode',
  type: 'mockType',
  durationInMonths: 12,
  discountAmount: 1000,
};

const mockProfile = {
  avatar: 'http://placekitten.com/256/256',
  displayName: 'Foxy77',
  email: 'foxy@firefox.com',
  amrValues: ['amrval'],
  avatarDefault: true,
  locale: 'en',
  twoFactorAuthentication: false,
  uid: 'UIDSTRINGHERE',
  metricsEnabled: true,
};

const additionalCouponInfo = {
  couponDurationDate: 12,
  message: 'Your plan will automatically renew at the list price.',
};
