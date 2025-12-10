# Snyk Vulnerable Demo Project

This project intentionally contains vulnerable dependencies to test Snyk security scanning.

## Vulnerable Packages
- lodash 4.17.10 (Prototype Pollution)
- minimist 1.2.0 (Prototype Pollution)
- express 4.16.0 (Outdated & vulnerable sub-dependencies)
- jquery 3.4.1 (XSS)
- axios 0.21.0 (SSRF & Redirect issues)

## How to run
```
npm install
npm start
```

Use this ONLY for testing supply‑chain security tools.
