/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Injectable } from '@nestjs/common';
import {
  getSubscribedPlans,
  getSubscribedProductIds,
  SubscriptionManager,
  SubplatInterval,
} from '@fxa/payments/stripe';
import { ContentfulManager } from '@fxa/shared/contentful';
import { EligibilityManager } from './eligibility.manager';
import { EligibilityStatus } from './eligibility.types';

@Injectable()
export class EligibilityService {
  constructor(
    private contentfulManager: ContentfulManager,
    private eligibilityManager: EligibilityManager,
    private subscriptionManager: SubscriptionManager
  ) {}

  /**
   * Checks if user is eligible to subscribe to plan
   */
  async checkEligibility(
    interval: SubplatInterval,
    offeringConfigId: string,
    stripeCustomerId?: string | null | undefined
  ) {
    if (!stripeCustomerId) {
      return EligibilityStatus.CREATE;
    }

    const targetOfferingResult =
      await this.contentfulManager.getEligibilityContentByOffering(
        offeringConfigId
      );

    const targetOffering = targetOfferingResult.getOffering();

    const subscriptions = await this.subscriptionManager.listForCustomer(
      stripeCustomerId
    );

    const subscribedPlans = getSubscribedPlans(subscriptions);

    const productIds = getSubscribedProductIds(subscribedPlans);

    const overlaps = this.eligibilityManager.getProductIdOverlap(
      productIds,
      targetOffering
    );

    const eligibility = await this.eligibilityManager.compareOverlap(
      overlaps,
      targetOffering,
      interval,
      subscribedPlans
    );

    return eligibility;
  }
}
