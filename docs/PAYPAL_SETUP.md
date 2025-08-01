# PayPal Subscription Integration Setup

This guide explains how to set up PayPal subscription payments for your application.

## Prerequisites

1. PayPal Developer Account
2. PayPal App created in the developer dashboard
3. Environment variables configured

## Step 1: Create PayPal Developer Account

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign in with your PayPal account or create a new one
3. Navigate to "My Apps & Credentials"

## Step 2: Create PayPal App

1. Click "Create App"
2. Choose "Default Application" or create a custom name
3. Select "Merchant" as the account type
4. Choose "Sandbox" for development or "Live" for production
5. Select the following features:
   - **Subscriptions** (required for recurring payments)
   - **PayPal Checkout** (for payment processing)

## Step 3: Get API Credentials

After creating the app, you'll get:
- **Client ID** (public, can be used in frontend)
- **Client Secret** (private, server-side only)

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-sandbox-client-id"
PAYPAL_CLIENT_ID="your-sandbox-client-id"
PAYPAL_CLIENT_SECRET="your-sandbox-client-secret"
```

For production:
```bash
# PayPal Production Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-live-client-id"
PAYPAL_CLIENT_ID="your-live-client-id"
PAYPAL_CLIENT_SECRET="your-live-client-secret"
```

## Step 5: Test with Sandbox

PayPal provides test accounts for sandbox testing:

### Test Buyer Account
- Email: Usually provided in your sandbox accounts
- Password: Usually provided in your sandbox accounts

### Test Credit Cards
PayPal sandbox accepts these test credit card numbers:
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

## Step 6: Backend API Requirements

Your backend should implement these endpoints:

### 1. Save PayPal Subscription
```
POST /api/v1/subscriptions/paypal
```

Request body:
```json
{
  "plan_id": "your-plan-id",
  "user_id": "user-id",
  "paypal_subscription_id": "I-BW452GLLEP1G",
  "paypal_subscription_status": "ACTIVE",
  "paypal_subscription_data": { /* full PayPal subscription object */ },
  "payment_method": "paypal"
}
```

### 2. Handle PayPal Webhooks (Optional but Recommended)
```
POST /api/v1/webhooks/paypal
```

This endpoint should handle PayPal webhook events like:
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `PAYMENT.SALE.COMPLETED`

## Step 7: Frontend Integration

The PayPal integration is already implemented in:
- `components/plans/PayPalSubscriptionButton.tsx`
- `components/plans/PaymentModal.tsx`
- `components/plans/PlanCard.tsx`

## Step 8: Testing Flow

1. Start your development server
2. Navigate to `/plans`
3. Click "Subscribe Now" on a paid plan
4. Select "PayPal" as payment method
5. Complete the PayPal flow with test credentials
6. Verify subscription is created in your backend

## Step 9: Production Deployment

1. Switch to live PayPal credentials
2. Update environment variables
3. Test with real PayPal account (small amount)
4. Set up webhook endpoints for production
5. Monitor PayPal dashboard for transactions

## Troubleshooting

### Common Issues

1. **PayPal SDK not loading**
   - Check if `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
   - Verify the client ID is correct
   - Check browser console for errors

2. **Subscription creation fails**
   - Verify PayPal plan is created successfully
   - Check backend API endpoints are working
   - Review PayPal API response in network tab

3. **Webhook not receiving events**
   - Verify webhook URL is accessible from internet
   - Check webhook signature validation
   - Review PayPal webhook logs in developer dashboard

### Debug Mode

Enable debug logging by adding to your component:
```javascript
console.log('PayPal Debug:', {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  planId: plan.id,
  userId: user?.id
});
```

## Security Notes

1. Never expose `PAYPAL_CLIENT_SECRET` in frontend code
2. Always validate webhook signatures
3. Verify subscription status with PayPal API before granting access
4. Use HTTPS in production
5. Implement proper error handling and logging

## Support

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Subscriptions API](https://developer.paypal.com/docs/subscriptions/)
- [PayPal Webhooks](https://developer.paypal.com/docs/api/webhooks/)
