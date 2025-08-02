# PayPal Integration for Subscription Payments

This document describes the PayPal integration implemented for subscription payments in the chatbot UI.

## Overview

The PayPal integration allows users to subscribe to plans using PayPal as a payment method. The implementation follows PayPal's subscription flow:

1. User selects a plan and chooses PayPal payment
2. System creates a PayPal subscription via backend API
3. User is redirected to PayPal for payment approval
4. After payment, user returns to success/cancel page
5. System verifies subscription status

## Components

### 1. PayPal Service (`services/paypal.service.ts`)

Handles PayPal API interactions:

- `createPayPalSubscription(planId)`: Creates a PayPal subscription
- `redirectToPayPal(approvalUrl)`: Redirects user to PayPal approval page
- `checkPayPalSubscriptionStatus(subscriptionId)`: Checks subscription status

### 2. PayPal Subscription Button (`components/plans/PayPalSubscriptionButton.tsx`)

React component that handles PayPal payment flow:

- Displays PayPal payment button
- Handles payment processing states
- Manages success/error callbacks

### 3. Payment Modal (`components/plans/PaymentModal.tsx`)

Modal that allows users to choose between PayPal and direct payment methods.

### 4. API Routes

- `/api/subscriptions/paypal` (POST): Creates PayPal subscription
- `/api/subscriptions/paypal/[id]` (GET): Checks subscription status

### 5. Success/Cancel Pages

- `/subscriptions/success`: Handles successful payment returns
- `/subscriptions/cancel`: Handles cancelled payments

## Backend API Integration

The frontend calls the backend API endpoint:

```
POST /api/v1/subscriptions/create_subscription
```

**Request Body:**
```json
{
  "plan_id": "string"
}
```

**Response:**
```json
{
  "subscription_id": "string",
  "approval_url": "string",
  "status": "PENDING",
  "expired_at": "string",
  "plan_id": "string",
  "user_id": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

## Payment Flow

1. **Plan Selection**: User selects a plan on `/plans` page
2. **Payment Method**: User chooses PayPal in payment modal
3. **Subscription Creation**: Frontend calls backend to create PayPal subscription
4. **PayPal Redirect**: User is redirected to PayPal approval URL
5. **Payment Processing**: User completes payment on PayPal
6. **Return Handling**: User returns to success/cancel page
7. **Status Verification**: System verifies subscription status
8. **Completion**: User sees confirmation and can access subscription

## Environment Variables

Required environment variables:

```env
BACKEND_API_URL=http://localhost:8000  # Backend API URL
```

## Error Handling

The integration includes comprehensive error handling:

- Network errors during API calls
- PayPal payment failures
- Authentication errors
- Subscription verification failures

## Security Considerations

- All API calls go through Next.js API routes for security
- Authentication is verified on both frontend and backend
- Access tokens are managed securely through NextAuth sessions
- PayPal approval URLs are validated before redirect

## Testing

To test the PayPal integration:

1. Ensure backend API is running and configured
2. Set up PayPal sandbox environment
3. Test with sandbox PayPal accounts
4. Verify subscription creation and status checking
5. Test payment cancellation flow

## Future Enhancements

Potential improvements:

- Webhook handling for real-time payment updates
- Subscription management (cancel, upgrade, downgrade)
- Payment history and receipts
- Multiple payment method support
- Subscription renewal handling 