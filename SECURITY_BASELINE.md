# Security Baseline

This repository follows the SpringNexa security baseline for secure software development.

## Controls
- Never commit passwords, API keys, private keys, tokens, certificates, database credentials, or patient/customer data.
- Store secrets in the deployment platform or GitHub Actions Secrets/Variables; use least privilege and rotation.
- Require HTTPS/TLS in production and secure cookies where applicable.
- Validate and sanitize all untrusted input; use parameterized database queries.
- Enforce authentication, authorization, RBAC/least privilege, session expiry, CSRF protection where applicable, and rate limiting.
- Apply security headers: HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and frame protection.
- Encrypt sensitive data in transit and at rest where technically applicable.
- Minimize collection and retention of personal data; keep audit trails for security-sensitive actions.
- Backups must be encrypted, access-controlled, tested, and protected from ransomware/deletion.
- Dependencies and container images must be scanned and patched.
- Security issues must be reported privately using the repository security contact rather than publicly disclosed before remediation.

## Healthcare / sensitive-data systems
For EMR, neurodiagnostic, LMIS, ERP or other systems handling personal/sensitive information, production data must not be used in development, testing, logs, screenshots, AI prompts, or public repositories unless an approved lawful basis and security process exists.

## Important
This file is an engineering security baseline. It does not by itself establish legal, regulatory, contractual, or certification compliance.
