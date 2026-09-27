# DPDP Readiness Baseline

## Purpose
This repository is intended to support privacy-by-design under India's Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025, as applicable to the deployed service.

## Engineering requirements
1. **Purpose limitation:** document why each personal-data field is collected and restrict processing to the documented purpose.
2. **Data minimisation:** collect only data necessary for the stated service.
3. **Notice and consent:** provide a clear, standalone notice in plain language where consent is the applicable basis; record consent/withdrawal events where required.
4. **User rights workflow:** provide mechanisms/processes for access, correction, erasure and grievance handling as applicable.
5. **Security safeguards:** implement access control, encryption, secure authentication, logging/monitoring, vulnerability management, backup protection and incident response.
6. **Retention:** define retention periods and securely delete/anonymise data when no longer required, subject to applicable legal obligations.
7. **Processor governance:** document third-party processors, data flows, security requirements and contractual controls.
8. **Breach response:** maintain an incident-response process for detection, containment, investigation, recovery, evidence preservation and required notifications.
9. **Children:** implement age/parental-consent controls where the service processes children's personal data and the law requires them.
10. **Privacy by design:** threat-model new personal-data features before production release.

## Healthcare data
Medical records and neurophysiological data should be treated as high-risk personal information operationally. Do not place identifiable clinical records in Git, CI logs, issue trackers, test fixtures, or public AI services.

## Governance
Maintain:
- data inventory and processing purposes
- data-flow diagram
- retention schedule
- processor/vendor register
- access-control matrix
- incident-response plan
- security test evidence
- privacy notice and consent records where applicable

**Legal note:** This is a technical readiness checklist, not legal advice or a certification of compliance. Confirm obligations, commencement dates, roles and required notices with qualified Indian privacy counsel.
