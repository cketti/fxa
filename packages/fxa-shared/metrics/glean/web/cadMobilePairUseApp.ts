/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.3.0. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * User views the "Pair using an app" screen after scanning QR code outside of
 * Firefox
 *
 * Generated from `cad_mobile_pair_use_app.view`.
 */
export const view = new EventMetricType(
  {
    category: 'cad_mobile_pair_use_app',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
