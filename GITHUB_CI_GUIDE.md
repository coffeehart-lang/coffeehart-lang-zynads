# GitHub Actions & Google AI Studio Integration Guide for ZynAds / Zyncast Suite

This guide explains how to connect **zynads-suite** to Google AI Studio and Vertex AI for automated testing and inference.

## 1. Automated GitHub Actions Workflow

Create a file named `.github/workflows/ai-studio-ci.yml` in your repository with the following contents:

```yaml
name: AI Studio & Vertex AI CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci || npm install

      - name: Typecheck and Build Applet
        run: npm run build

      - name: Run AI Studio Inference Validation (Optional Secret)
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          if [ -n "$GEMINI_API_KEY" ]; then
            npx tsx scripts/ai-inference.ts
          else
            echo "GEMINI_API_KEY secret not set in GitHub. Skipping live API call."
          fi
```

## 2. Setting Up GitHub Secrets

1. Go to your repository settings on GitHub: `https://github.com/coffeehart-lang/zynads-suite/settings/secrets/actions`
2. Click **New repository secret**.
3. Name: `GEMINI_API_KEY`
4. Value: Paste your Google AI Studio API key.

## 3. Running AI Studio Inference locally or in CI

You can test the Google Gen AI SDK integration directly via TypeScript:

```bash
npx tsx scripts/ai-inference.ts
```

This script connects using `@google/genai` (SDK version `^2.4.0`) to call Google AI Studio models such as `gemini-2.5-flash`.

### Environment & Dependency Requirements
- **Node.js**: Node.js 18+ or 20+ recommended.
- **Dependencies**: Ensure `@google/genai` is listed in your `package.json` (`npm install @google/genai`).
- **Resilient Execution**: The script safely formats API outputs and sets clear process exit codes for CI environments.
