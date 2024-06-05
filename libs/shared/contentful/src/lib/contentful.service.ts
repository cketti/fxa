/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Injectable } from '@nestjs/common';
import { PriceManager, SubplatInterval } from '@fxa/payments/stripe';
import { ContentfulServiceError } from './contentful.error';
import { ContentfulManager } from './contentful.manager';
import { ContentfulServiceConfig } from './contentful.service.config';

@Injectable()
export class ContentfulService {
  constructor(
    private contentfulManager: ContentfulManager,
    private priceManager: PriceManager,
    private contentfulServiceConfig: ContentfulServiceConfig
  ) {}

  async fetchContentfulData(offeringId: string, acceptLanguage: string) {
    const offeringResult =
      await this.contentfulManager.getPageContentForOffering(
        offeringId,
        acceptLanguage
      );

    return offeringResult.getOffering();
  }

  async retrieveStripePlanId(
    offeringConfigId: string,
    interval: SubplatInterval
  ) {
    const planIds = await this.contentfulManager.getOfferingPlanIds(
      offeringConfigId
    );
    // Temporary supported list of plans
    // CMS purchase.stripePlanChoices is currently not configured correctly
    // Unfortunately, currently the CMS is read-only and can't be updated
    // As a temporary work around provide a list of supported plans
    const supportedListOfPriceIds =
      this.contentfulServiceConfig.supportedPlanIds.split(',');
    const filteredPlanIds = planIds.filter((priceId) =>
      supportedListOfPriceIds.includes(priceId)
    );
    const plan = await this.priceManager.retrieveByInterval(
      filteredPlanIds,
      interval
    );
    if (!plan) throw new ContentfulServiceError('Plan not found');
    return plan.id;
  }
}
