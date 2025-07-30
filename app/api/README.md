# API Routes Documentation

This directory contains all API routes organized by model/feature for better maintainability.

## 📁 Directory Structure

```
app/api/
├── auth/                     # Authentication endpoints
│   ├── token/route.ts        # POST /api/auth/token - Set auth token
│   └── session/route.ts      # GET /api/auth/session - Debug session info
├── plans/                    # Plan management endpoints
│   ├── route.ts              # GET /api/plans - List all plans
│   └── [id]/route.ts         # GET /api/plans/[id] - Get specific plan
├── subscriptions/            # Subscription management endpoints
│   ├── route.ts              # POST /api/subscriptions - Create subscription
│   ├── current/route.ts      # GET /api/subscriptions/current - Get user's current subscription
│   └── [id]/                 # Subscription by ID endpoints
│       └── route.ts          # GET, PUT, DELETE /api/subscriptions/[id]
├── users/                    # User management endpoints
│   └── me/route.ts           # GET /api/users/me - Get current user info
└── documents/                # Document management endpoints (existing)
    └── ...
```

## 🔗 API Endpoints

### Authentication (`/api/auth/`)

#### `POST /api/auth/token`
Set authentication token in server-side cookies.
```json
{
  "token": "jwt_token_here",
  "expired_at": "2025-07-30T23:36:40+00:00"
}
```

#### `GET /api/auth/session`
Get debug information about current session and cookies.

### Plans (`/api/plans/`)

#### `GET /api/plans`
Get list of all available plans.

#### `GET /api/plans/[id]`
Get specific plan details by ID.

### Subscriptions (`/api/subscriptions/`)

#### `POST /api/subscriptions`
Create new subscription.
```json
{
  "planId": "plan_id_here",
  "userId": "user_id_here",
  "accessToken": "token_here"
}
```

#### `GET /api/subscriptions/current`
Get current user's active subscription.

#### `GET /api/subscriptions/[id]`
Get specific subscription by ID.

#### `PUT /api/subscriptions/[id]`
Update subscription details.

#### `DELETE /api/subscriptions/[id]`
Cancel/delete subscription.

### Users (`/api/users/`)

#### `GET /api/users/me`
Get current authenticated user's information.

## 🔐 Authentication

Most endpoints require authentication via:
1. **NextAuth Session** - Automatic for server-side requests
2. **Bearer Token** - From cookies (`access_token` or `client_access_token`)

## 🛠️ Services

Each API group has corresponding service files:

- `services/auth.service.ts` - Authentication operations
- `services/plan.service.ts` - Plan operations  
- `services/subscription.service.ts` - Subscription operations
- `services/user.service.ts` - User operations

## 📝 Usage Examples

```typescript
// Using services
import { getPublicPlans } from '@/services/plan.service';
import { createSubscription } from '@/services/subscription.service';
import { getCurrentUser } from '@/services/user.service';

// Get plans
const plans = await getPublicPlans();

// Create subscription
const subscription = await createSubscription('plan_id');

// Get current user
const user = await getCurrentUser();
```

## 🔄 Migration Notes

- Old API routes are maintained for backward compatibility
- New code should use the organized structure
- Services provide consistent interface across the app
- All routes include proper error handling and validation

## 🐛 Debugging

Use `/api/auth/session` endpoint to debug authentication issues:

```bash
curl http://localhost:3000/api/auth/session
```

This will show current session state, cookies, and token information.
