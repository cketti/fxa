/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Injectable } from '@nestjs/common';
import { PromotionCodeCouldNotBeAttachedError } from './stripe.error';
import {
  checkSubscriptionPromotionCodes,
  checkValidPromotionCode,
  getSubscribedPrice,
} from './stripe.util';
import { SubscriptionManager } from './subscription.manager';
import { PromotionCodeManager } from './promotionCode.manager';
import { ProductManager } from './product.manager';

@Injectable()
export class StripeService {
  constructor(
    private productManager: ProductManager,
    private subscriptionManager: SubscriptionManager,
    private promotionCodeManager: PromotionCodeManager
  ) {}

  // TODO: Remove this method & this service
  async applyPromoCodeToSubscription(
    customerId: string,
    subscriptionId: string,
    promotionId: string
  ) {
    try {
      const subscription = await this.subscriptionManager.retrieve(
        subscriptionId
      );
      if (subscription?.status !== 'active')
        throw new PromotionCodeCouldNotBeAttachedError(
          'Subscription is not active',
          undefined,
          { subscriptionId }
        );
      if (subscription.customer !== customerId)
        throw new PromotionCodeCouldNotBeAttachedError(
          'subscription.customerId does not match passed in customerId',
          undefined,
          {
            customerId,
            subscriptionId,
          }
        );

      const promotionCode = await this.promotionCodeManager.retrieve(
        promotionId
      );

      checkValidPromotionCode(promotionCode);

      const price = getSubscribedPrice(subscription);
      const productId = price.product;
      const product = await this.productManager.retrieve(productId);

      checkSubscriptionPromotionCodes(promotionCode, price, product);

      const updatedSubscription = await this.subscriptionManager.update(
        subscriptionId,
        {
          discounts: [
            {
              promotion_code: promotionId,
            },
          ],
        }
      );
      return updatedSubscription;
    } catch (err) {
      if (err.type === 'StripeInvalidRequestError') {
        throw new PromotionCodeCouldNotBeAttachedError(
          'Promotion code could not be attached to subscription',
          err,
          {
            customerId,
            subscriptionId,
            promotionId,
          }
        );
      } else {
        throw err;
      }
    }
  }

  // TODO: this method should be moved down to the manager layer
  async customerChanged(uid: string, email: string) {
    // @todo - Unblocked by FXA-9274
    //const devices = await this.db.devices(uid);
    // @todo - Unblocked by FXA-9275
    //await this.profile.deleteCache(uid);
    // @todo - Unblocked by FXA-9276
    //await this.push.notifyProfileUpdated(uid, devices);
    // @todo - Unblocked by FXA-9277
    //this.log.notifyAttachedServices('profileDataChange', {} as any, {
    //  uid,
    //  email,
    //});
  }
}
