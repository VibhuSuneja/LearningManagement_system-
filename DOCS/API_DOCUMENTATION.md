# API Documentation - Phase 1 Features

## Base URL
```
http://localhost:8080/api
```

All endpoints require authentication via JWT token in cookies unless otherwise specified.

---

## 📝 Quiz Endpoints

### 1. Create Quiz
**POST** `/api/quiz/create`

**Auth Required**: Yes (Educator only)

**Request Body**:
```json
{
  "title": "JavaScript Basics Quiz",
  "description": "Test your knowledge of JS fundamentals",
  "courseId": "64f8a1b2c3d4e5f6g7h8i9j0",
  "lectureId": "64f8a1b2c3d4e5f6g7h8i9j1", // Optional
  "duration": 30, // minutes
  "passingScore": 70, // percentage
  "attempts": 3, // 0 = unlimited
  "questions": [
    {
      "questionText": "What is a closure?",
      "questionType": "multiple-choice",
      "options": [
        { "text": "A function inside another function", "isCorrect": true },
        { "text": "A loop", "isCorrect": false }
      ],
      "points": 2,
      "explanation": "A closure gives access to outer function's scope"
    },
    {
      "questionText": "JavaScript is single-threaded",
      "questionType": "true-false",
      "options": [
        { "text": "True", "isCorrect": true },
        { "text": "False", "isCorrect": false }
      ],
      "points": 1
    },
    {
      "questionText": "What does DOM stand for?",
      "questionType": "short-answer",
      "correctAnswer": "Document Object Model",
      "points": 1
    }
  ]
}
```

**Response**:
```json
{
  "message": "Quiz created successfully",
  "quiz": { /* quiz object */ }
}
```

---

### 2. Get Course Quizzes
**GET** `/api/quiz/course/:courseId`

**Auth Required**: Yes

**Response**:
```json
{
  "quizzes": [
    {
      "_id": "...",
      "title": "JavaScript Basics Quiz",
      "description": "...",
      "duration": 30,
      "passingScore": 70,
      "attempts": 3,
      "creator": { "name": "John Doe", "email": "..." },
      "lecture": { "lectureTitle": "..." }
    }
  ]
}
```

---

### 3. Get Quiz Details
**GET** `/api/quiz/:quizId`

**Auth Required**: Yes

**Response**:
```json
{
  "quiz": { /* quiz without correct answers */ },
  "attemptCount": 2,
  "maxAttempts": 3,
  "canAttempt": true
}
```

---

### 4. Submit Quiz Attempt
**POST** `/api/quiz/:quizId/submit`

**Auth Required**: Yes (Student)

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": "64f8a1b2c3d4e5f6g7h8i9j2",
      "selectedAnswer": "0" // index for MCQ/True-False, text for short-answer
    }
  ]
}
```

**Response**:
```json
{
  "message": "Quiz submitted successfully",
  "score": 85,
  "passed": true,
  "earnedPoints": 17,
  "totalPoints": 20,
  "gradedAnswers": [
    {
      "questionId": "...",
      "selectedAnswer": "0",
      "isCorrect": true,
      "pointsEarned": 2
    }
  ]
}
```

---

### 5. Get Student Quiz Results
**GET** `/api/quiz/:quizId/results`

**Auth Required**: Yes

**Response**:
```json
{
  "attempts": [
    {
      "score": 85,
      "passed": true,
      "attemptNumber": 1,
      "submittedAt": "2026-02-01T10:30:00.000Z"
    }
  ],
  "quizTitle": "JavaScript Basics Quiz",
  "passingScore": 70
}
```

---

### 6. Update Quiz
**PUT** `/api/quiz/:quizId`

**Auth Required**: Yes (Creator only)

**Request Body**: Same as Create Quiz

---

### 7. Delete Quiz
**DELETE** `/api/quiz/:quizId`

**Auth Required**: Yes (Creator only)

---

### 8. Get Course Quiz Attempts (Educator)
**GET** `/api/quiz/course/:courseId/attempts`

**Auth Required**: Yes (Course creator only)

**Response**:
```json
{
  "quizzes": [
    {
      "title": "JavaScript Basics Quiz",
      "passingScore": 70,
      "studentAttempts": [
        {
          "student": { "name": "Jane Smith", "email": "..." },
          "score": 85,
          "passed": true,
          "submittedAt": "..."
        }
      ]
    }
  ]
}
```

---

## 📚 Assignment Endpoints

### 1. Create Assignment
**POST** `/api/assignment/create`

**Auth Required**: Yes (Educator only)

**Content-Type**: `multipart/form-data`

**Form Data**:
```
title: "Essay on Clean Code"
description: "Write a 1000-word essay..."
courseId: "64f8a1b2c3d4e5f6g7h8i9j0"
lectureId: "..." (optional)
dueDate: "2026-02-15T23:59:59.000Z"
maxPoints: 100
instructions: "Follow MLA format..."
allowedFileTypes: "pdf,docx,txt"
maxFileSize: 10 (in MB)
attachments: [File, File] (optional)
```

**Response**:
```json
{
  "message": "Assignment created successfully",
  "assignment": { /* assignment object */ }
}
```

---

### 2. Get Course Assignments
**GET** `/api/assignment/course/:courseId`

**Auth Required**: Yes

**Response**:
```json
{
  "assignments": [
    {
      "_id": "...",
      "title": "Essay on Clean Code",
      "description": "...",
      "dueDate": "2026-02-15T23:59:59.000Z",
      "maxPoints": 100,
      "creator": { "name": "...", "email": "..." }
    }
  ]
}
```

---

### 3. Get Assignment Details
**GET** `/api/assignment/:assignmentId`

**Auth Required**: Yes

**Response**:
```json
{
  "assignment": { /* full assignment details */ },
  "hasSubmitted": true,
  "submission": { /* submission if exists */ }
}
```

---

### 4. Submit Assignment
**POST** `/api/assignment/:assignmentId/submit`

**Auth Required**: Yes (Student)

**Content-Type**: `multipart/form-data`

**Form Data**:
```
submissionText: "Optional text submission"
files: [File, File, ...]
```

**Response**:
```json
{
  "message": "Assignment submitted successfully",
  "submission": { /* submission object */ },
  "isLate": false
}
```

---

### 5. Get My Submission
**GET** `/api/assignment/:assignmentId/my-submission`

**Auth Required**: Yes

**Response**:
```json
{
  "submission": {
    "_id": "...",
    "submissionText": "...",
    "files": [...],
    "status": "submitted",
    "grade": 85,
    "feedback": "Great work!",
    "submittedAt": "..."
  }
}
```

---

### 6. Grade Submission
**POST** `/api/assignment/submission/:submissionId/grade`

**Auth Required**: Yes (Educator only)

**Request Body**:
```json
{
  "grade": 85,
  "feedback": "Excellent work! Well-structured essay with clear arguments."
}
```

**Response**:
```json
{
  "message": "Submission graded successfully",
  "submission": { /* updated submission */ }
}
```

---

### 7. Get Assignment Submissions (Educator)
**GET** `/api/assignment/:assignmentId/submissions`

**Auth Required**: Yes (Creator only)

**Response**:
```json
{
  "submissions": [
    {
      "student": { "name": "...", "email": "..." },
      "status": "graded",
      "grade": 85,
      "submittedAt": "...",
      "isLate": false
    }
  ],
  "assignmentTitle": "Essay on Clean Code",
  "totalSubmissions": 15
}
```

---

### 8. Update Assignment
**PUT** `/api/assignment/:assignmentId`

**Auth Required**: Yes (Creator only)

---

### 9. Delete Assignment
**DELETE** `/api/assignment/:assignmentId`

**Auth Required**: Yes (Creator only)

---

### 10. Get Submission Details
**GET** `/api/assignment/submission/:submissionId`

**Auth Required**: Yes (Student or Educator)

---

### 11. Delete Submission
**DELETE** `/api/assignment/submission/:submissionId`

**Auth Required**: Yes (Student, before grading only)

---

## 📊 Progress Endpoints

### 1. Get Course Progress
**GET** `/api/progress/course/:courseId`

**Auth Required**: Yes

**Response**:
```json
{
  "progress": {
    "user": "...",
    "course": "...",
    "completedLectures": [
      {
        "lecture": { "lectureTitle": "Introduction" },
        "completedAt": "...",
        "watchTime": 1200
      }
    ],
    "quizScores": [
      {
        "quiz": { "title": "Quiz 1" },
        "score": 85,
        "attemptNumber": 2
      }
    ],
    "assignmentSubmissions": [...],
    "completionPercentage": 65,
    "lastAccessedAt": "..."
  }
}
```

---

### 2. Mark Lecture Complete
**POST** `/api/progress/course/:courseId/lecture/:lectureId/complete`

**Auth Required**: Yes

**Request Body**:
```json
{
  "watchTime": 1200 // optional, in seconds
}
```

**Response**:
```json
{
  "message": "Lecture marked as complete",
  "progress": { /* updated progress */ },
  "completionPercentage": 70
}
```

---

### 3. Unmark Lecture
**DELETE** `/api/progress/course/:courseId/lecture/:lectureId/complete`

**Auth Required**: Yes

---

### 4. Get My Overall Progress
**GET** `/api/progress/my-progress`

**Auth Required**: Yes

**Response**:
```json
{
  "progressRecords": [
    {
      "course": { "title": "...", "thumbnail": "..." },
      "completionPercentage": 65,
      "lastAccessedAt": "..."
    }
  ],
  "stats": {
    "totalCourses": 5,
    "completedCourses": 2,
    "inProgressCourses": 3,
    "averageCompletion": 68
  }
}
```

---

### 5. Get Course Students Progress (Educator)
**GET** `/api/progress/course/:courseId/students`

**Auth Required**: Yes (Course creator only)

**Response**:
```json
{
  "progressRecords": [
    {
      "user": { "name": "...", "email": "..." },
      "completionPercentage": 85,
      "lastAccessedAt": "..."
    }
  ],
  "totalStudents": 25
}
```

---

### 6. Get Student Progress (Educator)
**GET** `/api/progress/course/:courseId/student/:studentId`

**Auth Required**: Yes (Course creator only)

**Response**:
```json
{
  "progress": { /* detailed student progress */ }
}
```

---

## 🚨 Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `403` - Forbidden (authorization error)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔐 Authorization Rules

1. **Educators** can:
   - Create, edit, delete quizzes and assignments for their courses
   - View all student submissions and attempts
   - Grade submissions
   - View all student progress

2. **Students** can:
   - Take quizzes
   - Submit assignments
   - View their own submissions and progress
   - Mark lectures as complete

3. **Both** can:
   - View published courses, quizzes, and assignments
   - View their own data

---

## 📝 Notes

- All file uploads use Cloudinary
- Maximum file upload size is configurable per assignment
- Quiz attempts are tracked per student
- Progress is auto-calculated on lecture completion
- Notifications are sent automatically for key events

---

**Last Updated**: February 1, 2026
**Version**: 1.0 (Phase 1)
