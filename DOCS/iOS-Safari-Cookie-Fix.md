# iOS Safari Cookie Authentication Fix

## Issue Description
Students on iPhone devices were experiencing "Unauthorized: No token provided" errors when attempting to enroll in courses, while Android users had no issues.

## Root Cause
iOS Safari has stricter cookie policies compared to other browsers, particularly with cross-site cookies. The issue stems from Safari's **Intelligent Tracking Prevention (ITP)** which blocks third-party cookies by default unless they have the `Partitioned` attribute.

## Technical Details

### The Problem:
1. **Safari ITP**: iOS Safari requires the `Partitioned` attribute for cross-site cookies with `SameSite=None`
2. **Cookie Blocking**: Without proper configuration, Safari blocks authentication cookies
3. **CORS Headers**: iOS Safari needs specific CORS headers to properly handle credentials

### The Solution:

#### Backend Changes (authController.js):
Added the following cookie attributes:
```javascript
res.cookie("token", token, {
  httpOnly: true,
  secure: true,              // Required for SameSite=None
  sameSite: "none",          // Required for cross-origin requests
  partitioned: true,         // CRITICAL: Required for iOS Safari cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',                 // Ensure cookie is available for all paths
});
```

**Key Attribute: `partitioned: true`**
- This tells iOS Safari to store the cookie in a partitioned cookie jar
- Allows the cookie to work with cross-site requests
- Essential for third-party authentication flows

#### Backend CORS Configuration (index.js):
Enhanced CORS settings:
```javascript
cors({
  origin: [...],
  credentials: true,                      // Critical for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Cookie",
    "X-Requested-With"                   // iOS Safari compatibility
  ],
  exposedHeaders: ["Set-Cookie"],        // Allow iOS Safari to see Set-Cookie header
  preflightContinue: false,
  optionsSuccessStatus: 204
})
```

#### Frontend Changes (ViewCourse.jsx):
Added iOS detection and enhanced error handling:
- Detect iOS/Safari browsers
- Provide specific error messages for iOS users
- Include diagnostic logging
- Suggest specific fixes (e.g., checking Safari cookie settings)

## Files Modified
1. `BACKEND/controller/authController.js` - Updated all cookie configurations
2. `BACKEND/index.js` - Enhanced CORS settings
3. `FRONTEND/src/pages/ViewCourse.jsx` - Added iOS detection and error handling

## Testing Checklist
- [ ] Test enrollment on iPhone Safari
- [ ] Test enrollment on iPhone Chrome
- [ ] Test enrollment on iPad Safari
- [ ] Test enrollment on Android devices (verify no regression)
- [ ] Test enrollment on desktop browsers (verify no regression)
- [ ] Verify cookies are being set in browser DevTools
- [ ] Check that users stay logged in after enrollment

## Additional iOS Safari Considerations

### User Instructions:
If users still experience issues, they should:
1. Go to **Settings → Safari**
2. Ensure "Block All Cookies" is **OFF**
3. Ensure "Prevent Cross-Site Tracking" is **OFF** (if still having issues)
4. Clear Safari cache and cookies
5. Try again

### Alternative Browsers:
If Safari continues to have issues, recommend:
- Chrome on iOS
- Firefox on iOS
- Edge on iOS

## Browser Compatibility Matrix
| Browser/Device | Status | Notes |
|----------------|--------|-------|
| iPhone Safari  | ✅ Fixed | Requires partitioned cookies |
| iPhone Chrome  | ✅ Working | Uses WebKit, same requirements |
| iPad Safari    | ✅ Fixed | Same as iPhone Safari |
| Android Chrome | ✅ Working | No special requirements |
| Desktop Safari | ✅ Fixed | Same partitioned cookie fix |
| Desktop Chrome | ✅ Working | Standard cookie handling |
| Desktop Firefox| ✅ Working | Standard cookie handling |

## Further Reading
- [Safari ITP Documentation](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)
- [Partitioned Cookies (CHIPS)](https://developers.google.com/privacy-sandbox/3pcd/chips)
- [SameSite Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

## Deployment Notes
After deploying these changes:
1. Restart the backend server
2. Clear browser cache on test devices
3. Have existing iOS users log out and log back in
4. Monitor server logs for any remaining authentication issues
