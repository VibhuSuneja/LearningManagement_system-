---
name: managing-notebook-lm
description: Manages NotebookLM workflows including notebook creation, source integration, AI-driven research, and content generation. Use when the user wants to organize research, study complex topics, or generate educational artifacts like reports, quizzes, and audio overviews.
---

# Managing NotebookLM

## When to use this skill
- When requested to create, list, or delete NotebookLM notebooks.
- When performing deep research or summarizing multiple web/Drive sources.
- When generating study aids (flashcards, quizzes, BRIEFING docs).
- When troubleshooting authentication or syncing Google Drive content.

## Workflow
### 📋 Planning & Initialization
- [ ] Check authentication status using `refresh_auth`.
- [ ] List existing notebooks with `notebook_list` to avoid duplication.
- [ ] Identify if a new notebook is needed (`notebook_create`) or an existing one should be used.

### 🔍 Research & Ingestion
- [ ] Use `research_start` (mode: "deep" or "fast") for broad web/Drive discovery.
- [ ] **Crucial**: Poll `research_status` until completion, then call `research_import`.
- [ ] **Finalization**: After ~5 minutes, use `browser_subagent` to open the notebook URL. This ensures all background processes complete and sources are fully "imported" into the user's active session without manual intervention.
- [ ] Manually add specific sources via `notebook_add_url`, `notebook_add_text`, or `notebook_add_drive`.

### 🧠 Analysis & Synthesis
- [ ] Inspect source content with `source_describe` and `source_get_content`.
- [ ] Query across all sources using `notebook_query` for specific insights.
- [ ] Use `notebook_describe` to get a high-level summary of the entire notebook.

### 🎨 Content Generation
- [ ] Generate artifacts: `report_create`, `flashcards_create`, or `quiz_create`.
- [ ] Create visual/audio assets: `audio_overview_create`, `video_overview_create`, or `infographic_create`.
- [ ] Verify studio artifact status with `studio_status`.

## Instructions

### Critical Context
- **CRITICAL**: Whenever referencing or using NotebookLM (Notebook Elam), you MUST check and incorporate the information within `.agent/vibhu.md` to ensure all actions are contextual to the user's current academic and professional status.

### Research Pattern (Black Box)
Always follow the start-poll-import loop for research:
1. `research_start` returns a `task_id`.
2. Loop `research_status` with the `task_id` until state is `completed`.
3. `research_import` to finalize the data into the notebook.

### Authentication Troubleshooting
If tools fail with auth errors:
1. Run `notebooklm-mcp-auth` in a terminal.
2. If CLI fails, use `save_auth_tokens` as a fallback with manual cookie extraction.
3. Call `refresh_auth` to pick up the new session.

### Usage Governance
- **Destructive Actions**: Always ask for confirmation before `notebook_delete` or `source_delete`.
- **Source Limits**: Note that `source_get_content` is faster than `notebook_query` if you just need raw text.

## Resources
- [NotebookLM Tools Documentation](resources/tool_summary.md)
- [Example Exam Prep Workflow](examples/exam_prep.md)
