/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState } from 'react';
import ConfirmResetPassword from '.';
import { MOCK_EMAIL } from '../../mocks';
import { LocationProvider } from '@reach/router';
import { ResendStatus } from '../../../lib/types';
import { ConfirmResetPasswordProps } from './interfaces';

const mockVerifyCode = (code: string) => Promise.resolve();
const mockResendCode = () => Promise.resolve(true);

export const Subject = ({
  resendCode = mockResendCode,
  verifyCode = mockVerifyCode,
  initialErrorMessage = '',
}: Partial<ConfirmResetPasswordProps> & { initialErrorMessage?: string }) => {
  const email = MOCK_EMAIL;
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [resendStatus, setResendStatus] = useState(ResendStatus['not sent']);
  const searchParams = '';

  return (
    <LocationProvider>
      <ConfirmResetPassword
        {...{
          email,
          errorMessage,
          resendCode,
          resendStatus,
          searchParams,
          setErrorMessage,
          setResendStatus,
          verifyCode,
        }}
      />
    </LocationProvider>
  );
};
