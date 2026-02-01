# Database Schema - Phase 1 Models

## Entity Relationship Overview

```
User (existing)
  |
  ├── enrolledCourses → Course
  |
Course (existing)
  |
  ├── creator → User
  ├── enrolledStudents → [User]
  ├── lectures → [Lecture]
  |
  ├── Quizzes (new) 
  ├── Assignments (new)
  └── Progress Records (new)

Lecture (existing)
  |
  ├── Quizzes (new)
  └── Assignments (new)
```

---

## New Collections

### 1. Quiz Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  course: ObjectId → Course (required),
  lecture: ObjectId → Lecture (optional),
  questions: [
    {
      questionText: String (required),
      questionType: "multiple-choice" | "true-false" | "short-answer",
      options: [
        {
          text: String,
          isCorrect: Boolean
        }
      ],
      correctAnswer: String, // for short-answer
      points: Number (default: 1),
      explanation: String
    }
  ],
  duration: Number (default: 30), // minutes
  passingScore: Number (default: 60), // percentage
  attempts: Number (default: 0), // 0 = unlimited
  isActive: Boolean (default: true),
  creator: ObjectId → User (required),
  studentAttempts: [
    {
      student: ObjectId → User,
      answers: [
        {
          questionId: ObjectId,
          selectedAnswer: String,
          isCorrect: Boolean,
          pointsEarned: Number
        }
      ],
      score: Number, // percentage
      totalPoints: Number,
      earnedPoints: Number,
      passed: Boolean,
      attemptNumber: Number,
      submittedAt: Date (default: now)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `course` (for quick course quiz lookups)
- `creator` (for educator's quiz management)

---

### 2. Assignment Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  course: ObjectId → Course (required),
  lecture: ObjectId → Lecture (optional),
  dueDate: Date (required),
  maxPoints: Number (default: 100),
  allowedFileTypes: [String], // ["pdf", "docx", "txt"]
  maxFileSize: Number (default: 10), // MB
  instructions: String,
  attachments: [
    {
      fileName: String,
      fileUrl: String
    }
  ],
  isActive: Boolean (default: true),
  creator: ObjectId → User (required),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `course` (for course assignment lookups)
- `dueDate` (for sorting/filtering)

---

### 3. Submission Collection

```javascript
{
  _id: ObjectId,
  assignment: ObjectId → Assignment (required),
  student: ObjectId → User (required),
  submissionText: String,
  files: [
    {
      fileName: String,
      fileUrl: String,
      fileSize: Number, // bytes
      uploadedAt: Date (default: now)
    }
  ],
  status: "submitted" | "late" | "graded" | "returned" (default: "submitted"),
  submittedAt: Date (default: now),
  
  // Grading
  grade: Number (min: 0),
  feedback: String,
  aiGeneratedFeedback: String,
  gradedBy: ObjectId → User,
  gradedAt: Date,
  isLate: Boolean (default: false),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ assignment: 1, student: 1 }` (unique) - prevents duplicate submissions
- `assignment` (for educator viewing all submissions)
- `student` (for student viewing their submissions)

---

### 4. Progress Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId → User (required),
  course: ObjectId → Course (required),
  
  // Lecture tracking
  completedLectures: [
    {
      lecture: ObjectId → Lecture,
      completedAt: Date (default: now),
      watchTime: Number (default: 0) // seconds
    }
  ],
  
  // Quiz tracking
  quizScores: [
    {
      quiz: ObjectId → Quiz,
      score: Number, // percentage
      attemptNumber: Number,
      completedAt: Date (default: now)
    }
  ],
  
  // Assignment tracking
  assignmentSubmissions: [
    {
      assignment: ObjectId → Assignment,
      submission: ObjectId → Submission,
      grade: Number,
      submittedAt: Date
    }
  ],
  
  // Overall metrics
  completionPercentage: Number (default: 0),
  lastAccessedAt: Date (default: now),
  enrolledAt: Date (default: now),
  completedAt: Date,
  
  // Certificate
  certificateIssued: Boolean (default: false),
  certificateUrl: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ user: 1, course: 1 }` (unique) - one progress record per user-course
- `user` (for user's all progress)
- `course` (for course analytics)

**Methods**:
- `calculateCompletion()` - Auto-calculates completion percentage

---

## Relationships Summary

### Quiz
- **Belongs to**: Course (required), Lecture (optional)
- **Created by**: User (educator)
- **Contains**: Multiple questions with options
- **Tracks**: Student attempts with answers and scores

### Assignment
- **Belongs to**: Course (required), Lecture (optional)
- **Created by**: User (educator)
- **Has**: Multiple file attachments (optional)
- **Connected to**: Submissions

### Submission
- **Belongs to**: Assignment (required)
- **Submitted by**: User (student)
- **Contains**: Files and/or text
- **Graded by**: User (educator)
- **Has**: Regular feedback and AI-generated feedback

### Progress
- **Belongs to**: User and Course (unique pair)
- **Tracks**: 
  - Completed lectures
  - Quiz scores
  - Assignment submissions
- **Calculates**: Completion percentage
- **Manages**: Certificate generation

---

## Data Integrity Rules

1. **Quiz**:
   - Only course creator can create quizzes
   - Questions must have at least one option for MCQ/T-F
   - Passing score must be 0-100
   - Duration must be positive

2. **Assignment**:
   - Due date must be in the future when created
   - Max points must be positive
   - Only course creator can create assignments

3. **Submission**:
   - One submission per student per assignment
   - Cannot modify after grading
   - Grade must be ≤ maxPoints
   - File size must be ≤ maxFileSize

4. **Progress**:
   - One record per user-course pair
   - Completion percentage auto-calculated
   - Cannot manually set completion percentage
   - Lecture can only be marked complete once

---

## Cascade Deletion Rules

1. **Delete Course**:
   - Also deletes: Quizzes, Assignments, Progress records
   - Cascade to: Submissions via Assignments

2. **Delete Assignment**:
   - Also deletes: All associated Submissions

3. **Delete Quiz**:
   - Updates: Progress records (removes quiz scores)

4. **Delete User**:
   - If educator: Courses, Quizzes, Assignments cascade
   - If student: Progress, Submissions cascade

---

## Performance Considerations

### Indexes Created
- All foreign key references are indexed
- Unique compound indexes prevent duplicates
- Date fields indexed for sorting/filtering

### Query Optimization
- Populate references only when needed
- Use select() to limit returned fields
- Paginate large result sets

### Aggregation Pipelines
Can be used for:
- Course analytics (average quiz scores)
- Student leaderboards
- Completion statistics
- Grading distribution

---

## Migration from Existing System

**No migration needed!** All new collections are additive:
- Existing User, Course, Lecture collections unchanged
- New collections reference existing ones
- Fully backward compatible

---

## Storage Estimates

Average document sizes:
- Quiz: ~5-10 KB (depends on question count)
- Assignment: ~2-5 KB
- Submission: ~3-8 KB (without files, files on Cloudinary)
- Progress: ~5-15 KB (grows with course completion)

For 1000 students, 100 courses:
- Quizzes: ~500 KB (50 quizzes)
- Assignments: ~250 KB (50 assignments)
- Submissions: ~4 MB (500 submissions)
- Progress: ~5 MB (5000 records)

**Total: ~10 MB** (excluding Cloudinary files)

---

**Database**: MongoDB
**ODM**: Mongoose
**Status**: ✅ Implemented in Phase 1
