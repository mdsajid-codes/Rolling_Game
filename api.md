# Rentallor Mobile App — API Documentation

> **Backend Reference:** `rentallor-main` PHP project  
> **Base URL:** `https://YOUR_DOMAIN/admin/api`  
> **Content-Type:** All requests and responses use `application/json` unless stated otherwise.  
> **Auth:** Protected endpoints require a valid JWT sent as the `admin_token` cookie or `Authorization: Bearer <token>` header.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [User Management](#2-user-management)
3. [Profile](#3-profile)
4. [Property Search](#4-property-search)
5. [Property Cards](#5-property-cards-detail-fetch)
6. [Wishlist / Shortlist](#6-wishlist--shortlist)
7. [Recently Viewed](#7-recently-viewed)
8. [Contact Details / Reveal](#8-contact-details--reveal)
9. [Location & Autocomplete](#9-location--autocomplete)
10. [Error Responses](#10-error-responses)
11. [Screen → API Mapping](#11-mobile-app-screen--api-mapping)
12. [Integration Notes](#12-notes-for-mobile-integration)

---

## 1. Authentication

### 1.1 Login with Password

**POST** `/auth/login.php`

#### Request Body
```json
{ "username": "user@example.com", "password": "MyPass@123" }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | `string` | ✅ | Email or 10-digit mobile (starts 6–9) |
| `password` | `string` | ✅ | Account password |

#### Success `200`
```json
{ "status": "success", "message": "Login successful", "redirect": "https://YOUR_DOMAIN/dashboard" }
```
> JWT set as `admin_token` cookie (httpOnly, 1-hour expiry).

#### Errors

| HTTP | Scenario |
|------|----------|
| 422 | Missing/invalid username or password |
| 403 | Account inactive |
| 400 | Role is `User` — use app login |
| 400 | Password not set — use OTP login |
| 401 | User not registered / invalid credentials |

---

### 1.2 Send OTP

**POST** `/auth/send-otp.php`

Sends OTP via email or WhatsApp based on input type.

#### Request Body
```json
{ "username": "9876543210" }
```

#### Success `200`
```json
{ "status": "success", "message": "Password verified. OTP sent." }
```

#### Errors

| HTTP | Scenario |
|------|----------|
| 422 | Username missing or invalid format |
| 403 | Account inactive |
| 400 | Role is `User` |
| 401 | User not found |
| 500 | WhatsApp not connected / OTP not delivered |

---

### 1.3 Verify OTP

**POST** `/auth/verify-otp.php`

#### Request Body
```json
{ "username": "9876543210", "otp": "123456" }
```

#### Success `200`
```json
{ "status": "success", "message": "OTP verified successfully", "redirect": "https://YOUR_DOMAIN/dashboard" }
```

#### Errors

| HTTP | Scenario |
|------|----------|
| 422 | Missing OTP or username |
| 401 | User not found / Invalid OTP / OTP expired |
| 403 | Account inactive |
| 400 | Role is `User` |

---

### 1.4 Set New Password

**POST** `/auth/set-new-password.php`

Used after account creation or password reset flow.

#### Request Body
```json
{ "user_id": 42, "token": "reset-token-string", "password": "NewPass@123" }
```

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | `integer` | User's ID |
| `token` | `string` | Reset token from email link |
| `password` | `string` | Min 8 chars; must include uppercase, lowercase, digit, special char (`@$!%*?&`) |

#### Success `200`
```json
{ "status": "success", "message": "Password set successfully. You can now log in." }
```

---

## 2. User Management

### 2.1 Get User by Mobile

**GET** `/users/get-user-by-mobile.php?mobile={mobile}`

| Param | Type | Description |
|-------|------|-------------|
| `mobile` | `string` | 10-digit mobile number |

#### Success `200`
```json
{ "success": true, "data": { "ID": 12, "Name": "Ravi Kumar", "Role": "Owner" } }
```

#### Not Found `200`
```json
{ "success": false, "data": null }
```

---

### 2.2 Register / Update User

**POST** `/users/add-update-users.php`  
🔒 Requires `users.create` or `users.edit` permission.

#### Request Body (JSON or `multipart/form-data`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `formAction` | `string` | ✅ | `add` or `update` |
| `name` | `string` | ✅ | Full name |
| `phone_number` | `string` | ✅ | 10-digit mobile |
| `email` | `string` | ❌ | Email address |
| `role` | `string` | ❌ | `Owner`, `Broker`, `User` |
| `userId` | `integer` | ✅ (update) | User ID for update action |

#### Success `200`
```json
{ "status": "success", "message": "User registered successfully" }
```

---

## 3. Profile

### 3.1 Get Profile Details

**GET** `/profile/details.php`  
🔒 Requires `users.profile` permission.

#### Success `200`
```json
{
  "status": "success",
  "data": {
    "name": "Ravi Kumar",
    "email": "ravi@example.com",
    "email_editable": false,
    "phone_number": "9876543210",
    "broker_name": "Ravi Realty",
    "address": "Sector 62, Noida"
  }
}
```
> `email_editable: true` means no email is set yet.

---

### 3.2 Update Profile

**POST** `/profile/update.php` (`multipart/form-data`)  
🔒 Requires `users.profile` permission.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Display name |
| `email` | `string` | New email (must be OTP-verified first) |
| `phone_number` | `string` | Mobile number |
| `profile_image` | `file` | Profile photo |

#### Success `200`
```json
{ "status": "success", "message": "Profile updated successfully", "data": { ... } }
```

---

### 3.3 Send Email OTP (for Email Change)

**POST** `/profile/send-email-otp.php`  
🔒 Requires `users.profile` permission.

#### Request Body
```json
{ "email": "newemail@example.com" }
```

#### Success `200`
```json
{
  "status": "success",
  "message": "OTP sent to your email address.",
  "data": { "email": "newemail@example.com", "expires_at": "2026-05-13T09:30:00+05:30" }
}
```

---

### 3.4 Verify Email OTP (for Email Change)

**POST** `/profile/verify-email-otp.php`  
🔒 Requires `users.profile` permission.

#### Request Body
```json
{ "email": "newemail@example.com", "otp": "482910" }
```

#### Success `200`
```json
{ "status": "success", "message": "Email verified successfully.", "data": { "email": "newemail@example.com" } }
```

---

## 4. Property Search

All search endpoints are **GET** with query parameters. They use **cursor-based pagination**.

### Cursor Pagination

After each request, use the `cursor` object for the next page:

| Send this param | From response field |
|-----------------|---------------------|
| `cursor_id` | `cursor.id` |
| `cursor_sort_value` | `cursor.sort_value` |

Stop paginating when `"has_more": false`.

---

### 4.1 Search Residential Properties

**GET** `/search/search-property.php`

#### Location Parameters (at least one required)

| Param | Type | Description |
|-------|------|-------------|
| `lat` | `float` | Latitude of center point |
| `lng` | `float` | Longitude of center point |
| `city` | `integer` | City ID (from get-cities) |
| `locality` | `integer` | Locality ID |
| `radius` | `float` | Radius in km (default: `5`) |

#### Sort & Pagination

| Param | Type | Values | Default |
|-------|------|--------|---------|
| `sort` | `string` | `relevance`, `newest`, `price_low_high`, `price_high_low` | `relevance` |
| `cursor_id` | `integer` | From previous `cursor.id` | — |
| `cursor_sort_value` | `string` | From previous `cursor.sort_value` | — |

#### Filter Parameters

| Param | Example Values | Description |
|-------|---------------|-------------|
| `bhk` | `1,2,3` | BHK type(s) |
| `bathroom_number` | `1,2` | Number of bathrooms |
| `property_type` | `Apartment,Villa` | Property types |
| `furnishing` | `Furnished,Semi-Furnished,Unfurnished` | Furnishing status |
| `willing` | `Family,Bachelor,Anyone` | Tenant preference |
| `property_on_floor` | `-1,0,1_4,5_8,9_12,13_16,16_plus` | Floor ranges |
| `property_age` | `less_than_1,1_5,5_plus,10_plus` | Age of property |
| `parking` | `Covered,Open` | Parking type |
| `faces` | `East,North,South,West` | Facing direction |
| `amenities` | `Gym,Pool,Lift` | Amenity names |
| `properties_with` | `photos,videos` | Media availability |
| `posted_by` | `broker,owner` | Poster's role |
| `min_monthly_rent` | `10000` | Minimum monthly rent |
| `max_monthly_rent` | `50000` | Maximum monthly rent |

#### Success `200`
```json
{
  "success": true,
  "sort": "relevance",
  "radius_km": 5,
  "cursor": { "distance": 1.23, "sort_value": 1.23, "id": 101 },
  "source": "R",
  "data": [ { "id": 101, "distance_km": 1.23 } ],
  "last_id": 101,
  "has_more": true
}
```

> Pass `data[].id` to **Property Cards** endpoint for full property details.

---

### 4.2 Search PG / Hostel Properties

**GET** `/search/search-property-pg.php`

Same as Residential. Additional PG-specific filters:

| Param | Example | Description |
|-------|---------|-------------|
| `room_type` | `Single,Double` | Room sharing type |
| `food_available` | `Yes,No` | Meals available |
| `pg_for` | `Male,Female,Any` | Gender preference |

Response `"source"` is `"P"`.

---

### 4.3 Search Commercial Properties

**GET** `/search/search-property-commercial.php`

Same as Residential. Response `"source"` is `"C"`.

---

## 5. Property Cards (Detail Fetch)

### 5.1 Get Property Cards

**POST** `/property/get-p-card.php`

Fetches full displayable card data for property IDs from search results.

#### Request Body
```json
{
  "data": [
    { "id": 101, "distance_km": 1.23 },
    { "id": 102, "distance_km": 2.50 }
  ],
  "action": "search"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `array` | ✅ | Objects with `id` (required) and `distance_km` (optional) |
| `action` | `string` | ❌ | `search` (default), `listing`, `exclusive` |
| `offset` | `integer` | ❌ | For exclusive listings pagination |
| `limit` | `integer` | ❌ | For exclusive listings (default: 10) |

**Alternatives to `data`:**
- `property_id: 101` — single property
- `property_ids: [101, 102]` — array of IDs

#### Exclusive Listings (No IDs needed)
```json
{ "action": "exclusive", "offset": 0, "limit": 10 }
```

#### Success `200`
```json
{
  "error": false,
  "count": 2,
  "data": [
    {
      "id": 101,
      "distance_km": 1.23,
      "title": "2 BHK Apartment in Sector 62",
      "property_type": "Apartment",
      "property_category": "residential",
      "expected_rent_per_month": 20000,
      "city_name": "Noida",
      "locality_name": "Sector 62",
      "society_name": "ABC Society",
      "bhk": "2",
      "furnishing": "Furnished",
      "images": ["https://YOUR_DOMAIN/uploads/...jpg"],
      "status": "published"
    }
  ]
}
```

---

## 6. Wishlist / Shortlist

🔒 **Requires:** Authentication (JWT).

### 6.1 Toggle Shortlist

**POST** `/property/wishlist.php`

```json
{ "action": "toggle", "property_id": 101 }
```

#### Success `200`
```json
{
  "error": false,
  "status": "success",
  "type": "add",
  "message": "Property has been successfully added to your shortlist."
}
```
> `type` is `"add"` or `"remove"`.

---

### 6.2 Get Shortlisted IDs

**POST** `/property/wishlist.php`

```json
{ "action": "get-ids" }
```

#### Success `200`
```json
{ "status": "success", "ids": [101, 205, 309] }
```

---

## 7. Recently Viewed

🔒 **Requires:** Authentication with `properties.create` permission.

### 7.1 Add a View

**POST** `/property/recently-viewed.php`

```json
{ "action": "add-view", "property_id": 101 }
```

#### Success `200`
```json
{ "status": "success", "type": "add", "property_id": 101 }
```

---

### 7.2 Get Recently Viewed IDs

**POST** `/property/recently-viewed.php`

```json
{ "action": "get-ids" }
```

#### Success `200`
```json
{ "status": "success", "ids": [101, 88, 55] }
```

---

### 7.3 Sync Views (Bulk from Local Storage)

**POST** `/property/recently-viewed.php`

```json
{ "action": "sync-views", "ids": [101, 88, 55, 32] }
```

#### Success `200`
```json
{ "status": "success", "ids": [101, 88, 55, 32] }
```

---

## 8. Contact Details / Reveal

**POST** `/property/contact-details.php`

Three `action` values control behaviour.

---

### 8.1 `action: "summary"` — Get Contact Preview

Returns masked info for unauthenticated users; full details for authenticated users (and logs lead).

#### Request Body
```json
{ "action": "summary", "property_id": 101 }
```

#### Unauthenticated Response `200`
```json
{ "status": "success", "data": { "cta_label": "Get Owner Details", "phone_masked": "98765*****" } }
```

#### Authenticated Response `200`
```json
{
  "status": "success",
  "phone_full": "9876543210",
  "call_url": "tel:9876543210",
  "whatsapp_number": "9876543210",
  "address_line": "Flat 3B, ABC Society, Sector 62",
  "headline": "Owner details",
  "society_name": "ABC Society",
  "default_message": "Hi, I am interested in your property..."
}
```

---

### 8.2 `action: "reveal"` — Reveal Contact (Unauthenticated Flow)

#### Request Body
```json
{
  "action": "reveal",
  "property_id": 101,
  "viewer_name": "Amit Sharma",
  "viewer_phone": "9876543210",
  "viewer_dealer": "no"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `viewer_name` | ✅ | Name (min 2 chars) |
| `viewer_phone` | ✅ | 10-digit mobile |
| `viewer_dealer` | ✅ | `"yes"` or `"no"` |

#### OTP Required Response `200`
```json
{
  "status": "otp_required",
  "message": "OTP sent successfully.",
  "data": {
    "viewer_phone": "9876543210",
    "phone_masked": "98765*****",
    "otp_length": 6,
    "verify_label": "Verify OTP & Get Owner Details"
  }
}
```

---

### 8.3 `action: "track-channel"` — Track Contact Channel

```json
{
  "action": "track-channel",
  "property_id": 101,
  "viewer_phone": "9876543210",
  "channel": "whatsapp",
  "lead_id": 55
}
```

| `channel` values | `call`, `whatsapp` |
|---|---|

#### Success `200`
```json
{ "status": "success", "message": "Channel tracked" }
```

---

## 9. Location & Autocomplete

### 9.1 Get All Cities

**GET** `/search/get-cities.php`

#### Success `200`
```json
{
  "success": true,
  "data": [
    { "id": 1, "city": "Noida" },
    { "id": 2, "city": "Greater Noida" }
  ]
}
```

---

### 9.2 Location Autocomplete

**GET** `/search/suggest-location.php`

Combines DB (cities, localities, societies, places) + Google Places suggestions.

| Param | Required | Description |
|-------|----------|-------------|
| `q` | ✅ | Search query (min 3 chars) |
| `city_id` | ❌ | Restrict to a specific city ID |
| `city_name` | ❌ | Restrict by city name (`all` to skip) |

#### Success `200`
```json
{
  "success": true,
  "results": [
    { "type": "city",     "label": "City",     "id": 1,  "name": "Noida",                "source": "database", "score": 80 },
    { "type": "locality", "label": "Locality",  "id": 45, "name": "Sector 62, Noida",     "lat": "28.6227", "lng": "77.3631", "city_id": 1, "source": "database", "score": 70 },
    { "type": "place",    "label": "Society",   "id": 10, "name": "ATS Greens",           "lat": "28.621",  "lng": "77.362",  "city_id": "1", "locality_id": "45", "source": "database", "score": 55 },
    { "type": "landmark", "label": "Landmark",             "name": "DLF Mall, Noida",    "place_id": "ChIJ...", "source": "google", "score": 40 }
  ]
}
```

**Result `type` values:**

| `type` | `label` | Has `lat`/`lng`? |
|--------|---------|-----------------|
| `city` | City | From DB |
| `locality` | Locality | From DB |
| `place` | Society / School / Hospital / etc. | From DB |
| `landmark` | Landmark | Google only (no lat/lng — need Place Details) |
| `state` | State | Google only |

---

### 9.3 Popular Locations

**GET** `/common/popular_locations.php`

| Param | Values | Description |
|-------|--------|-------------|
| `type` | `admin`, `user`, `default` | Source type |
| `value` | `lat,lng` | Required when `type=user` |

#### Success `200`
```json
{
  "locations": [
    { "name": "Sector 62", "tags": ["Low commute stress", "Major office hub", "Metro-connected"] }
  ],
  "tagline": "Handpicked by Admin"
}
```

---

## 10. Error Responses

All errors follow this shape:

```json
{ "status": "error", "message": "Human-readable error description" }
```

| HTTP Code | Meaning |
|-----------|---------|
| 200 | Success |
| 400 | Bad request / validation failed |
| 401 | Unauthorized / invalid credentials / OTP |
| 403 | Forbidden — account inactive or no permission |
| 422 | Unprocessable — missing or invalid fields |
| 500 | Internal server error |

---

## 11. Mobile App Screen → API Mapping

| Screen | APIs Required |
|--------|--------------|
| **Splash** | — |
| **Login** | `POST /auth/login.php` |
| **OTP Login** | `POST /auth/send-otp.php`, `POST /auth/verify-otp.php` |
| **Set Password** | `POST /auth/set-new-password.php` |
| **Home** | `GET /search/get-cities.php`, `GET /common/popular_locations.php`, `POST /property/get-p-card.php` (exclusive) |
| **Search Bar** | `GET /search/suggest-location.php` |
| **Search Results** | `GET /search/search-property.php` (or pg / commercial), `POST /property/get-p-card.php` |
| **Property Detail** | `POST /property/get-p-card.php` (single), `POST /property/contact-details.php` |
| **Shortlisted** | `POST /property/wishlist.php` (get-ids), `POST /property/get-p-card.php` |
| **Recent** | `POST /property/recently-viewed.php` (get-ids / sync-views), `POST /property/get-p-card.php` |
| **Profile** | `GET /profile/details.php`, `POST /profile/update.php` |
| **Email Change** | `POST /profile/send-email-otp.php`, `POST /profile/verify-email-otp.php` |
| **Register** | `POST /users/add-update-users.php` |

---

## 12. Notes for Mobile Integration

1. **JWT Auth:** After login/OTP verify, store the `admin_token`. Send it on every protected request as `Authorization: Bearer <token>` header or in the cookie jar.

2. **Cursor Pagination:** Pass `cursor.id` → `cursor_id` and `cursor.sort_value` → `cursor_sort_value` for next pages. Stop when `has_more: false`.

3. **Two-Step Property Load:** Search returns only `{ id, distance_km }`. Always call `get-p-card.php` with those IDs to get full displayable cards.

4. **Wishlist Sync:** On app launch call `wishlist.php` with `action: "get-ids"` to restore local shortlist state.

5. **Recent Views Sync:** On app launch/foreground call `recently-viewed.php` with `action: "sync-views"` and local IDs.

6. **Location Flow:**
   - DB results (`source: "database"`) have `lat`/`lng` — pass directly to search.
   - Google results (`source: "google"`) have only `place_id` — resolve coordinates via Google Place Details API before searching.

7. **Contact Reveal Flow:**
   - Call with `action: "summary"`.
   - Authenticated → full details returned.
   - Unauthenticated → call `action: "reveal"` → receive `otp_required` → show OTP input → on OTP verify success, call reveal again.

8. **Password Rules:** Min 8 chars, must contain: uppercase letter, lowercase letter, digit, and one of `@$!%*?&`.

9. **Phone Validation:** Mobile numbers must start with 6, 7, 8, or 9 and be exactly 10 digits.
