---
Task ID: 1
Agent: Main Agent
Task: Student Dashboard Overview - Display real project info and progress

Work Log:
- Rewrote the overview tab in StudentDashboard to show comprehensive project details
- Added progress bar with percentage (calculated from current step / 5 steps)
- Added project header card with field badge, status badge, and project name
- Added project information section (description, problem, target audience, added value)
- Added financial information section (funding, stage, partner, team size, legal framework, trade name)
- Added evaluation section with score bar visualization and admin notes
- Added timeline section with visual timeline connector dots
- Added status badge in the header bar next to the student name
- Added rejected state handling with alert message

Stage Summary:
- Student dashboard overview now shows all project data that was filled during registration
- Shows admin-managed evaluation score and notes
- Shows full project timeline with visual indicators
- Progress bar shows percentage based on current step

---
Task ID: 2
Agent: Main Agent
Task: Student Settings - Add settings button with profile editing and save

Work Log:
- Added StudentProfile interface to store.ts with name, email, phone, faculty, level, password
- Added studentProfiles state and setStudentProfile action to Zustand store
- Added persistence for studentProfiles in localStorage
- Added settings tab to student dashboard sidebar
- Created settings page with 3 sections: email change, password change, profile edit
- Implemented handleSaveProfile that saves to store and updates user state
- Implemented handleChangePassword with current password verification and confirmation
- Added new i18n translation keys for settings in all 3 languages (ar/en/fr)
- Profile page also enhanced with avatar and project status badge

Stage Summary:
- Settings tab added with full email change, password change, and profile editing
- All changes are persisted to localStorage via Zustand persist
- Password validation includes current password check, confirmation match, and minimum length
- Profile edits update both the store and the global user state

---
Task ID: 3
Agent: Main Agent
Task: BMC Tool - Download and embed BMC-TOOL from GitHub

Work Log:
- Cloned https://github.com/bmc-1275/BMC-TOOL from GitHub
- Copied index.html and incubator-logo.jpeg to /public/bmc-tool/
- BMC tool is a single-page vanilla HTML/CSS/JS app (~160KB)
- Replaced simple BMC link with full iframe embed in student dashboard
- Added BMC canvas quick edit (existing BMCTool component) above the iframe
- Added "Open Full Financial Study Tool" external link button
- Renamed tab from "نموذج الأعمال BMC" to "دراسة المشروع" (Project Study)
- Added new i18n keys: openBmcTool, bmcToolDesc in all 3 languages
- iframe configured with sandbox permissions for scripts, forms, popups
- Iframe height set to 900px for full tool visibility

Stage Summary:
- BMC-TOOL from GitHub is fully embedded in the student dashboard
- The tool includes 8-section financial generator per Ministerial Decision 1275
- Students can use both the quick BMC canvas and the full financial tool
- External link also available to open tool in new tab
