# Kubestronaut Practice Quiz

A small, static website of practice questions for all five certifications in the CNCF [Kubestronaut](https://www.cncf.io/training/kubestronaut/) program:

| Exam | Certification | Question bank |
| ---- | ------------- | ------------- |
| CKA  | Certified Kubernetes Administrator | `questions-cka.js` |
| CKAD | Certified Kubernetes Application Developer | `questions.js` |
| CKS  | Certified Kubernetes Security Specialist | `questions-cks.js` |
| KCNA | Kubernetes and Cloud Native Associate | `questions-kcna.js` |
| KCSA | Kubernetes and Cloud Native Security Associate | `questions-kcsa.js` |

Pick an exam in the sidebar, then work through one page per curriculum domain. Questions mix multiple-choice, YAML fill-in-the-blank, and true/false, and reveal the relevant official documentation link as soon as you answer.

## Layout

```
.
├── index.html                 # UI shell + styling
├── app.js                     # Exam picker + quiz renderer + scoring logic
├── questions.js               # CKAD question bank (curriculum domains + practice drills)
├── questions-cka.js           # CKA question bank
├── questions-cks.js           # CKS question bank
├── questions-kcna.js          # KCNA question bank
├── questions-kcsa.js          # KCSA question bank
├── .github/workflows/deploy.yml   # GitHub Pages auto-deploy
└── README.md
```

## Run locally

No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy automatically on push (GitHub Pages)

1. Create a new GitHub repository and push this folder to it (`main` branch).
2. In the repo: **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`. The `Deploy to GitHub Pages` workflow runs, uploads the site, and publishes it. The URL appears in the workflow run and under the repo's **Environments → github-pages**.

The workflow (`.github/workflows/deploy.yml`) uses the official GitHub Pages actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`). No extra secrets needed.

## Adding questions

Edit the question bank file for the exam (see table above). Each domain is an object in that file's curriculum array; each question has:

- `type`: `"mcq"`, `"yaml"`, or `"tf"`
- `prompt`: the question text
- `yaml` (optional): a YAML snippet — use six underscores `______` where the learner must pick the missing value
- `choices`: array of strings
- `answer`: index of the correct choice
- `explanation`: shown after the answer is revealed
- `docs`: `{ label, url }` pointing to kubernetes.io or another canonical reference

Domain `id`s must be unique across all exams (the new banks prefix theirs with the exam name, e.g. `cka-storage`).

## Curriculum coverage

Each exam page mirrors the official [CNCF curriculum](https://github.com/cncf/curriculum) domains and their weights:

- **CKA** — Storage (10%), Workloads & Scheduling (15%), Services & Networking (20%), Troubleshooting (30%), Cluster Architecture, Installation & Configuration (25%)
- **CKAD** — Application Design and Build (20%), Application Deployment (20%), Application Observability and Maintenance (15%), Application Environment, Configuration and Security (25%), Services and Networking (20%)
- **CKS** — Cluster Setup (15%), Cluster Hardening (15%), System Hardening (10%), Minimize Microservice Vulnerabilities (20%), Supply Chain Security (20%), Monitoring, Logging and Runtime Security (20%)
- **KCNA** — Kubernetes Fundamentals (46%), Container Orchestration (22%), Cloud Native Architecture (16%), Cloud Native Observability (8%), Cloud Native Application Delivery (8%)
- **KCSA** — Overview of Cloud Native Security (14%), Kubernetes Cluster Component Security (22%), Kubernetes Security Fundamentals (22%), Kubernetes Threat Model (16%), Platform Security (16%), Compliance and Security Frameworks (10%)

## CKAD practice drill sections

In addition to its five curriculum domains, the CKAD exam ships with seven extra **drill** sections grouped by the legacy topic organization used in the community reference repo [dgkanatsios/CKAD-exercises](https://github.com/dgkanatsios/CKAD-exercises) (MIT-licensed): Core Concepts, Configuration, Multi-Container Pods, Observability, Pod Design, Services & Ingress, and State Persistence. That repo is acknowledged here as topical inspiration only — all question prompts, answer choices, and explanations in this project are originally written.
