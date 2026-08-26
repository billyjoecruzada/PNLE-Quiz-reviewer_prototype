# OpenCode / Muse Spark 1.2 Build Directive: PNLE Practice Exam Web Application

## 🎯 System Objective
You are an expert full-stack developer specializing in Next.js (App Router), React, TypeScript, and Tailwind CSS.
Build a modern, accessible, highly responsive, non-authenticated online quiz web application tailored for nursing students reviewing for the Philippine Nursing Licensure Examination (PNLE).

---

## 🛠️ Tech Stack & Requirements
* **Framework:** Next.js (App Router, Client Components where stateful)
* **Language:** TypeScript (`strict: true`)
* **Styling:** Tailwind CSS (Ice-cube minimalist aesthetic)
* **Icons:** `lucide-react`
* **State Management:** React `useState` / `useReducer` or `Zustand`
* **Contact & Support Integration:** `billyjoecruzada12@gmail.com`

---

## 🎨 Design Theme & Aesthetic System
* **Background Color:** Ice-cube light gray (`bg-slate-100` / `#F0F4F8`)
* **Primary Accent Color:** Emerald Green (`bg-emerald-600`, `hover:bg-emerald-700`, `text-emerald-600`)
* **Wrong / Error State:** Rose Red (`bg-rose-500`, `text-rose-600`, `border-rose-400`)
* **Unanswered Grid Badge:** Gray (`bg-slate-300`, `text-slate-700`)
* **Not Yet Visited Grid Badge:** Outline Gray (`border-2 border-slate-300 text-slate-500 bg-white`)
* **Typography:** Clean sans-serif (Inter/Geist)

---

## 📱 Page Specifications & Application Workflow

### Screen 1: Welcome / Main Screen
1. **Background:** Ice-cube light gray (`#f0f4f8`).
2. **Center Section:**
   * Prominent Green **"Start Quiz"** Button (`bg-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-emerald-700 transition-all hover:scale-105`).
3. **Dynamic Phrase / Trivia Banner:**
   * Rotates every session or refresh from a list of 25–30 nursing trivias and motivational call-to-actions.
   * *Example Phrases & Trivias:*
     1. "Ready to take a quiz?"
     2. "Ready to learn something new?"
     3. "Did you know? The left lung has two lobes while the right lung has three!"
     4. "Did you know? Kawasaki disease primarily causes inflammation in coronary arteries."
     5. "Did you know? Oxytocin released during breastfeeding aids uterine involution."
     6. "Ready to master the PNLE today?"
     7. "Did you know? Pursed-lip breathing generates positive end-expiratory pressure to prevent alveolar collapse."
     8. "Did you know? Normal infant birth weight typically doubles by 6 months of age!"
     9. "Did you know? Non-rebreather masks can deliver up to 100% FiO2 when properly fitted."
     10. "Did you know? The ulnar artery patency is evaluated using Allen's test before radial ABG collection."
     11. "Did you know? Erikson identifies 'Autonomy vs. Shame & Doubt' as the toddler's core developmental stage."
     12. "Did you know? High Fowler's positioning reduces venous return and decreases cardiac workload."
     13. "Did you know? Chelation therapy with CaNa2EDTA carries a key risk of nephrotoxicity."
     14. "Did you know? Early signs of compartment syndrome after cast placement include paresthesia."
     15. "Did you know? Isoniazid (INH) therapy requires routine liver function enzyme monitoring."
     16. "Did you know? Vector control by covering water receptacles is vital for Dengue prevention."
     17. "Did you know? Single-ingredient iron-fortified cereal should be an infant's first solid food."
     18. "Did you know? Z-track intramuscular injections minimize subcutaneous tissue irritation."
     19. "Did you know? The working phase of a therapeutic relationship focuses on exploring behaviors."
     20. "Did you know? Involuntary psychiatric admission focuses primarily on protecting self and others."
     21. "Did you know? Active logrolling is the preferred turning technique following spinal fusion."
     22. "Did you know? Abdominal thrusts are the initial priority for a choking toddler."
     23. "Did you know? Postpartum hemorrhage requires immediate fundal massage."
     24. "Did you know? Shortening of the affected limb indicates developmental hip dysplasia."
     25. "Ready to turn your nursing dreams into reality?"

---

### Screen 2: Topic Selection & Exam Configuration
Opened after toggling "Start Quiz".

1. **Topic Selection Checklist:**
   * Topics available:
     * `ALL`
     * `Medical-Surgical Nursing`
     * `Pediatric Nursing`
     * `Maternal and Child Health`
     * `Fundamentals of Nursing`
     * `Psychiatric Nursing`
     * `Community Health Nursing`
   * Checkbox/card UI allowing single or multiple selection.
2. **Item Count Selection:**
   * Options: `15`, `25`, `50`, `75`, `100`, and a `Custom` numeric input field.
3. **Dynamic Validation Rules:**
   * Target Items > 15 ➔ Requires **at least 2 topics**.
   * Target Items > 50 ➔ Requires **at least 3 topics**.
   * Target Items > 75 ➔ Requires **at least 4 topics**.
   * *Proceed Button State:* Grayed out (`bg-gray-300 cursor-not-allowed`) if no topics selected or if validation criteria are unmet.
4. **Warning Banner Prompt:**
   * Show a warning message when selecting higher question counts with few topics:
     * *"WARNING: More than [X] questions are chosen. Please select more topics to avoid repetitive questions."*

---

### Screen 3: Interactive Quiz UI
1. **Header Navigation Grid (Question Palette):**
   * Displays numbered badges (`1`, `2`, `3`, ... `N`).
   * Color Coding:
     * **Green (`bg-emerald-500 text-white`):** Answered & Correct (or Submitted).
     * **Red (`bg-rose-500 text-white`):** Answered & Incorrect (or Submitted).
     * **Gray (`bg-slate-400 text-white`):** Visited / Unanswered.
     * **White / Outline (`border-slate-300 text-slate-600`):** Not yet opened.
2. **Randomization Engine:**
   * Implement a randomized ordering algorithm while keeping related topics closely grouped to preserve context during study.
3. **Question Card Component:**
   * Question text in bold, clear typography.
   * Multiple Choice options rendered as selectable radio-card buttons.
4. **Action Buttons:**
   * **"Submit Answer":** Locks the selection. Evaluates response and renders the **Rationale Box** beneath the options.
   * **"Next Question":** Proceeds to the next question or skips the current one.
5. **Rationale Text Box (Appears post-submission):**
   * Stylized box displaying:
     * Correct/Wrong badge indicator.
     * **Brief, correct, factual rationale** explaining why the bolded option is correct.

---

### Screen 4: Results & Performance Dashboard
Appears automatically upon completing all selected questions or clicking "Finish Exam".

1. **Overall Score Summary:**
   * Percentage badge, total correct answers count, total questions taken.
2. **Topic-by-Topic Breakdown Table/Card:**
   * Displays breakdown per selected topic (e.g., *Medical-Surgical: 8/10*, *Pediatric Nursing: 4/5*).
3. **Actions:**
   * "Retake Quiz" button.
   * "Choose New Topics" button.
4. **Footer / Support Contact:**
   * Prominently display: *"Found a bug or have suggestions? Contact us at: **billyjoecruzada12@gmail.com**"*

---

## 📂 Expected Data Structure (`types/quiz.ts`)

```typescript
export interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  rationale: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
}

export type QuizState = 'START' | 'CONFIG' | 'QUIZ' | 'RESULTS';