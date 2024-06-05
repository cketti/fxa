/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Test } from '@nestjs/testing';

import {
  StripeApiListFactory,
  StripeResponseFactory,
} from './factories/api-list.factory';
import { StripeCustomerFactory } from './factories/customer.factory';
import { StripeInvoiceFactory } from './factories/invoice.factory';
import { StripePaymentIntentFactory } from './factories/payment-intent.factory';
import { StripeSubscriptionFactory } from './factories/subscription.factory';
import { StripeClient } from './stripe.client';
import { MockStripeConfigProvider } from './stripe.config';
import { SubscriptionManager } from './subscription.manager';

describe('SubscriptionManager', () => {
  let subscriptionManager: SubscriptionManager;
  let stripeClient: StripeClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MockStripeConfigProvider, StripeClient, SubscriptionManager],
    }).compile();

    subscriptionManager = module.get(SubscriptionManager);
    stripeClient = module.get(StripeClient);
  });

  describe('getMinimumAmount', () => {
    it('returns minimum amout for valid currency', () => {
      const expected = 50;
      const result = subscriptionManager.getMinimumAmount('usd');

      expect(result).toEqual(expected);
    });

    it('should throw an error if currency is invalid', () => {
      expect(() => subscriptionManager.getMinimumAmount('fake')).toThrow(
        'Currency does not have a minimum charge amount available.'
      );
    });
  });

  describe('cancelIncompleteSubscriptionsToPrice', () => {
    it('cancels incomplete subscriptions', async () => {
      const mockCustomer = StripeCustomerFactory();
      const mockSubscription = StripeSubscriptionFactory({
        status: 'incomplete',
      });
      const mockSubscriptionList = [mockSubscription];
      const mockPrice = mockSubscription.items.data[0].price;
      const mockResponse = StripeResponseFactory(mockSubscription);

      jest
        .spyOn(subscriptionManager, 'listForCustomer')
        .mockResolvedValue(mockSubscriptionList);

      jest
        .spyOn(stripeClient, 'subscriptionsCancel')
        .mockResolvedValue(mockResponse);

      await subscriptionManager.cancelIncompleteSubscriptionsToPrice(
        mockCustomer.id,
        mockPrice.id
      );

      expect(stripeClient.subscriptionsCancel).toBeCalledWith(
        mockSubscription.id
      );
    });
  });

  describe('listForCustomer', () => {
    it('returns subscriptions', async () => {
      const mockSubscription = StripeSubscriptionFactory();
      const mockSubscriptionList = StripeApiListFactory([mockSubscription]);
      const mockCustomer = StripeCustomerFactory();

      const expected = mockSubscriptionList.data;

      jest
        .spyOn(stripeClient, 'subscriptionsList')
        .mockResolvedValue(mockSubscriptionList);

      const result = await subscriptionManager.listForCustomer(mockCustomer.id);
      expect(result).toEqual(expected);
    });

    it('returns empty array if no subscriptions exist', async () => {
      const mockCustomer = StripeCustomerFactory();

      jest
        .spyOn(stripeClient, 'subscriptionsList')
        .mockResolvedValue(StripeApiListFactory([]));

      const result = await subscriptionManager.listForCustomer(mockCustomer.id);
      expect(result).toEqual([]);
    });
  });

  describe('cancel', () => {
    it('calls stripeclient', async () => {
      const mockSubscription = StripeSubscriptionFactory();

      jest
        .spyOn(stripeClient, 'subscriptionsCancel')
        .mockResolvedValue(StripeResponseFactory(mockSubscription));

      await subscriptionManager.cancel(mockSubscription.id);

      expect(stripeClient.subscriptionsCancel).toBeCalledWith(
        mockSubscription.id
      );
    });
  });

  describe('retrieve', () => {
    it('calls stripeclient', async () => {
      const mockSubscription = StripeSubscriptionFactory();
      const mockResponse = StripeResponseFactory(mockSubscription);

      jest
        .spyOn(stripeClient, 'subscriptionsRetrieve')
        .mockResolvedValue(mockResponse);

      const result = await subscriptionManager.retrieve(mockSubscription.id);

      expect(stripeClient.subscriptionsRetrieve).toBeCalledWith(
        mockSubscription.id
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('calls stripeclient', async () => {
      const mockParams = {
        description: 'This is an updated subscription',
      };
      const mockSubscription = StripeSubscriptionFactory(mockParams);
      const mockResponse = StripeResponseFactory(mockSubscription);

      jest
        .spyOn(stripeClient, 'subscriptionsUpdate')
        .mockResolvedValue(mockResponse);

      const result = await subscriptionManager.update(
        mockSubscription.id,
        mockParams
      );

      expect(stripeClient.subscriptionsUpdate).toBeCalledWith(
        mockSubscription.id,
        mockParams
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLatestPaymentIntent', () => {
    it('fetches the latest payment intent for the subscription', async () => {
      const mockSubscription = StripeResponseFactory(
        StripeSubscriptionFactory()
      );
      const mockInvoice = StripeResponseFactory(StripeInvoiceFactory());
      const mockPaymentIntent = StripeResponseFactory(
        StripePaymentIntentFactory()
      );

      jest
        .spyOn(stripeClient, 'invoicesRetrieve')
        .mockResolvedValue(mockInvoice);

      jest
        .spyOn(stripeClient, 'paymentIntentRetrieve')
        .mockResolvedValue(mockPaymentIntent);

      const result = await subscriptionManager.getLatestPaymentIntent(
        mockSubscription
      );

      expect(result).toEqual(mockPaymentIntent);
    });

    it('returns undefined if no invoice on subscription', async () => {
      const mockSubscription = StripeSubscriptionFactory({
        latest_invoice: null,
      });

      const result = await subscriptionManager.getLatestPaymentIntent(
        mockSubscription
      );

      expect(result).toEqual(undefined);
    });

    it('returns undefined if the invoice has no payment intent', async () => {
      const mockSubscription = StripeSubscriptionFactory();
      const mockInvoice = StripeResponseFactory(
        StripeInvoiceFactory({
          payment_intent: null,
        })
      );

      jest
        .spyOn(stripeClient, 'invoicesRetrieve')
        .mockResolvedValue(mockInvoice);

      const result = await subscriptionManager.getLatestPaymentIntent(
        mockSubscription
      );

      expect(result).toEqual(undefined);
    });
  });
});
