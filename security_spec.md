# Security Specification

## Data Invariants
1. Users can only write to `/users/{userId}` if `request.auth.uid == userId`.
2. Campaigns, Creatives, and Projects under `/users/{userId}/*` can only be read and written by the authenticated user whose `uid` matches `{userId}`.
3. System fields (e.g. `createdAt`) are immutable after creation.
4. Payload sizes and formats must conform to defined boundaries.

## Dirty Dozen Payloads Test Matrix
1. Identity Spoofing: Creating a campaign under another user's UID path.
2. Shadow Field Injection: Injecting arbitrary `adminRole: true` in user document.
3. Overly long String Injection: Setting `name` string larger than 200 characters.
4. Malicious Regex Injection: Non-alphanumeric IDs.
5. Email Spoofing: Requesting access with unverified email.
6. Privilege Escalation: Updating `tier` from 'free' to 'pro' without verification.
7. Unauthenticated Read: Unauthenticated client querying `/users`.
8. Unauthenticated Write: Attempting to create a campaign without being signed in.
9. Orphaned Write: Writing a subcollection item without parent existing.
10. Immutable Field Override: Modifying `createdAt` field during update.
11. PII Leakage: Accessing another user's profile info.
12. Denial of Wallet: Passing unbounded lists or excessive payloads.
