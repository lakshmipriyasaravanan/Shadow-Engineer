# Security Policy

## Supported Versions

Currently, only the latest release (`v1.0.0`) receives security updates.

## Reporting a Vulnerability

Security is a top priority for Shadow Engineer. If you discover a vulnerability, please **DO NOT** open a public issue.

Instead, please email `security@shadowengineer.com`. We will acknowledge receipt within 24 hours, and provide a timeline for the fix.

## Hardening Standards
- All APIs are protected by JWT Bearer tokens.
- All destructive actions are logged in the `audit_logs` table.
- Production containers run as non-root users.
