/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { test, expect } from '../../lib/fixtures/standard';
import { createCustomEventDetail, FirefoxCommand } from '../../lib/channels';

test.describe('severity-2 #smoke', () => {
  test.describe('connect_another_device', () => {
    test('react signin Fx Desktop, load /connect_another_device page', async ({
      syncBrowserPages: { configPage, connectAnotherDevice, page, signinReact },
      testAccountTracker,
    }) => {
      const config = await configPage.getConfig();
      test.skip(
        config.showReactApp.signInRoutes !== true,
        'Skip tests if React signInRoutes not enabled'
      );

      const credentials = await testAccountTracker.signUp();

      await signinReact.goto(
        undefined,
        new URLSearchParams('context=fx_desktop_v3&service=sync&action=email')
      );

      await signinReact.fillOutEmailFirstForm(credentials.email);
      await signinReact.fillOutPasswordForm(credentials.password);

      await signinReact.sendWebChannelMessage(
        createCustomEventDetail(FirefoxCommand.LinkAccount, {
          ok: true,
        })
      );

      await expect(page).toHaveURL(/connect_another_device/);
      await expect(connectAnotherDevice.fxaConnected).toBeVisible();
      await expect(
        connectAnotherDevice.connectAnotherDeviceButton
      ).toBeVisible();
      await expect(connectAnotherDevice.signInButton).toBeHidden();
      await expect(connectAnotherDevice.success).toBeHidden();
    });
  });
});
