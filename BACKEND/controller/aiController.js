import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Quiz from "../model/quizModel.js";
import Submission from "../model/submissionModel.js";
import Assignment from "../model/assignmentModel.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";
import { createNotification } from "./notificationController.js";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// AI Quiz Generator
export const generateQuiz = async (req, res) => {
    try {
        const { 
            courseId, 
            lectureId, 
            lectureContent, 
            numQuestions = 5, 
            difficulty = "medium",
            questionTypes = ["multiple-choice", "true-false"]
        } = req.body;

        if (!courseId || !lectureContent) {
            return res.status(400).json({ 
                message: "Course ID and lecture content are required" 
            });
        }

        // Verify course ownership
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }


        
        if (creatorId !== req.userId) {
            return res.status(403).json({ 
                message: "You are not authorized to generate quiz for this course" 
            });
        }

        // Get lecture title if lectureId provided
        let lectureTitle = "";
        if (lectureId) {
            const lecture = await Lecture.findById(lectureId);
            lectureTitle = lecture ? lecture.lectureTitle : "";
        }

        // Construct AI prompt
        const prompt = `You are an expert educational content creator. Generate a comprehensive quiz based on the following lecture content.

LECTURE CONTENT:
${lectureContent}

REQUIREMENTS:
- Generate exactly ${numQuestions} questions
- Difficulty level: ${difficulty}
- Question types: ${questionTypes.join(", ")}
- Each question should test understanding of key concepts
- For multiple-choice questions, provide 4 options with only 1 correct answer
- For true-false questions, provide exactly 2 options (True/False)
- Include brief explanations for correct answers
- Assign points based on difficulty (1-3 points per question)

OUTPUT FORMAT (MUST BE VALID JSON):
{
  "quizTitle": "Brief descriptive title for the quiz",
  "description": "Short description of what this quiz covers",
  "questions": [
    {
      "questionText": "The question text here?",
      "questionType": "multiple-choice" or "true-false",
      "options": [
        { "text": "Option text", "isCorrect": true/false }
      ],
      "points": 1-3,
      "explanation": "Why this answer is correct"
    }
  ]
}

Generate the quiz now. Respond ONLY with valid JSON, no additional text.`;



        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let quizData;
        try {
            // Extract JSON from response
            let responseText = response.text.trim();
            
            // Remove markdown code blocks if present
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            
            quizData = JSON.parse(responseText);
        } catch (parseError) {
            return res.status(500).json({ 
                message: "Failed to parse AI-generated quiz. Please try again.",
                debug: response.text 
            });
        }

        // Create quiz in database
        const quiz = await Quiz.create({
            title: quizData.quizTitle || "AI Generated Quiz",
            description: quizData.description || "Generated from lecture content",
            course: courseId,
            lecture: lectureId,
            questions: quizData.questions,
            duration: Math.max(numQuestions * 2, 10), // 2 min per question, min 10
            passingScore: 60,
            attempts: 3,
            creator: req.userId,
            isActive: true
        });

        // Notify enrolled students
        const enrolledStudents = course.enrolledStudents || [];
        for (const studentId of enrolledStudents) {
            await createNotification(
                studentId,
                req.userId,
                "quiz_created",
                `An AI-generated quiz "${quiz.title}" has been added to "${course.title}".`,
                courseId
            );
        }

        return res.status(201).json({
            message: "Quiz generated successfully by AI",
            quiz,
            generatedBy: "AI"
        });

    } catch (error) {
        return res.status(500).json({ 
            message: `Failed to generate quiz: ${error.message}` 
        });
    }
};

// AI Assignment Grader
export const aiGradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId)
            .populate("assignment")
            .populate("student", "name email");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const assignment = submission.assignment;

        // Check authorization - only course creator can use AI grading
        const course = await Course.findById(assignment.course);
        const creatorId = course?.creator._id ? course.creator._id.toString() : course?.creator.toString();
        if (!course || creatorId !== req.userId) {
            return res.status(403).json({ 
                message: "You are not authorized to grade this submission" 
            });
        }

        if (!submission.submissionText || submission.submissionText.trim().length === 0) {
            return res.status(400).json({ 
                message: "AI grading requires text submission. This submission only has files." 
            });
        }

        // Construct AI grading prompt
        const prompt = `You are an expert educational grader. Grade the following student assignment submission.

ASSIGNMENT DETAILS:
Title: ${assignment.title}
Description: ${assignment.description}
Instructions: ${assignment.instructions || "None provided"}
Maximum Points: ${assignment.maxPoints}

STUDENT SUBMISSION:
${submission.submissionText}

GRADING REQUIREMENTS:
- Analyze the submission for clarity, completeness, accuracy, and effort
- Assign a grade from 0 to ${assignment.maxPoints}
- Provide detailed, constructive feedback (3-5 sentences)
- Highlight specific strengths
- Provide specific areas for improvement
- Be fair and encouraging

OUTPUT FORMAT (MUST BE VALID JSON):
{
  "suggestedGrade": number (0-${assignment.maxPoints}),
  "feedback": "Detailed feedback here",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

Respond ONLY with valid JSON, no additional text.`;



        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let gradingData;
        try {
            let responseText = response.text.trim();
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            gradingData = JSON.parse(responseText);
        } catch (parseError) {
            return res.status(500).json({ 
                message: "Failed to parse AI grading. Please try again." 
            });
        }

        // Format AI feedback
        const aiFeedback = `AI-Generated Feedback:\n\n${gradingData.feedback}\n\n` +
                          `Strengths:\n${gradingData.strengths.map(s => `• ${s}`).join('\n')}\n\n` +
                          `Areas for Improvement:\n${gradingData.improvements.map(i => `• ${i}`).join('\n')}`;

        // Update submission with AI feedback (don't auto-grade)
        submission.aiGeneratedFeedback = aiFeedback;
        await submission.save();

        return res.status(200).json({
            message: "AI feedback generated successfully",
            suggestedGrade: gradingData.suggestedGrade,
            aiFeedback,
            note: "This is a suggested grade. Please review and finalize using the grade submission endpoint."
        });

    } catch (error) {
        return res.status(500).json({ 
            message: `Failed to generate AI feedback: ${error.message}` 
        });
    }
};

// AI Study Assistant
export const studyAssistant = async (req, res) => {
    try {
        const { 
            courseId, 
            lectureId, 
            question, 
            conversationHistory = [] 
        } = req.body;

        if (!courseId || !question) {
            return res.status(400).json({ 
                message: "Course ID and question are required" 
            });
        }

        // Get course details
        const course = await Course.findById(courseId)
            .populate("lectures");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user is enrolled or is the creator
        const isEnrolled = course.enrolledStudents.some(
            studentId => studentId.toString() === req.userId
        );
        const creatorId = course.creator._id ? course.creator._id.toString() : course.creator.toString();
        const isCreator = creatorId === req.userId;

        if (!isEnrolled && !isCreator) {
            return res.status(403).json({ 
                message: "You must be enrolled in this course to use the study assistant" 
            });
        }

        // Get specific lecture if provided
        let lectureContext = "";
        if (lectureId) {
            const lecture = await Lecture.findById(lectureId);
            if (lecture) {
                lectureContext = `Current Lecture: ${lecture.lectureTitle}\n`;
            }
        }

        // Build context from course
        const courseContext = `Course: ${course.title}\n` +
                            `Description: ${course.description || "No description"}\n` +
                            `Category: ${course.category}\n` +
                            `Level: ${course.level}\n` +
                            lectureContext;

        // System instruction
        const systemInstruction = `You are an expert AI Study Assistant for the "${course.title}" course. 
Your role is to help students understand concepts, answer questions, and guide their learning.

CONTEXT:
${courseContext}

GUIDELINES:
- Provide clear, educational responses
- Use examples when helpful
- Encourage critical thinking
- Keep answers concise (under 200 words unless detail is needed)
- If asked about topics outside the course, gently redirect to course content
- Be patient and supportive
- Reference course materials when relevant

Student Question: ${question}`;

        // Build conversation with history
        const contents = [
            {
                role: "user",
                parts: [{ text: systemInstruction }]
            },
            ...conversationHistory.map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            }))
        ];



        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                ...conversationHistory.map(msg => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }]
                })),
                { role: "user", parts: [{ text: question }] }
            ]
        });

        const answer = response.text;

        return res.status(200).json({
            question,
            answer,
            courseTitle: course.title,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return res.status(500).json({ 
            message: `Failed to get study assistant response: ${error.message}` 
        });
    }
};

// Get AI-powered course insights (bonus feature)
export const getCourseInsights = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate("lectures")
            .populate("reviews");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check authorization
        const creatorId = course.creator._id ? course.creator._id.toString() : course.creator.toString();
        if (creatorId !== req.userId) {
            return res.status(403).json({ 
                message: "Only course creators can view AI insights" 
            });
        }

        // Gather course data
        const quizzes = await Quiz.find({ course: courseId });
        const assignments = await Assignment.find({ course: courseId });

        const courseData = `
Course: ${course.title}
Description: ${course.description}
Category: ${course.category}
Level: ${course.level}
Enrolled Students: ${course.enrolledStudents?.length || 0}
Total Lectures: ${course.lectures?.length || 0}
Total Quizzes: ${quizzes.length}
Total Assignments: ${assignments.length}
Average Rating: ${course.reviews?.length > 0 ? "Available" : "No reviews yet"}
        `;

        const prompt = `You are an educational analytics expert. Analyze the following course data and provide insights.

${courseData}

Provide:
1. Overall course health assessment (1-2 sentences)
2. Strengths (2-3 points)
3. Suggestions for improvement (2-3 points)
4. Recommended next steps (2-3 points)

Format as JSON:
{
  "healthScore": 1-10,
  "assessment": "text",
  "strengths": ["point 1", "point 2"],
  "improvements": ["suggestion 1", "suggestion 2"],
  "nextSteps": ["step 1", "step 2"]
}

Respond ONLY with valid JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let insights;
        try {
            let responseText = response.text.trim();
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            insights = JSON.parse(responseText);
        } catch (parseError) {
            return res.status(500).json({ 
                message: "Failed to parse AI insights" 
            });
        }

        return res.status(200).json({
            courseId,
            courseTitle: course.title,
            insights,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        return res.status(500).json({ 
            message: `Failed to generate insights: ${error.message}` 
        });
    }
};
