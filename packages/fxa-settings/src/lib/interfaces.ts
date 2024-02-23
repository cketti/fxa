/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This file contains app-wide shared interfaces and types.

export interface AccountAvatar {
  id: string | null;
  url: string | null;
}

export interface AccountTotp {
  exists: boolean;
  verified: boolean;
}

export interface HandledError {
  errno: number;
  message: string;
  retryAfter?: number;
  retryAfterLocalized?: string;
}
