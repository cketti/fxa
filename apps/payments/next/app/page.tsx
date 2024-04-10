/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import Link from 'next/link';

export default function Index() {
  // TODO - Remove before launch -
  // This was only added to aid in initial implementation
  // The Subscription Platform doesn't currently have a root page,
  // and instead redirects to the Subscription Management page.
  // This page will be fixed before launch by FXA-8304
  return (
    <div>
      <h1 className="text-center m-4">Welcome</h1>
      <div className="flex gap-8">
        <div className="flex flex-col gap-2 p-4 items-center">
          <h2>123Done - Monthly</h2>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            href="/en/123done/checkout/monthly/new"
          >
            Redirect
          </Link>
        </div>
        <div className="flex flex-col gap-2 p-4 items-center">
          <h2>123Done - Yearly</h2>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            href="/en/123done/checkout/yearly/new"
          >
            Redirect
          </Link>
        </div>
      </div>
    </div>
  );
}
