# Plans & Pricing Components

This directory contains components for displaying and managing subscription plans.

## Components

### PlanCard.tsx
- Displays individual plan information in a card format
- Shows plan limits, features, and pricing
- Handles subscription actions
- Supports popular plan highlighting

### PlanComparison.tsx
- Displays plans in a comparison table format
- Shows all plan features side by side
- Better for comparing multiple plans

### PricingButton.tsx
- Simple button component to navigate to plans page
- Can be used in navbar, footer, or other locations

## Pages

### /app/plans/page.tsx
- Main plans page with both card and comparison views
- Toggle between different view modes
- Handles loading states and errors

## Services

### plan.service.ts
- API service for fetching plans and handling subscriptions
- Uses Next.js API routes for better security

## API Routes

### /app/api/plans/route.ts
- Proxy API route to backend plans endpoint
- Provides better security by hiding backend URLs

## Usage

1. **Display plans page**: Navigate to `/plans`
2. **Add pricing button**: Use `<PricingButton />` component
3. **Customize plan display**: Modify `PlanCard` or `PlanComparison` components

## Backend API Requirements

The backend should provide:
- `GET /api/v1/public/plans` - Returns array of plans
- `POST /api/v1/subscriptions/{user_id}/create?plan_id={plan_id}` - Create subscription
- `GET /api/v1/subscriptions/my` - Get current user's subscription

## Plan Data Structure

```typescript
interface Plan {
  id: string;
  name: string;
  price: number;
  limits: {
    number_of_sites: number;
    number_of_documents: number;
    file_size: number;
    number_of_faqs: number;
    number_of_crawlers: number;
    number_token_chat: number;
  };
  period: string;
  features: string[];
  is_self_sigup_allowed: boolean;
  is_custom: boolean;
  description: string;
}
```

## Customization

- Modify styling in individual components
- Add new plan features in the comparison table
- Customize subscription flow in PlanCard component
- Add authentication checks as needed
