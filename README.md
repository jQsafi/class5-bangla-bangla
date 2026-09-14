# Class 5 Bangla Pathshala

পঞ্চম শ্রেণি বাংলা পাঠশালা (Class 5 Bangla Pathshala) is an interactive, AI-powered learning platform designed for 5th-grade students in Bangladesh. It strictly follows the NCTB curriculum and the Primary Education Completion Examination (PECE) format.

## Features

- **Comprehensive Chapters**: Read all chapters from the Class 5 NCTB Bangla textbook.
- **AI Tutor (বাংলা বন্ধু)**: Ask questions in plain Bangla and get step-by-step explanations, character analyses, and more.
- **Practice Lab**: Automatically generates multiple-choice questions (MCQs), fill in the blanks, and creative writing exercises.
- **Model Test Generator**: Automatically generates a 100-mark PECE standard model test spanning multiple selected chapters, including both Seen and Unseen comprehensions.
- **Grammar Guide**: A built-in grammar reference sheet tailored for 5th graders.

## Technologies Used

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** (with Typography plugin for Markdown rendering)
- **Lucide React** (Icons)
- **Groq API** (Llama 3 / Qwen / GPT-OSS based AI logic)
- **React Markdown & Rehype Raw** (For rendering complex AI-generated HTML/Markdown)

## Setup & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/jQsafi/class5-bangla-bangla.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your Groq API key:
   The app stores the Groq API key locally in the browser to make requests. It uses a default demo key, but you can change it via the UI or by setting the `class5_bangla_groq_api_key` in `localStorage`.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

Deployed to GitHub Pages.
