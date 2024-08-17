## Notes
## Stripe Web Hook Setup (For validating the payment process, if a process was completed successfully create an order and change the order status to paid)
- Stripe login (cmd)
- Make access granted 
- stripe listen --forward-to http://localhost:8000/api/v1/orders/webhook-checkout (cmd)
- STRIPE_WEBHOOK_SECRET = 
