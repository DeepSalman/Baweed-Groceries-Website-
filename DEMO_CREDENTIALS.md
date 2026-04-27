# Demo Credentials - Quick Reference

## 🛍️ Customer Account

**For testing the customer shopping experience:**

```
Email:    demo@customer.com
Password: password123
Role:     Customer
```

### What You Can Do:
- Browse products (home & shop pages)
- Add items to cart
- Proceed to checkout
- Place orders
- View order history
- Update profile
- All product images and pricing

---

## 🔧 Admin Account

**For testing admin panel and management features:**

```
Email:    admin@baweed.com
Password: admin123
Role:     Admin
```

### What You Can Do:
- Add new products
- Edit/delete products
- Manage suppliers
- View all orders
- Track inventory
- Generate invoices
- View email logs
- Full dashboard access

---

## 💰 Pricing Information

All prices are in **British Pounds (GBP)**

| Product | Price | Unit |
|---------|-------|------|
| Tomatoes | £2.50 | kg |
| Carrots | £1.80 | kg |
| Apples | £3.20 | kg |
| Bananas | £1.50 | kg |
| Fresh Milk | £1.60 | liter |
| Cheddar Cheese | £8.50 | kg |
| Basmati Rice | £4.50 | kg |
| Wheat Flour | £2.20 | kg |

**Additional Fees:**
- Tax: 5%
- Delivery: £10

---

## 🚀 Quick Testing Flow

### Customer Flow (5 minutes)
1. Go to `/login`
2. Select "Customer" tab
3. Enter demo credentials
4. Click "Login as Customer"
5. Browse home page
6. Click "Start Shopping"
7. Add items to cart
8. Go to cart
9. Proceed to checkout
10. Fill in address and payment
11. Place order

### Admin Flow (5 minutes)
1. Go to `/login`
2. Select "Admin" tab
3. Enter demo credentials
4. Click "Login as Admin"
5. View dashboard
6. Click "Products"
7. Click "Add Product"
8. Fill form and save
9. View product in list
10. Check inventory levels

---

## 📝 Test Scenarios

### Scenario 1: Complete Customer Purchase
- Login as customer
- Add 3 different products
- Update quantities
- Checkout
- Confirm order

### Scenario 2: Admin Product Management
- Login as admin
- Add new product
- Edit existing product
- View inventory
- Update stock levels

### Scenario 3: Browse Without Login
- Visit home page
- View all products
- See prices in GBP
- View product images
- Check stock levels
- Try adding to cart (will require login)

---

## 🔍 Key Features to Test

✅ **Authentication**
- Demo customer login
- Demo admin login
- Customer registration
- Logout functionality

✅ **Products**
- Product images display
- GBP pricing format
- Stock levels
- Out of stock indicators

✅ **Shopping**
- Add to cart
- Update quantities
- Remove items
- Proceed to checkout

✅ **Checkout**
- Address form
- Payment form
- Order confirmation
- Order summary

✅ **Admin**
- Product CRUD operations
- Order management
- Supplier management
- Inventory tracking

---

## 💡 Tips

- All prices are in GBP (£)
- Stock amounts are realistic (120-600 units per product)
- Product images are real photos from Unsplash
- Cart data persists in localStorage
- Demo credentials are hardcoded for testing only

---

## 🐛 Troubleshooting

**If login doesn't work:**
- Check you're using exact credentials from above
- Make sure Customer/Admin tab is selected
- Clear browser cache and reload

**If products don't show:**
- Check internet connection
- Products load from Supabase or demo data
- Images load from Unsplash CDN

**If checkout fails:**
- Make sure you're logged in
- Fill all required fields
- Check for browser console errors

---

**Ready to test? Go to `/login` and start exploring! 🎉**
