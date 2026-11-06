# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 5.0.x | Yes |
| < 5.0 | No |

## Reporting a vulnerability

Please do not report security vulnerabilities through public GitHub
issues.

Instead, use [GitHub's private vulnerability reporting](
https://github.com/1-Pankaj/pollen-ui/security/advisories/new) on this
repository. That keeps the report confidential and lets a fix land
before the details are public.

Include whatever you have of the following:

- The affected package and version (`pollen-ui`, `@pollen-ui/tokens` or
  `@pollen-ui/native`)
- A description of the issue and how it could be exploited
- Steps to reproduce, or a minimal demo if possible
- Any known workarounds

You will get an acknowledgment within 7 days, and a status update at
least every 7 days until the issue is resolved or declined.

## Scope

The packages ship UI components. Issues that matter here are things
like XSS through component APIs (props that reach the DOM unescaped),
unsafe URLs ending up in `href`, prototype pollution in exported
utilities, or a vulnerable build artifact. Style-only visual bugs are
not security issues — please file them as regular bug reports.

## Disclosure policy

When a report is confirmed, the fix is developed privately, released in
a patch version, and disclosed in a GitHub security advisory with
credit to the reporter unless the reporter prefers to stay anonymous.
