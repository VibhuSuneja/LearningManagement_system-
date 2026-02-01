# LMS Feature Expansion: Implementation Plan

> **Goal**: Add Quizzes & Assessments, Progress Tracking, Assignment Submission, and AI-powered features to the Learning Management System.

---

## User Review Required

> [!IMPORTANT]
> **AI API Key**: The AI features require a Gemini API key. Please confirm you have one or want me to implement a placeholder.

> [!NOTE]
> This is a significant feature expansion. I recommend implementing in phases, testing each before moving to the next.

---

## Proposed Changes

### Backend: New Database Models

#### [NEW] quizModel.js
```javascript
// Quiz schema with questions, options, and correct answers
{
    course: ObjectId,      // Reference to Course
    lecture: ObjectId,     // Optional: Link to specific lecture
    title: String,
    questions: [{
        question: String,
        options: [String],  // Array of 4 options
        correctAnswer: Number, // Index of correct option (0-3)
        points: Number
    }],
    passingScore: Number,
    timeLimit: Number,     // In minutes (optional)
    createdBy: ObjectId    // Educator
}
```

#### [NEW] assignmentModel.js
```javascript
{
    course: ObjectId,
    lecture: ObjectId,     // Optional
    title: String,
    description: String,
    dueDate: Date,
    maxScore: Number,
    attachments: [String], // Educator-provided files
    createdBy: ObjectId
}
```

#### [NEW] submissionModel.js
```javascript
{
    assignment: ObjectId,
    student: ObjectId,
    content: String,       // Text submission
    files: [String],       // Uploaded file URLs
    score: Number,
    feedback: String,
    aiFeedback: String,    // AI-generated feedback
    submittedAt: Date,
    gradedAt: Date
}
```

#### [NEW] progressModel.js
```javascript
{
    user: ObjectId,
    course: ObjectId,
    completedLectures: [ObjectId], // Array of completed lecture IDs
    quizScores: [{
        quiz: ObjectId,
        score: Number,
        maxScore: Number,
        attemptedAt: Date
    }],
    lastAccessedAt: Date,
    completionPercentage: Number
}
```

---

### Backend: New Routes & Controllers

#### [NEW] quizRoute.js
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/quiz/create/:courseId` | Educator | Create a new quiz |
| GET | `/api/quiz/course/:courseId` | User | Get all quizzes for a course |
| GET | `/api/quiz/:quizId` | User | Get quiz details |
| POST | `/api/quiz/submit/:quizId` | Student | Submit quiz answers |
| DELETE | `/api/quiz/:quizId` | Educator | Delete quiz |
| POST | `/api/quiz/generate/:courseId` | Educator | **AI: Generate quiz from content** |

#### [NEW] assignmentRoute.js
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/assignment/create/:courseId` | Educator | Create assignment |
| GET | `/api/assignment/course/:courseId` | User | Get assignments for course |
| POST | `/api/assignment/submit/:assignmentId` | Student | Submit assignment |
| GET | `/api/assignment/submissions/:assignmentId` | Educator | View all submissions |
| POST | `/api/assignment/grade/:submissionId` | Educator | Grade a submission |
| POST | `/api/assignment/ai-feedback/:submissionId` | Educator | **AI: Generate feedback** |

#### [NEW] progressRoute.js
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/progress/:courseId` | User | Get user's progress for a course |
| POST | `/api/progress/complete-lecture/:lectureId` | Student | Mark lecture as complete |
| GET | `/api/progress/all` | User | Get progress for all enrolled courses |

---

### Backend: AI Integration

#### [MODIFY] index.js
- Import and mount new routes: `quizRoute`, `assignmentRoute`, `progressRoute`

#### AI Features (using Gemini API):
1. **Quiz Generator**: Analyze lecture title/description → Generate MCQs
2. **Assignment Grader**: Analyze student text submission → Provide feedback
3. **Study Assistant**: Already exists in chatbot, can be enhanced

---

### Frontend: New Pages & Components

#### [NEW] Quiz Components
- `QuizCreate.jsx` - Educator adds questions manually or via AI
- `QuizTake.jsx` - Student takes the quiz
- `QuizResults.jsx` - Display score and correct answers

#### [NEW] Assignment Components
- `AssignmentCreate.jsx` - Educator creates assignment
- `AssignmentSubmit.jsx` - Student submits work
- `AssignmentGrade.jsx` - Educator grades with AI suggestions

#### [NEW] Progress Components
- `ProgressBar.jsx` - Visual course completion bar
- `LectureComplete.jsx` - "Mark as Complete" button

#### [MODIFY] Existing Pages
- `ViewCourse.jsx` - Add quizzes, assignments, progress bar
- `MyEnrolledCourses.jsx` - Show completion percentage
- `ViewLectures.jsx` - Add "Mark Complete" and quiz buttons

---

## Verification Plan

### Manual Testing

**Test 1: Quiz Flow (Educator)**
1. Login as an educator
2. Navigate to a course → Create Quiz
3. Add 3 questions with options and correct answers
4. Click "Generate with AI" to test AI quiz generation
5. Save the quiz
6. Verify the quiz appears in the course

**Test 2: Quiz Flow (Student)**
1. Login as a student enrolled in the course
2. Navigate to the course with the quiz
3. Take the quiz, answer all questions
4. Submit and verify the score is calculated correctly
5. Check that the score is saved in progress

**Test 3: Assignment Flow**
1. Educator creates an assignment with a deadline
2. Student submits text + file
3. Educator views submission and clicks "AI Feedback"
4. Verify AI feedback is generated
5. Educator manually grades and saves

**Test 4: Progress Tracking**
1. Student watches a lecture and clicks "Mark Complete"
2. Navigate to My Courses → Verify progress bar updates
3. Complete all lectures → Verify 100% completion

---

## Implementation Order

| Priority | Phase | Estimated Effort |
|----------|-------|-----------------|
| 1 | Progress Tracking (Backend + Frontend) | ~2 hours |
| 2 | Quiz System (Backend + Frontend) | ~4 hours |
| 3 | Assignment System (Backend + Frontend) | ~4 hours |
| 4 | AI Features (Quiz Gen + Grading) | ~2 hours |

---

## Questions for You

1. Do you want **time limits** on quizzes?
2. Should students be able to **retake quizzes** or is it one attempt only?
3. For assignments, do you need **file uploads** or is text-only sufficient?
4. Should progress be **reset** if a student unenrolls and re-enrolls?
