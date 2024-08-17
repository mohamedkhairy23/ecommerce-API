## Documentation Link: https://documenter.getpostman.com/view/17269685/2sA3s9C8Hc
## Notes
## Stripe Web Hook Setup (For validating the payment process, if a payment process was completed successfully create an order and change the order status to paid)
- Stripe login (cmd)
- Make access granted 
- stripe listen --forward-to http://localhost:8000/api/v1/orders/webhook-checkout (cmd)
- STRIPE_WEBHOOK_SECRET = 
