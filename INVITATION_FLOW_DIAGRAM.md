# 🎯 Complete Invitation Flow Diagram

## **Flow Overview: Owner Creates Team → Members Receive Email → Code Verification → Profile Setup**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                INVITATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

1. OWNER CREATES TEAM
   ┌─────────────────┐
   │ Organization    │
   │ Creation Form   │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Add Leaders &   │
   │ Members         │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ SendGrid API    │
   │ Sends Emails    │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Email Contains: │
   │ • Magic Link    │
   │ • 6-digit Code  │
   │ • Organization  │
   │   Context       │
   └─────────────────┘

2. MEMBER RECEIVES EMAIL
   ┌─────────────────┐
   │ Member Opens    │
   │ Email           │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Two Options:    │
   │ • Click Magic   │
   │   Link (fast)   │
   │ • Enter Code    │
   │   (manual)      │
   └─────────────────┘

3A. MAGIC LINK FLOW (Fast)
   ┌─────────────────┐
   │ Click Magic     │
   │ Link in Email   │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ /verify-invite  │
   │ ?token=xxx      │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Auto-verify &   │
   │ Redirect to     │
   │ Profile Setup   │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ /onboarding/    │
   │ profile         │
   └─────────────────┘

3B. CODE VERIFICATION FLOW (Manual)
   ┌─────────────────┐
   │ Click Code Link │
   │ in Email        │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ /accept         │
   │ ?email=xxx      │
   │ &code=123456    │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Enter 6-digit   │
   │ Code            │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Verify Code     │
   │ via API         │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Success!        │
   │ Redirect to     │
   │ Profile Setup   │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ /onboarding/    │
   │ profile         │
   └─────────────────┘

4. PROFILE SETUP
   ┌─────────────────┐
   │ Pre-filled:     │
   │ • Email         │
   │ • Name          │
   │ • Organization  │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ User Enters:    │
   │ • Password      │
   │ • Confirm Pass  │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Complete        │
   │ Invitation      │
   │ via API         │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Create User     │
   │ Account         │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Set Session     │
   │ Cookie          │
   └─────────┬───────┘
             │
             ▼
   ┌─────────────────┐
   │ Redirect to     │
   │ /dashboard      │
   └─────────────────┘

5. SUCCESS!
   ┌─────────────────┐
   │ User is now     │
   │ logged in and   │
   │ can access      │
   │ the system      │
   └─────────────────┘
```

## **API Endpoints Used:**

### **Organization Creation:**
- `POST /api/org` - Creates organization and sends invitations

### **Verification:**
- `POST /api/verify-magic-link` - Verifies magic link token
- `POST /api/verify-invite-code` - Verifies 6-digit code

### **Profile Completion:**
- `POST /api/complete-invitation` - Completes invitation and creates user

### **Resend:**
- `POST /api/resend-invitation` - Resends invitation email

## **Pages Used:**

### **Accept Page:**
- `/accept?email=xxx&code=123456` - Code verification page

### **Profile Setup:**
- `/onboarding/profile?email=xxx&name=xxx&org=xxx` - Profile completion

### **Verification Page:**
- `/verify-invite?token=xxx` - Magic link verification

## **Email Template Features:**

### **Magic Link Section (Blue):**
- One-click verification button
- Instant access to profile setup

### **Code Section (Yellow):**
- 6-digit code display
- Manual verification option
- 24-hour expiration notice

### **Organization Context:**
- Who invited you
- Organization name
- Clear instructions

## **Security Features:**

- ✅ **24-hour expiration** for all invitations
- ✅ **One-time use** - invitations consumed after verification
- ✅ **JWT tokens** for session management
- ✅ **HTTP-only cookies** for secure authentication
- ✅ **Email validation** and format checking
- ✅ **Password requirements** (minimum 6 characters)

## **Testing the Flow:**

1. **Create Organization**: Go to `/org/create` and add members
2. **Check Email**: Look for invitation email with magic link and code
3. **Test Magic Link**: Click the blue button for instant verification
4. **Test Code**: Use the yellow code for manual verification
5. **Complete Profile**: Set name and password
6. **Access Dashboard**: User is logged in and ready to use the system

---

**🎉 The complete invitation flow is now working perfectly!**

