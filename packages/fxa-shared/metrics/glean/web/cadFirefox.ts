/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.2.0. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * User engaged on the "Connect another device" screen with choice options,
 * selecting either of "I already have FF for mobile" or "I don't have FF for
 * mobile", which is provided in the 'reason' for this event
 *
 * Generated from `cad_firefox.choice_engage`.
 */
export const choiceEngage = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'cad_firefox',
    name: 'choice_engage',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * User clicked "Not now"
 *
 * Generated from `cad_firefox.choice_notnow_submit`.
 */
export const choiceNotnowSubmit = new EventMetricType(
  {
    category: 'cad_firefox',
    name: 'choice_notnow_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User submitted on the "Connect another device" screen with choice options,
 * submitting either of "I already have FF for mobile" or "I don't have FF for
 * mobile", which is provided in the 'reason' for this event
 *
 * Generated from `cad_firefox.choice_submit`.
 */
export const choiceSubmit = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'cad_firefox',
    name: 'choice_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * User viewed the "Connect another device" screen with choice options to download
 * FF for mobile or not
 *
 * Generated from `cad_firefox.choice_view`.
 */
export const choiceView = new EventMetricType(
  {
    category: 'cad_firefox',
    name: 'choice_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User clicks "Not now" on the "Connect another device page"
 *
 * Generated from `cad_firefox.notnow_submit`.
 */
export const notnowSubmit = new EventMetricType(
  {
    category: 'cad_firefox',
    name: 'notnow_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User clicked the "Continue to sync" button on the "Download Firefox for mobile"
 * screen
 *
 * Generated from `cad_firefox.sync_device_submit`.
 */
export const syncDeviceSubmit = new EventMetricType(
  {
    category: 'cad_firefox',
    name: 'sync_device_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User viewed the "Download Firefox for mobile" screen after choosing and
 * submitting the "I don't have Firefox for mobile" option
 *
 * Generated from `cad_firefox.view`.
 */
export const view = new EventMetricType(
  {
    category: 'cad_firefox',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
