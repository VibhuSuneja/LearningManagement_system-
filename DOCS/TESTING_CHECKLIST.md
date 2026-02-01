# 🧪 Phase 1 Testing Checklist

## After Vercel Deployment

### 📋 **Pre-Testing Setup**

**You need to check/verify:**

1. ✅ **Backend Deployment Status**
   - [ ] Check Vercel deployment logs for errors
   - [ ] Verify backend build succeeded
   - [ ] Check that all 6 new console logs appear:
     ```
     ✅ Course router has been successfully loaded.
     ✅ Gamification router has been successfully loaded.
     ✅ Forum router has been successfully loaded.
     ✅ Quiz router has been successfully loaded.
     ✅ Assignment router has been successfully loaded.
     ✅ Progress router has been successfully loaded.
     ```

2. ✅ **Database Connection**
   - [ ] MongoDB Atlas is running
   - [ ] Database connection successful in logs
   - [ ] No authentication errors

3. ✅ **Environment Variables** (Vercel dashboard)
   - [ ] `MONGODB_URI` is set
   - [ ] `JWT_SECRET` is set
   - [ ] `CLOUDINARY_*` variables are set
   - [ ] All other required env vars present

---

## 🔍 **What to Check as a Human**

### **1. Server Health Check** (5 min)

**Test**: Visit your backend URL
- URL: `https://your-backend.vercel.app/`
- **Expected**: Should see: `🚀 Server is running with WebSockets!`

**If fails**: Check Vercel function logs

---

### **2. Existing Features (Regression Testing)** (10 min)

**CRITICAL**: Make sure we didn't break anything!

Login to your deployed app and verify:

- [ ] **User Authentication**
  - [ ] Can log in as student
  - [ ] Can log in as educator
  - [ ] JWT tokens working

- [ ] **Courses**
  - [ ] Can view published courses
  - [ ] Can enroll in courses
  - [ ] My courses page loads

- [ ] **Lectures**
  - [ ] Can view lectures
  - [ ] Video playback works
  - [ ] Educator can add/edit lectures

- [ ] **Reviews**
  - [ ] Can post reviews
  - [ ] Reviews display correctly

- [ ] **Chat/Messages**
  - [ ] WebSocket connection works
  - [ ] Can send messages

- [ ] **Forum**
  - [ ] Can create threads
  - [ ] Can post comments

- [ ] **Notifications**
  - [ ] Notification tray loads
  - [ ] Previous notifications still work

---

### **3. New Features - Basic Functionality** (15 min)

Use **Postman** or **Thunder Client** to test new endpoints:

#### **A. Quiz Endpoints**

**Test 1: Create Quiz** (Educator account)
```
POST {{backend_url}}/api/quiz/create
Headers: Cookie with JWT

Body:
{
  "title": "Test Quiz",
  "courseId": "YOUR_COURSE_ID",
  "questions": [
    {
      "questionText": "2 + 2 = ?",
      "questionType": "multiple-choice",
      "options": [
        { "text": "3", "isCorrect": false },
        { "text": "4", "isCorrect": true }
      ],
      "points": 1
    }
  ],
  "duration": 10,
  "passingScore": 50
}
```

**Expected**: 
- ✅ Status 201
- ✅ Returns quiz object with _id
- ✅ Quiz appears in database

**Check**: Look at Vercel logs for any errors

---

**Test 2: Get Course Quizzes**
```
GET {{backend_url}}/api/quiz/course/YOUR_COURSE_ID
```

**Expected**:
- ✅ Status 200
- ✅ Array of quizzes
- ✅ Contains the quiz you just created

---

**Test 3: Submit Quiz** (Student account)
```
POST {{backend_url}}/api/quiz/QUIZ_ID/submit

Body:
{
  "answers": [
    {
      "questionId": "QUESTION_ID",
      "selectedAnswer": "1"
    }
  ]
}
```

**Expected**:
- ✅ Status 200
- ✅ Returns score, passed status
- ✅ Auto-graded correctly

---

#### **B. Assignment Endpoints**

**Test 4: Create Assignment** (Educator)
```
POST {{backend_url}}/api/assignment/create
Content-Type: multipart/form-data

Form data:
title: "Test Assignment"
description: "Submit your code"
courseId: YOUR_COURSE_ID
dueDate: 2026-02-15T23:59:59.000Z
maxPoints: 100
```

**Expected**:
- ✅ Status 201
- ✅ Returns assignment object
- ✅ Assignment saved in database

---

**Test 5: Submit Assignment** (Student)
```
POST {{backend_url}}/api/assignment/ASSIGNMENT_ID/submit
Content-Type: multipart/form-data

Form data:
submissionText: "Here is my submission"
files: [upload a PDF file]
```

**Expected**:
- ✅ Status 200
- ✅ File uploaded to Cloudinary
- ✅ Submission saved
- ✅ Educator receives notification

---

**Test 6: Grade Submission** (Educator)
```
POST {{backend_url}}/api/assignment/submission/SUBMISSION_ID/grade

Body:
{
  "grade": 85,
  "feedback": "Good work!"
}
```

**Expected**:
- ✅ Status 200
- ✅ Submission updated
- ✅ Student receives notification

---

#### **C. Progress Endpoints**

**Test 7: Mark Lecture Complete** (Student)
```
POST {{backend_url}}/api/progress/course/COURSE_ID/lecture/LECTURE_ID/complete

Body:
{
  "watchTime": 120
}
```

**Expected**:
- ✅ Status 200
- ✅ Returns updated progress
- ✅ Completion percentage calculated

---

**Test 8: Get My Progress**
```
GET {{backend_url}}/api/progress/my-progress
```

**Expected**:
- ✅ Status 200
- ✅ Returns progress for all enrolled courses
- ✅ Shows stats (totalCourses, completedCourses, etc.)

---

### **4. Database Verification** (5 min)

**Check MongoDB Atlas:**

- [ ] New collections created:
  - [ ] `quizzes`
  - [ ] `assignments`
  - [ ] `submissions`
  - [ ] `progresses`

- [ ] Sample data exists in collections
- [ ] Indexes created correctly

---

### **5. Error Handling** (5 min)

**Test edge cases:**

- [ ] **Invalid quiz submission** (wrong questionId)
  - Should return 400/500 with error message

- [ ] **Unauthorized access** (student tries to create quiz)
  - Should return 403 Forbidden

- [ ] **Submit to non-existent assignment**
  - Should return 404 Not Found

- [ ] **Grade without being course creator**
  - Should return 403 Forbidden

---

### **6. Notifications Check** (5 min)

After testing above:

**Check notification tray shows:**
- [ ] "New quiz created" (for enrolled students)
- [ ] "Assignment posted" (for enrolled students)
- [ ] "Assignment submitted" (for educator)
- [ ] "Assignment graded" (for student)

---

## 🚨 **Red Flags to Watch For**

### **Immediate Issues**
- ❌ Server not starting (check Vercel logs)
- ❌ Database connection errors
- ❌ Existing features broken (regression)
- ❌ 500 errors on any endpoint

### **Performance Issues**
- ⚠️ Slow response times (>2s for simple queries)
- ⚠️ Timeout errors
- ⚠️ Memory issues in Vercel logs

### **Data Issues**
- ❌ Quiz scoring incorrect
- ❌ Files not uploading to Cloudinary
- ❌ Progress percentage not calculating
- ❌ Duplicate submissions allowed

---

## 📊 **Success Criteria**

**Phase 1 is deployment-ready if:**

✅ All existing features work (no regressions)
✅ Can create and submit quiz successfully
✅ Can create, submit, and grade assignment
✅ Progress tracking updates correctly
✅ Notifications sent for all events
✅ No 500 errors on any endpoint
✅ Database indexes created
✅ File uploads work correctly

---

## 🔧 **If Something Breaks**

### **Quick Fixes**

1. **Server won't start**
   - Check Vercel function logs
   - Verify all imports are correct
   - Check for syntax errors (already validated locally)

2. **Database errors**
   - Verify MongoDB URI in Vercel env vars
   - Check IP whitelist in MongoDB Atlas
   - Look for schema validation errors

3. **Routes not found**
   - Check index.js route registration
   - Verify route paths match exactly
   - Check middleware order

4. **File upload fails**
   - Verify Cloudinary credentials in Vercel
   - Check file size limits
   - Look at multer middleware configuration

---

## 📝 **Test Results Template**

Copy this to track your testing:

```
=== PHASE 1 DEPLOYMENT TEST RESULTS ===
Date: 2026-02-01
Backend URL: ___________________________

✅ / ❌  Server Health Check
✅ / ❌  Existing Features Working
✅ / ❌  Quiz Creation
✅ / ❌  Quiz Submission
✅ / ❌  Assignment Creation
✅ / ❌  Assignment Submission
✅ / ❌  Assignment Grading
✅ / ❌  Progress Tracking
✅ / ❌  Notifications Working
✅ / ❌  Database Collections Created

Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

Ready for Phase 2: YES / NO

Notes:
_____________________________________
_____________________________________
```

---

## ⏱️ **Estimated Testing Time**

- Pre-testing setup: 5 min
- Existing features check: 10 min
- New features testing: 15 min
- Database verification: 5 min
- Error handling: 5 min
- Notifications check: 5 min

**Total: ~45 minutes**

---

## 🎯 **Next Steps After Testing**

### **If All Tests Pass** ✅
1. Mark this checklist complete
2. Update task.md 
3. Ready to start **Phase 2 (AI Features)**
4. I'll implement AI quiz generator, assignment grader, and study assistant

### **If Issues Found** ⚠️
1. List all issues in notes
2. Share error logs with me
3. I'll fix any problems
4. Re-test and re-deploy

---

**Good luck with testing! 🚀**

Let me know:
1. If deployment succeeds
2. Any errors you encounter
3. When you're ready for Phase 2!
