# CKAD Practice Quiz

A small, static website of practice questions for the **Certified Kubernetes Application Developer (CKAD)** exam. Questions are organized into one page per curriculum domain, mix multiple-choice, YAML fill-in-the-blank, and true/false, and reveal the relevant official kubernetes.io documentation link as soon as you answer.

## Layout

```
.
├── index.html                 # UI shell + styling
├── app.js                     # Quiz renderer + scoring logic
├── questions.js               # Question bank (edit me to add questions)
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

Edit `questions.js`. Each domain is an object in the `CURRICULUM` array; each question has:

- `type`: `"mcq"`, `"yaml"`, or `"tf"`
- `prompt`: the question text
- `yaml` (optional): a YAML snippet — use six underscores `______` where the learner must pick the missing value
- `choices`: array of strings
- `answer`: index of the correct choice
- `explanation`: shown after the answer is revealed
- `docs`: `{ label, url }` pointing to kubernetes.io or another canonical reference

## Curriculum domains covered

1. Application Design and Build (20%)
2. Application Deployment (20%)
3. Application Observability and Maintenance (15%)
4. Application Environment, Configuration and Security (25%)
5. Services and Networking (20%)

Based on the official [CNCF CKAD curriculum](https://github.com/cncf/curriculum).

## Practice drill sections

In addition to the five curriculum domains above, the quiz ships with seven extra **drill** sections grouped by the legacy topic organization used in the community reference repo [dgkanatsios/CKAD-exercises](https://github.com/dgkanatsios/CKAD-exercises) (MIT-licensed): Core Concepts, Configuration, Multi-Container Pods, Observability, Pod Design, Services & Ingress, and State Persistence. That repo is acknowledged here as topical inspiration only — all question prompts, answer choices, and explanations in this project are originally written.
