# DailyLog API Documentation

## Features

- **Email Welcome Message**: Upon successful user creation, an email with a subject "Welcome to DailyLog" and a simple HTML body greeting the user by email is sent.
- **Password Reset Confirmation**: Allows users to confirm their new password using a reset token. The token must be valid and not expired. If successful, the user's password is updated and the token is cleared.

## Endpoints

### /api/billing/checkout

**POST /billing/checkout**

Creates a Stripe Checkout session for billing.

#### Authentication
- JWT Token required

#### Request Body
```json
{
  "items": [
    {
      "price_data": {
        "currency": "usd",
        "product_data": {
          "name": "Subscription"
        },
        "unit_amount": 2000
      },
      "quantity": 1
    }
  ]
}
```

#### Responses

- **Status Code: 200 OK**
  ```json
  {
    "id": "cs_test_1234567890",
    "url": "https://checkout.stripe.com/c/pay/cs_test_1234567890"
  }
  ```

- **Status Code: 403 Forbidden**
  ```json
  {
    "message": "Request origin is not allowed"
  }
  ```

- **Status Code: 400 Bad Request**
  ```json
  {
    "message": "Invalid request body"
  }
  ```

- **Status Code: 500 Internal Server Error**
  ```json
  {
    "message": "Internal server error"
  }
  ```
```

--- END ---