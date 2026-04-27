# Login & Profile Page - Complete Test Guide

## Fixed Issues

✅ **Login Button Now Hides After Login**: When user logs in, the login button disappears and profile icon appears
✅ **Profile Dropdown Shows User Options**: Click on user icon to see dropdown menu
✅ **Both Customer and Admin Profiles**: Separate profile pages for each role
✅ **Logout Functionality**: Clear session and redirect to home

---

## Customer Flow - Step by Step

### Step 1: Go to Login Page
```
URL: http://localhost:3000/login
```

### Step 2: Select Customer Login
```
- Login type tab should be on "Customer" (default)
- Demo credentials shown below input fields
  Email: demo@customer.com
  Password: password123
```

### Step 3: Enter Credentials & Login
```
- Email: demo@customer.com
- Password: password123
- Click "Login" button
```

### Step 4: Verify Login Success
```
✓ Should redirect to home page (/)
✓ Login button in header should DISAPPEAR
✓ User icon (person icon) should APPEAR in header
```

### Step 5: Click Profile Icon
```
- Location: Top right of header, next to cart icon
- Should show dropdown menu with:
  - Your Name (Demo Customer) - Clickable to go to profile
  - My Orders - Link to orders page
  - Settings - Link to settings page
  - Logout - Red button to logout
```

### Step 6: Click on Profile Name
```
- Should go to /profile page
- See customer profile information:
  - Email: demo@customer.com
  - Full Name: Demo Customer
  - Phone, Address, City, State, Postal Code, Country fields
- Action buttons:
  - "Save Changes" button (green)
  - "Logout" button (red)
```

### Step 7: Logout
```
- Click "Logout" button
- Session cleared
- Redirected to home page
- Login button should REAPPEAR in header
```

---

## Admin Flow - Step by Step

### Step 1: Go to Login Page
```
URL: http://localhost:3000/login
```

### Step 2: Click Admin Tab
```
- Click on "Admin" tab at the top of login form
- Demo credentials shown below:
  Email: admin@baweed.com
  Password: admin123
```

### Step 3: Enter Admin Credentials & Login
```
- Email: admin@baweed.com
- Password: admin123
- Click "Login" button
```

### Step 4: Verify Admin Login Success
```
✓ Should redirect to admin dashboard (/admin)
✓ Login button in header should DISAPPEAR
✓ User icon should APPEAR in header
✓ Admin navigation should show "Admin" link in header
```

### Step 5: Click Profile Icon
```
- Location: Top right of header
- Should show dropdown menu with:
  - Admin User - Clickable to go to admin profile
  - Logout - Red button to logout
- Note: No "Orders" or "Settings" for admins
```

### Step 6: Click on "Admin User"
```
- Should go to /admin/profile page
- See admin profile information:
  - Email: admin@baweed.com
  - Role: Admin
  - Account Status: Active
  - Member Since: [Current Date]
  - Permissions listed:
    - Product Management
    - Order Management
    - Supplier Management
    - Inventory Management
    - Invoice Management
    - Email Management
- Action button:
  - "Logout" button (red)
```

### Step 7: Logout from Admin
```
- Click "Logout" button
- Session cleared
- Redirected to home page
- Login button should REAPPEAR in header
```

---

## What Changed in Code

### Header Component (`/components/Header.tsx`)
- Added `checkLocalStorageUser()` helper function
- Checks localStorage for demo credentials on component load
- Listens for window focus events to detect login changes
- Properly shows/hides login button vs profile icon
- Profile dropdown routes to correct profile page based on role

### Customer Profile (`/app/profile/page.tsx`)
- Added localStorage check for demo customers
- Shows customer profile information
- Allows editing profile details
- Logout button clears all session data

### Admin Profile (`/app/admin/profile/page.tsx`)
- Added admin-only authentication check
- Shows admin information and permissions
- Logout button clears admin session

---

## Demo Credentials

**Customer:**
- Email: `demo@customer.com`
- Password: `password123`

**Admin:**
- Email: `admin@baweed.com`
- Password: `admin123`

---

## Troubleshooting

**Problem**: Login button still shows after login
- **Solution**: Clear browser cache or open in private/incognito window

**Problem**: Profile icon doesn't appear
- **Solution**: Check if localStorage has `userRole` and `userEmail` values
- Open DevTools → Application → Local Storage → check for `userRole`

**Problem**: Profile page shows blank
- **Solution**: Ensure you're logged in (profile button visible in header)
- Check localStorage for user data

---

## How It Works

1. **Login**: User enters credentials → stored in localStorage → redirected to home
2. **Header Loads**: Header checks localStorage for user data
3. **Profile Icon Shows**: If user data found in localStorage, profile icon displays
4. **Profile Click**: Routes to `/profile` (customer) or `/admin/profile` (admin)
5. **Logout**: Clears localStorage → redirects to home → header shows login button again

---

## Browser DevTools Check

To verify login is working:

1. Open DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Check `userRole` value - should be "customer" or "admin"
5. Check `userEmail` value - should be email used to login

You should see these values after successful login!
