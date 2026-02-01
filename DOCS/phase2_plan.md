# Phase 2 Implementation Plan - AI Features

## Overview
Implement AI-powered features using OpenAI/Google AI for quiz generation, assignment grading, and study assistance.

---

## Prerequisites
- ✅ Phase 1 Complete (Backend Models & Routes)
- 🔑 OpenAI API Key or Google AI API Key
- 📦 Install required packages: `openai` or `@google/generative-ai`

---

## Tasks

### 1. AI Quiz Generator
**Endpoint**: `POST /api/quiz/generate`

**Functionality**:
- Input: Lecture content (videoUrl transcript or text)
- Output: Generated quiz with multiple questions
- Question types: MCQ, True/False, Short Answer
- Configurable number of questions and difficulty

**Implementation Steps**:
1. Create `aiController.js` with `generateQuiz` function
2. Add route in `quizRoute.js`
3. Use AI API to analyze lecture content
4. Parse AI response into quiz format
5. Save generated quiz to database

**Prompt Template**:
```
Generate a quiz with {numQuestions} questions based on the following lecture content:

{lectureContent}

Create questions of type: {questionTypes}
Difficulty level: {difficulty}

Format the response as JSON with:
- questionText
- questionType (multiple-choice, true-false, short-answer)
- options (for MCQ/T-F)
- correctAnswer
- explanation
- points
```

---

### 2. AI Assignment Grader
**Endpoint**: `POST /api/assignment/submission/:submissionId/ai-grade`

**Functionality**:
- Input: Student submission text, assignment description
- Output: AI-generated feedback and suggested grade
- Educator can review and modify before finalizing

**Implementation Steps**:
1. Add `aiGradeSubmission` function in `submissionController.js`
2. Add route in `assignmentRoute.js`
3. Send submission + rubric to AI
4. Store AI feedback in `aiGeneratedFeedback` field
5. Educator reviews and finalizes grade

**Prompt Template**:
```
You are an educational AI grading assistant. Grade the following student submission:

Assignment: {assignmentTitle}
Description: {assignmentDescription}
Max Points: {maxPoints}

Student Submission:
{submissionText}

Provide:
1. Suggested grade (0-{maxPoints})
2. Detailed feedback highlighting strengths and areas for improvement
3. Specific suggestions for enhancement

Format as JSON with: { grade, feedback, suggestions }
```

---

### 3. AI Study Assistant
**Endpoint**: `POST /api/ai/study-assistant`

**Functionality**:
- Chatbot that answers student questions about course content
- Context-aware (knows course and lecture content)
- Helps explain concepts

**Implementation Steps**:
1. Create `studyAssistantController.js`
2. Add route in existing `searchRoute.js` or new `aiRoute.js`
3. Maintain conversation context
4. Retrieve relevant lecture content
5. Generate helpful responses

**Prompt Template**:
```
You are a helpful study assistant for a course on {courseTitle}.

Course Description: {courseDescription}
Current Lecture: {lectureTitle}
Lecture Content: {lectureContent}

Student Question: {studentQuestion}

Provide a clear, educational response that:
1. Directly answers the question
2. References course material
3. Includes examples if helpful
4. Encourages further learning

Keep responses concise (under 200 words) unless complexity requires more detail.
```

---

## Implementation Code Snippets

### Install Dependencies
```bash
npm install openai
# OR
npm install @google/generative-ai
```

### Environment Variables (.env)
```
OPENAI_API_KEY=sk-...
# OR
GOOGLE_AI_API_KEY=...
```

### Sample AI Controller Structure
```javascript
import OpenAI from 'openai'; // or Google AI

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateQuiz = async (req, res) => {
  try {
    const { lectureContent, numQuestions, difficulty } = req.body;
    
    const prompt = `Generate a quiz with ${numQuestions} questions...`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const generatedQuiz = JSON.parse(completion.choices[0].message.content);
    
    // Create quiz in database
    const quiz = await Quiz.create({
      ...generatedQuiz,
      creator: req.userId,
      // ... other fields
    });
    
    return res.status(201).json({ quiz });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
```

---

## Testing Checklist

- [ ] AI Quiz Generator creates valid quiz format
- [ ] Generated questions are relevant to lecture content
- [ ] AI grader provides constructive feedback
- [ ] Study assistant answers accurately
- [ ] Error handling for AI API failures
- [ ] Rate limiting to prevent API abuse
- [ ] Cost monitoring for AI API usage

---

## Security Considerations

1. **API Key Protection**: Never expose in client-side code
2. **Rate Limiting**: Limit AI requests per user per day
3. **Content Filtering**: Validate AI responses before storing
4. **Cost Management**: Set usage quotas
5. **Educator Review**: AI grades are suggestions, not final

---

## Estimated Time
- Setup & Configuration: 30 minutes
- Quiz Generator: 2-3 hours
- Assignment Grader: 2-3 hours
- Study Assistant: 2-3 hours
- Testing: 1-2 hours

**Total**: 8-12 hours

---

## Data Flow Diagrams

### Quiz Generation Flow
```
Educator clicks "Generate Quiz" 
  → Frontend sends lecture content
    → Backend calls AI API
      → AI analyzes content
        → Backend formats response
          → Quiz saved to database
            → Students can take quiz
```

### Assignment Grading Flow
```
Student submits assignment
  → Educator clicks "Get AI Feedback"
    → Backend sends to AI
      → AI generates feedback
        → Stored in aiGeneratedFeedback field
          → Educator reviews
            → Educator adjusts grade/feedback
              → Final grade saved
```

---

## Next Up: Phase 3 - Frontend Quiz System

Once AI features are complete, we'll build the UI for:
- Quiz creation form with AI generation button
- Quiz-taking interface with timer
- Results display with explanations
- Progress tracking visualization

---

**Ready to start Phase 2?** Let me know and we'll implement the AI features!
