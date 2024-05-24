/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { test, expect } from '../../lib/fixtures/standard';

test.describe('severity-1 #smoke', () => {
  test.describe('force auth', () => {
    test.beforeEach(async ({ pages: { configPage } }) => {
      const config = await configPage.getConfig();
      test.skip(
        config.showReactApp.signInRoutes === true,
        'Scheduled for removal as part of React conversion (see FXA-9410).'
      );
    });
    test('with a registered email, registered uid', async ({
      pages: { login, forceAuth },
      testAccountTracker,
    }) => {
      const credentials = await testAccountTracker.signUp();
      await forceAuth.open(credentials);
      await login.setPassword(credentials.password);
      await login.submit();
      expect(await login.isUserLoggedIn()).toBe(true);
    });

    test('form prefill information is cleared after sign in->sign out', async ({
      pages: { login, forceAuth, settings },
      testAccountTracker,
    }) => {
      const credentials = await testAccountTracker.signUp();
      await forceAuth.open(credentials);
      await login.setPassword(credentials.password);
      await login.submit();
      expect(await login.isUserLoggedIn()).toBe(true);

      //Sign out
      await settings.signOut();

      //Verify user need to enter email
      await login.waitForEmailHeader();
      await login.setEmail(credentials.email);
      await login.submit();

      //Verify password is empty and user need to enter password
      await login.waitForPasswordHeader();
      expect(await login.getPasswordInput()).toContain('');
      await login.setPassword(credentials.password);
      await login.submit();
      expect(await login.isUserLoggedIn()).toBe(true);
    });
  });
});
