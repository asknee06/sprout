# Sprout clinician communication system

## Meaning of the data
Tree HP and XP are game state driven by extension choices. Choosing to watch a sad video does not establish distress; skipping does not establish recovery. Heuristic content detection can be wrong. No mental-state inference, diagnosis, suicide prediction, or clinical priority score is generated. Self-reports are optional, unvalidated conversation prompts, separate from extension activity. A contact request expresses the user's preference to talk.

## Implemented in 1.7 (local only)
Open Care view from the popup. Recording is off by default. Consent enables future dated choices plus optional Good / Okay / Difficult / Very difficult check-ins and a local request-for-contact. Counts, HP ranges, and self-reports are grouped by UTC date. Reports cover the last 30 days; older records are pruned on the next care action or recorded choice. Idle installations may retain expired records until that next operation. At most 2,000 events are retained. Stopping recording preserves existing entries until pruning; it does not retract previously exported files. No historical data is fabricated. Existing aggregate tree totals are excluded from the history.

The clinician-facing local view shows requests for contact, dates, self-reports, and activity in separate fields. Export produces a text report for user review and sharing through an agreed clinic channel. No recipient is configured, nothing is sent, and no delivery or monitoring is claimed. This is a patient-held report, not an authenticated clinician portal or a multi-patient dashboard. Device access can reveal local data and exported reports.

## Proposed connected workflow (not implemented)
1. A clinic enrolls the user, verifies the patient-clinician link, and agrees on response hours and escalation arrangements. Obtain separate, revocable consent for transmission and define which fields can be shared. Never treat a local recording checkbox as consent to send.
2. User requests contact and reviews the outgoing summary. Send only to the linked clinic through an authenticated encrypted service; exclude video metadata, keywords, and URLs. Explicitly distinguish self-reports from inferred/game data.
3. Add the request to the clinic's Needs acknowledgement queue. Send a generic notification such as 'A new Sprout contact request is available. Sign in to review.' Do not put symptoms, patient names, HP, or check-ins into notification previews.
4. The clinician signs in, sees the user-stated request and factual report, and records acknowledgement, contact attempt, follow-up plan, or closure. User-visible states are Awaiting delivery / Delivered / Acknowledged / Contact attempted / Closed. Never show Received before a server receipt or Reviewed before clinician action.
5. The clinic sets its response window. An unacknowledged request is re-notified or routed to an agreed covering clinician after that window; cap duplicate notifications and keep an audit trail. The system must not promise round-the-clock response. Users are told to use their agreed direct support route for urgent needs.
6. Optional weekly summaries may include user-approved check-in changes. A run of Difficult check-ins can prompt the USER to consider asking for contact; it must not automatically create a clinical risk label or send data without the agreed consent. Missing data is shown as Unknown, not reassurance or deterioration.

## Requirements before a live clinical rollout
Secure backend, clinic identity verification, patient linking, authentication and authorization, encryption, audit records, consent and revocation, access/export controls, retention policy, delivery receipts, staff coverage, clinical workflow review, and validation with representative users. Confirm applicable privacy and medical-device requirements for the intended deployment. The local prototype does not supply these.

## Guidance informing the separation
- NICE NG225: https://www.nice.org.uk/guidance/NG225/chapter/recommendations (clinical assessment and cautions against risk prediction scales).
- NIMH clinical pathway: https://www.nimh.nih.gov/news/science-updates/2022/a-clinical-pathway-for-suicide-risk-screening-in-adult-primary-care (validated clinical screening leads to assessment by trained professionals).
