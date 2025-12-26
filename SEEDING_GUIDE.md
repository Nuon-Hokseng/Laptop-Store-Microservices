# Database Seeding Guide

## Problem Summary

The cart add operation is failing with 404 because laptop ID `694b6e9db3b980b9a35c9d84` doesn't exist in the database. This happens when:

- The database is empty (no laptops seeded)
- Old/stale laptop IDs are being used by the frontend
- Database was reset but not re-seeded

## Solution: Seed the Database

The item-service now has a **guarded HTTP seed endpoint** at `/api/laptops/seed` that populates the database with 6 demo laptops.

---

## Step 1: Configure Environment Variables

For the seed endpoint to work, you need to set these environment variables for the **item-service**:

```bash
ENABLE_SEED_ENDPOINT=true
SEED_ADMIN_TOKEN=your-secret-token-here
```

### How to Set on Render.com:

1. Go to your **item-service** on Render
2. Navigate to **Environment** tab
3. Add these variables:
   - `ENABLE_SEED_ENDPOINT` = `true`
   - `SEED_ADMIN_TOKEN` = `mysecrettoken123` (choose your own secure token)
4. **Save Changes** and wait for the service to redeploy

---

## Step 2: Seed the Database

Once your services are running with the environment variables set:

### Option A: Using curl (Recommended for Render.com)

```bash
curl -X POST https://api-gateway-bo9u.onrender.com/v1/laptops/seed?reset=true \
  -H "X-Admin-Token: mysecrettoken123"
```

Replace:

- `mysecrettoken123` with your actual `SEED_ADMIN_TOKEN`
- Use `?reset=true` to clear existing laptops first (optional)

### Option B: Using the API directly (if item-service is exposed)

```bash
curl -X POST https://your-item-service.onrender.com/api/laptops/seed?reset=true \
  -H "X-Admin-Token: mysecrettoken123"
```

### Expected Response:

```json
{
  "message": "Seeded demo laptops",
  "inserted": 6
}
```

---

## Step 3: Verify Laptops are Seeded

Fetch all laptops to confirm they exist:

```bash
curl https://api-gateway-bo9u.onrender.com/v1/laptops
```

You should see 6 laptops with IDs like:

```json
[
  {
    "_id": "676d5a7b8e9f1a2b3c4d5e6f",
    "Brand": "Apple",
    "Model": "MacBook Pro 14",
    ...
  },
  ...
]
```

**Copy these new `_id` values** - these are the valid laptop IDs your frontend should use.

---

## Step 4: Update Frontend (if needed)

If your frontend has hardcoded laptop IDs, you'll need to update them with the fresh IDs from Step 3.

### Common places to check:

- `frontend/src/app/homescreen/` - laptop display components
- `frontend/src/app/cart/` - add to cart functionality
- Any mock data or test fixtures

---

## Step 5: Test Cart Add

Now try adding a laptop to cart using a **valid new laptop ID**:

```bash
curl -X POST https://api-gateway-bo9u.onrender.com/v1/cart/add \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{"laptopId": "676d5a7b8e9f1a2b3c4d5e6f"}'
```

Replace:

- `YOUR_JWT_TOKEN` with your actual auth token
- `676d5a7b8e9f1a2b3c4d5e6f` with an actual laptop ID from Step 3

Expected response:

```json
{
  "cartId": "...",
  "items": [...],
  "message": "Item added to cart successfully"
}
```

---

## Demo Laptops Included

The seed endpoint creates these 6 laptops:

1. **Apple MacBook Pro 14** - $1999 (Creator)
2. **Dell XPS 13 Plus** - $1799 (Ultrabook)
3. **Lenovo ThinkPad X1 Carbon** - $1899 (Business)
4. **ASUS ROG Zephyrus G14** - $1699 (Gaming)
5. **HP Spectre x360 14** - $1599 (2-in-1)
6. **Acer Swift Go 14** - $1099 (Ultrabook)

---

## Troubleshooting

### Seed Endpoint Returns 403 "Seed endpoint disabled"

- Check `ENABLE_SEED_ENDPOINT=true` is set in item-service environment
- Restart/redeploy the item-service after adding env vars

### Seed Endpoint Returns 403 "Forbidden: invalid admin token"

- Check `SEED_ADMIN_TOKEN` is set correctly
- Ensure your `X-Admin-Token` header matches exactly

### Still Getting "Laptop does not exist" Error

1. Verify laptops were actually inserted: `curl https://api-gateway-bo9u.onrender.com/v1/laptops`
2. Check that you're using **NEW laptop IDs** from the response
3. Clear browser cache/localStorage if frontend is using cached IDs
4. Check item-service logs for connection errors

### Database Connection Issues

- Verify `MONGO_URI` is set correctly for item-service
- Check MongoDB Atlas allows connections from Render.com IPs
- Test connection: check item-service health endpoint `/health`

---

## For Local Development

If running locally:

1. Set environment variables in `Backend service/item-service/.env`:

   ```
   ENABLE_SEED_ENDPOINT=true
   SEED_ADMIN_TOKEN=local-dev-token
   MONGO_URI=mongodb://localhost:27017/laptop-store
   ```

2. Run the seed:

   ```bash
   curl -X POST http://localhost:3004/api/laptops/seed?reset=true \
     -H "X-Admin-Token: local-dev-token"
   ```

3. Or use the npm script (if configured):
   ```bash
   cd "Backend service/item-service"
   npm run seed
   ```

---

## Security Notes

- **Never commit** `SEED_ADMIN_TOKEN` to git
- Disable seed endpoint in production: `ENABLE_SEED_ENDPOINT=false`
- The seed endpoint is meant for **development and initial setup only**
- For production, use proper data migration scripts

---

## Next Steps

After seeding:

1. ✅ Verify laptops exist via GET /v1/laptops
2. ✅ Test cart add with new laptop IDs
3. ✅ Test cart view/update operations
4. ✅ Test order creation flow
5. ✅ Verify payment flow end-to-end
