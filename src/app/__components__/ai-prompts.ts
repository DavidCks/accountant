export class Prompts {
  static jobTitle = `You are writing the job title that appears under the candidate’s name.

  Goal: Output a compact, market-standard title that exactly matches the role being applied for, with an optional sharp specialization drawn from the JD and resume.

  Do silently:
  1) Normalize the JD’s role name to the most common ATS-friendly title.
  2) Set seniority (Junior/Mid/Senior/Lead/Principal) only if the JD requires it or the resume clearly supports it (scope, years, leadership).
  3) Optionally add ONE precise specialization (domain, platform, or stack) if it improves alignment (e.g., “Data Analyst — Marketing” → “Marketing Data Analyst”).
  4) Exclude company/internal jargon and inflated language.

  Constraints:
  - 2–3 words. Title Case.
  - No company names, certifications, or degrees.
  - No punctuation, slashes, emojis, or quotes.
  - No “Seeking”/“Aspiring”; this is the target role title.

  Output:
  Return ONLY the job title text as paintext, nothing else.`;

  static tagline = `You are writing a resume tagline that appears in bold under the candidate’s name and job title.

  Goal: Create a four-word (or fewer) tagline that makes the candidate irresistible for THIS job.

  Do silently:
  1) Identify the top 1–2 hiring priorities in the JD.
  2) Extract the candidate’s strongest, role-relevant differentiator (skill, domain, or outcome).
  3) Combine them into a clear, specific, benefit-oriented phrase.

  Constraints:
  - Max 4 words. Title Case.
  - No punctuation, emojis, or quotes.
  - Avoid clichés (“Results Driven”, “Team Player”).
  - Prefer concrete skills or outcomes aligned to the JD.

  Output:
  Return ONLY the tagline text as paintext, nothing else.`;

  static subtagline = `You are writing a sub-tagline that appears directly after the bold 4-word tagline under the candidate’s name and title.

  Goal: Craft one crisp line that expands the tagline with concrete proof aligned to THIS job.

  Do silently:
  1) Identify the top 1–2 hiring priorities and desired outcomes in the JD.
  2) Find a matching, quantifiable achievement in the resume.
  3) Select 1–2 role-specific keywords/tools from the JD (stack, domain, methods).
  4) Combine them into a concise, benefit-led phrase.

  Constraints:
  - 2–5 words.
  - Include ≥1 number (%, $, #, timeframe).
  - Include 1–2 JD keywords/tools.
  - Sentence case (capitalize proper nouns only).
  - No first-person (I, my), no clichés (“results-driven”), no emojis/quotes.
  - No trailing period.

  Output:
  Return ONLY the sub-tagline text as paintext, nothing else.`;

  static about = `Write the resume’s About (professional summary).

  Goal
  - 80–100 words that make the candidate the obvious hire for THIS JD.

  Do silently
  1) From the JD: extract role, 2–3 success criteria/KPIs, must-have tools/keywords.
  2) From the RESUME: pick 2–3 achievements that PROVE those criteria with real metrics/scope.
  3) Map achievements to JD outcomes; include 3–5 JD keywords and ≤2 tools actually used.

  Style
  - One paragraph, 3–5 sentences, sentence case.
  - Do NOT include a title
  - Active voice; avoid “is/are/was/were” where possible.
  - No third person (“the candidate/applicant”). First-person pronouns are allowed but optional; prefer agentless active voice (“Builds…, Delivers…”).
  - Include ≥2 numbers (#, %, $, scale, timeframe) that exist in the RESUME.
  - Ban these phrases: adept at, proven ability, demonstrated ability, experienced in, results-driven, passionate, track record, aligns with.
  - Limit tools to max 2; no tool lists; no repeated tool names.
  - NEVER PUT A TITLE!!

  Structure
  1) Positioning: role + one differentiator tied to JD.
  2) Evidence: 2–3 achievement sentences with metrics/scope and (if helpful) a tool/domain each.
  3) Close: link capabilities to JD KPIs (e.g., adoption, velocity, reliability, accessibility).

  Output
  Return ONLY the single-paragraph text as plain text. If any banned phrase appears or tools >2, revise before output.`;

  static workExperienceDetails = `You are writing ONE resume bullet for a specific work experience.

  Goal: Produce a crisp, JD-aligned achievement line of 5–7 words.

  Do silently:
  1) Extract the most JD-relevant achievement from the work entry.
  2) Pull 1 quantifiable outcome (%, $, #, time) and 1–2 JD keywords/tools.
  3) Choose tense: present for current role, past for former roles.

  Constraints:
  - Do NOT state expertise that is not mentioned in the work experience details
  - 5–7 words, single sentence
  - Start with a strong verb; no “Responsible for”
  - Include ≥1 metric and 1 JD keyword/tool
  - Active voice; ATS-friendly
  - No first person, clichés, emojis, or acronyms without expansion
  - No trailing period

  Output:
  Return ONLY the bullet text in plaintext, nothing else.`;

  static projectDetails = `You are writing ONE resume bullet for a specific project.

  Goal: Produce a crisp, JD-aligned achievement line of 5–7 words.

  Do silently:
  1) Extract the most JD-relevant achievement from the project entry.
  2) Pull 1 quantifiable outcome (%, $, #, time) and 1–2 JD keywords/tools.
  3) Choose tense: present for current role, past for former roles.

  Constraints:
  - Do NOT state expertise that is not mentioned in the project details
  - 5–7 words, single sentence
  - Start with a strong verb; no “Responsible for”
  - Include ≥1 metric and 1 JD keyword/tool
  - Active voice; ATS-friendly
  - No first person, clichés, emojis, or acronyms without expansion
  - No trailing period

  Output:
  Return ONLY the bullet text in plaintext, nothing else.`;

  static coverLetter = `You are writing ONE tailored cover letter using the provided resume and job description.

  Goal: Produce a concise, JD-aligned cover letter that makes it obvious why the candidate is a fit.

  Do silently:
  1) Extract 3–5 core requirements and 3–5 exact keywords/tools from the JD (e.g., React, FastAPI, RAG).
  2) From the resume, select 2–3 most relevant achievements with concrete metrics (%/$/#/time) that map to those requirements.
  3) Draft 4 short paragraphs:
     • Hook: align the candidate’s focus to the company’s mission/problem space and role scope.
     • Fit: summarize relevant skills/stack using JD keywords naturally.
     • Proof: 2 quantified examples demonstrating impact that matches the JD.
     • Close: specific value the candidate will deliver in the first 30–90 days + availability and polite CTA.
  4) If a required skill is not in the resume, address it as fast ramp-up—not as prior expertise.

  Constraints:
  - 50–100 words, plaintext only
  - Salutation: “Dear {{company}} Hiring Team,” (fallback “Dear Hiring Team,” if company unknown)
  - First person singular; confident, concise, active voice
  - Include ≥5 exact JD keywords/tools and ≥2 metrics
  - ATS-friendly; avoid fluff, clichés, emojis, and exaggerated claims
  - Do NOT invent employers, titles, or skills not present in the resume
  - No salary expectations; no generic company boilerplate

  Output:
  Return ONLY the final cover letter text in plaintext, ending with a sign-off:
  “Best regards,
  {{candidate_name}}”`;

  static projectRelevance = `You are sorting the candidate PROJECTS by relevance to the JOB DESCRIPTION (JD).

  Goal:
  Return a comma-separated list of PROJECT TITLES, ordered from most to least relevant to the JD.

  Do silently:
  1) Extract JD signals:
     - Must-have technologies & tools
     - Preferred technologies
     - Domain/industry & problem space
     - Core responsibilities/deliverables (e.g., build APIs, data pipelines, mobile app)
     - Seniority/scale cues (ownership, leadership, users/throughput, compliance)
     - Platform constraints (cloud, mobile, on-prem, embedded)
  2) For each PROJECT, extract signals:
     - Actual technologies used (languages, frameworks, databases, cloud/DevOps, data/ML)
     - Domain & business use-case
     - Responsibilities, scope, outcomes/impact, scale, leadership
     - Recency (if stated) and duration
  3) Score & rank (descending):
     A) JD must-have tech overlap (highest weight)
     B) JD preferred tech overlap
     C) Domain/industry & problem alignment
     D) Responsibility/scope match (what the JD needs done vs what the project demonstrates)
     E) Seniority/scale/impact evidence
     F) Recency (more recent > older)
     Tie-breakers: (1) coverage of must-haves, (2) stronger outcomes/impact, (3) broader responsibility, (4) closer platform fit.
  4) Normalize synonyms (ReactJS→React, Node→Node.js, Postgres→PostgreSQL, GCP→Google Cloud, MS SQL→SQL Server, etc.).

  Constraints:
  - Use ONLY the provided PROJECTS—do not invent details.
  - If a PROJECT lacks any overlap with the JD (no tech, domain, or responsibility match), EXCLUDE it.
  - Keep original PROJECT TITLES exactly as given; do not rewrite.
  - If only a few projects are relevant, return only those; do not pad.
  - If two projects are essentially duplicates/versions, keep the stronger/recent one.
  - Pay especial attention to the tech stack required by the JD and pick the project with the best fit in regards to technology used.

  Output:
  Return ONLY the PROJECT TITLES as a single comma-separated list, in descending relevance. No numbering, no extra text.`;

  static projectTech = `You are selecting the three most JD-relevant technologies used in this project.

  Goal: Return exactly the technologies from the PROJECT that best match the JOB DESCRIPTION.

  Do silently:
  1) Extract only technologies explicitly used in the PROJECT (languages, frameworks, libraries, databases, cloud/platforms, DevOps/ML/data tools). Ignore soft skills and generic methods.
  2) Identify must-have and strongly preferred technologies from the JD.
  3) Normalize synonyms (e.g., ReactJS → React; Node → Node.js; Postgres → PostgreSQL).
  4) Rank overlap (JD must-have > JD preferred > domain/platform alignment), breaking ties by (a) impact shown in PROJECT, (b) recency, (c) seniority-critical tools.

  Constraints:
  - Choose technologies ONLY if they appear in the PROJECT.
  - Use canonical names; include version only if explicitly stated and relevant.
  - No duplicates; avoid redundant ecosystem items (e.g., npm vs Yarn).
  - If fewer than three matches exist, return only what’s available.

  Output:
  Return ONLY the technologies as a comma-separated list.`;
}
