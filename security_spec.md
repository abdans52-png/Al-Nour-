# Security Specification & Threat Model for AL NOUREEN

## 1. Data Invariants
1. **Catalog Integrity**: Garment products, descriptions, and master pricing in `/products/{productId}` can only be created, modified, or deleted by verified administrators. Public users have read-only access.
2. **Promotional Offers**: Discount promo codes in `/offers/{offerId}` can only be configured by verified administrators. Public users have read-only access.
3. **Customer Orders**: Orders created in `/orders/{orderId}` must be validly structured with customer contact info, order totals, and non-empty items. Users can view their own orders if authenticated (`userId == request.auth.uid` or matching email). Administrators can read and update all order statuses.
4. **Site Settings & Media**: Header announcement ticker (`/settings/banners`) and visual images (`/settings/media`) can only be modified by verified administrators. Public users have read-only access.
5. **User Profiles**: Customers can only read and update their own profile document (`/users/{userId}`). Users cannot escalate their own role to 'admin'.
6. **Administrator Control**: Whitelisted administrators (including `abdans52@gmail.com` and `/admins/{adminId}`) have administrative access to manage products, offers, orders, and site media.

## 2. Dirty Dozen Attack Payloads
1. **Payload 1 (Ghost Field on Product Update)**: Attacker attempts to update product with injected malicious script or unlisted key `ghostField: "hacked"`. (Blocked by schema & action validation).
2. **Payload 2 (Unauthenticated Product Price Alteration)**: Anonymous visitor sends `PATCH /products/p-1` with `price: 1`. (Blocked by `isAdmin()` check).
3. **Payload 3 (Promo Code Hijacking)**: Non-admin user creates `100% OFF` promo code `FREE100` in `/offers`. (Blocked by `isAdmin()` check).
4. **Payload 4 (Order Theft)**: Attacker attempts to query `/orders` collection without ownership filter. (Blocked by `resource.data.userId == request.auth.uid` or `isAdmin()`).
5. **Payload 5 (Role Self-Escalation)**: Standard customer signs up and sends `{ role: "admin" }` to `/users/{userId}`. (Blocked by role immutability constraint).
6. **Payload 6 (Admin Impersonation via Spoofed Email)**: Attacker provides unverified email `abdans52@gmail.com` with `email_verified: false`. (Blocked by `request.auth.token.email_verified == true`).
7. **Payload 7 (Denial-of-Wallet Long ID Attack)**: Attacker attempts to write a document with a 2MB junk key ID. (Blocked by `isValidId()` <= 128 chars constraint).
8. **Payload 8 (Blanket Listing of PII)**: Attacker calls `getDocs(collection(db, 'users'))` to scrape all customer emails. (Blocked by per-user ownership rule).
9. **Payload 9 (Corrupted Media Overwrite)**: Non-admin sends malicious script payload to `/settings/media`. (Blocked by `isAdmin()` check).
10. **Payload 10 (Negative Price Injection)**: User attempts to create product with `price: -500`. (Blocked by `isValidProduct()` price > 0 check).
11. **Payload 11 (Order Total Tampering during Fulfillment)**: Regular user updates order status to 'delivered' or modifies `total` after placement. (Blocked by customer update lock).
12. **Payload 12 (Direct Access to Secret Admin Collection)**: Regular user tries to add their UID to `/admins/{uid}`. (Blocked by `allow write: if false`).
