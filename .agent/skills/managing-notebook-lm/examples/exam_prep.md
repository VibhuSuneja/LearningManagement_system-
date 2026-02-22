# Exam Preparation Workflow Example

If a user asks to "Teach me X for my exam tomorrow":

1. **Initialize**: `notebook_create(title="X Exam Prep")`
2. **Research**: `research_start(query="Core concepts of X for exam", mode="fast")`
3. **Wait & Import**: `research_status` -> `research_import`
4. **Summarize**: `report_create(report_format="Study Guide")`
5. **Interactive Learning**:
   - `flashcards_create()` for memorization.
   - `quiz_create()` for self-testing.
   - `audio_overview_create()` for passive listening.
