# Senda Segura — Product Requirements Document

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Status             | Draft for team and partner review                                  |
| Version            | 1.0                                                                |
| Updated            | November 6, 2026                                                   |
| Product            | Senda Segura                                                       |
| Partner            | Fundación Más Bosque Manu                                          |
| Target environment | Bosque La Primavera, Jalisco, Mexico                               |
| Platforms          | Android and iOS for visitors; web dashboard for authorized rangers |

## 1. Product overview

Senda Segura helps hikers and cyclists navigate Bosque La Primavera and request assistance in areas with limited cellular coverage. The planned product combines downloaded maps, GPS positioning, emergency alerts relayed through Bluetooth/LoRa beacons, and a dashboard where park rangers can locate visitors and track incidents.

This document defines product behavior and acceptance requirements. [Architecture decisions](docs/architecture.md) describe the implementation approach; [project context](docs/project-context.md) preserves the source documents, research background, and original project plan.

The repository currently implements a **navigation prototype** with simulated maps, permissions, and alerts. It does not yet meet the requirements for an operational emergency system. Its session data is held in memory and disappears on reload.

## 2. Problem and opportunity

Visitors can lose their way or suffer an accident where cellular service is unavailable. They may be unable to access a map, communicate their position, or determine whether a request for help reached rescue personnel. Rangers need accurate location information and a consistent process for receiving and managing incidents.

The project also requires validated information about trails, risk areas, past incidents, and rescue-vehicle access. Existing mockup routes and coverage illustrations cannot substitute for that research.

## 3. Goals and non-goals

### Goals

- Let visitors view downloaded maps and their GPS position without mobile data.
- Make emergency requests simple to initiate under stress.
- Deliver alerts through available communication channels and preserve them when delivery is unavailable.
- Explain clearly whether an alert is pending, transmitted, or acknowledged.
- Give authorized rangers the location and incident information needed to coordinate a response.
- Validate the prototype through controlled technical tests and user trials with the partner.

### Non-goals for the academic prototype

- Permanent deployment of a beacon network throughout the forest.
- Guaranteed coverage, rescue availability, or rescue arrival times.
- Automated field rescue coordination or replacement of the rangers' response protocol.
- Social networking, payments, visitor photo uploads, or the generic SafeReport account/reporting flow.
- Production-scale rollout before field measurements, security verification, permissions, and funding are established.

## 4. Users and needs

| User                         | Primary need                                                   | Representative user story                                                                                                                  |
| ---------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Hiker                        | Navigate unfamiliar trails without Internet access.            | As a visitor, I want to see my position on a downloaded map so I can understand where I am.                                                |
| Mountain biker               | Request help quickly after an accident.                        | As an injured cyclist, I want a prominent SOS action with few steps so I can request assistance under stress.                              |
| Visitor without connectivity | Know what happened to an emergency request.                    | As a visitor without coverage, I want my alert retained and its status explained so I do not mistake a pending request for a received one. |
| Park ranger                  | Locate visitors and manage incidents.                          | As a ranger, I want alerts on a map with profile details and status history so I can organize attention.                                   |
| Partner and research team    | Maintain trustworthy safety content and evaluate the solution. | As a project stakeholder, I want validated route information and measured test results so I can assess implementation readiness.           |

## 5. Delivery scope

| Area                | Current navigation prototype                                               | Target integrated prototype                                                                         |
| ------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Startup and profile | Welcome/setup, optional profile, editable session data.                    | Local profile and permission handling consistent with offline access and an agreed privacy model.   |
| Maps and trails     | SVG illustration, sample routes, simulated package preparation.            | Downloaded map packages, real GPS, validated routes/risks and rescue-vehicle access layers.         |
| SOS                 | Category selection, review, cancellation, and explicit simulated outcomes. | GPS/profile capture, actual transmission, persistent retries, deduplication, and verified receipt.  |
| Communications      | No device or network integration.                                          | Two to three Bluetooth/LoRa beacons, a receiving station, backend gateway, and SMS fallback.        |
| Ranger dashboard    | Not implemented.                                                           | Protected alert map/list, notifications, incident status updates, and history.                      |
| Evaluation          | Browser navigation tests and generated platform bundles.                   | Android/iOS device testing, radio range measurements, security evidence, and controlled user pilot. |

The integrated prototype is the academic target. Permanent installation remains a separate proposal requiring authorization and implementation resources. “Must” requirements below are necessary for that target, not claims about current functionality or authorization to implement every feature immediately.

## 6. Core user journeys

### Prepare and explore

1. The visitor opens the app and configures or reviews the emergency profile.
2. The app explains relevant permissions and their effects.
3. While connected, the visitor prepares a map package and reviews route/safety information.
4. In the forest, the downloaded map remains accessible without Internet access; the app indicates GPS and map availability separately.

### Request assistance

1. From the map, the visitor selects the prominent SOS action.
2. The visitor chooses an emergency category and reviews available location/profile details.
3. The visitor confirms or cancels before transmission.
4. The app attempts delivery through the available communication path, or retains the request for retry.
5. The app shows the actual delivery state and updates it only when the corresponding evidence exists.

### Respond to an incident

1. An authorized ranger receives a new-alert notification and opens the incident.
2. The dashboard shows the visitor's location, emergency details, and relevant map layers.
3. The ranger follows the agreed response protocol and records progress.
4. The incident is closed with a timestamped status history.

## 7. Functional requirements

All requirements in this section are **Must** for the integrated prototype. The reference IDs map to the source index in section 13.

| ID    | Requirement                       | Acceptance criteria                                                                                                                                                                                                 | Source     |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| FR-01 | Offline access                    | Previously downloaded maps and safety content open without an online session check. Connectivity loss does not block local navigation.                                                                              | S1, S2, S5 |
| FR-02 | Map package management            | The visitor can prepare a map while connected and see whether it is available locally. A missing or incomplete package is not shown as ready.                                                                       | S1, S5     |
| FR-03 | GPS and map layers                | Show GPS position on the downloaded map with trails, risk zones, and rescue-vehicle access information. Unavailable location is explicitly identified rather than fabricated.                                       | S1, S2, S4 |
| FR-04 | Emergency profile                 | Allow the visitor to review/edit the required name/contact information and include the agreed fields in an alert. Explain their use. Required fields and retention follow the final privacy decision.               | S4, S5     |
| FR-05 | SOS initiation and cancellation   | Provide a prominent action, category selection, and review of available details. Cancellation before submission creates no transmitted request. Final categories and confirmation timing require ranger validation. | S4, S5     |
| FR-06 | Beacon delivery                   | With a functioning beacon in range, the app sends an alert over Bluetooth; the beacon relays it over LoRa to the station. The tested path includes backend ingestion and dashboard visibility.                      | S1, S2, S4 |
| FR-07 | Persistent retry                  | Without a usable channel, retain the alert locally and retry when a channel becomes available. Temporary failures and app restarts must not silently discard pending requests.                                      | S1, S2, S3 |
| FR-08 | SMS fallback                      | When the beacon path is unavailable and cellular service permits SMS, offer the fallback. Respect platform confirmation requirements and do not treat opening a composer as delivery.                               | S1, S4     |
| FR-09 | Truthful status and deduplication | Distinguish pending, sent, and confirmed states. Retries retain a stable alert ID; repeated receipt does not create duplicate incidents. Show receipt only after the agreed acknowledgment.                         | S2, S3, S5 |
| FR-10 | Safety information                | Make validated recommendations and route/risk information available to visitors, including downloaded content when offline. Example data is identified as such.                                                     | S1, S2, S4 |
| FR-11 | Ranger alert monitoring           | Authorized staff can view active alerts on a map/list with profile details and relevant layers. A new alert appears without manual page reload and triggers visual/audible notification.                            | S2, S4     |
| FR-12 | Incident management               | Support received, in-attention, and closed incident states. Record the time of each change and provide a history of attended alerts.                                                                                | S4         |
| FR-13 | Degraded conditions               | Explain unavailable GPS/Bluetooth, missing maps, communication failure, and relevant permission denial. Preserve pending requests and avoid a false success state.                                                  | S3, S5     |

FR-02's incomplete-package behavior and FR-07's restart case are acceptance clarifications derived from reliable offline operation; their implementation details remain to be designed.

### Delivery and incident states

| State                                                                     | Meaning                                                                                                                                                     |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pending (`pendiente`)                                                     | The request is retained locally but has not completed transmission through an available path.                                                               |
| Sent (`enviado`)                                                          | A transmission step completed; the exact evidence and channel-specific wording must be defined in the transport contract. It does not imply rescue receipt. |
| Confirmed (`confirmado`)                                                  | The agreed receiving endpoint acknowledged the alert. The source mockup uses receiving-station acknowledgment.                                              |
| Received / in attention / closed (`recibida` / `en atención` / `cerrada`) | Separate incident states managed by authorized rangers in the dashboard.                                                                                    |

A station acknowledgment, backend persistence, dashboard visibility, and a ranger beginning attention are distinct events. The final protocol must define their relationship and how acknowledgment returns to the phone. The current prototype's “recepción simulada” is only a demonstration.

## 8. Experience and quality requirements

| ID     | Requirement            | Verification                                                                                                                                                          |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-01 | Usability under stress | Readable Spanish copy, prominent SOS access, accessible controls, and understandable cancel/back actions; evaluate unassisted task completion during the pilot.       |
| NFR-02 | Compatibility          | Exercise the visitor journeys on Android and iOS and the ranger dashboard in supported modern browsers. Minimum versions and the device matrix remain to be selected. |
| NFR-03 | Reliability            | Test connectivity loss/recovery, application restart, retransmission, duplicate packets, and missing acknowledgments without alert loss or misleading status.         |
| NFR-04 | Resource efficiency    | Evaluate battery, storage, and background processing during representative outings; numeric budgets remain to be established.                                         |
| NFR-05 | Maintainability        | Keep maps, location, profile, alert state, communications, and dashboard responsibilities separable so integrations can evolve independently.                         |

The source mockups propose a five-second confirmation countdown. The current skeleton uses an explicit simulation button. Countdown duration and post-submission cancellation behavior remain product decisions rather than approved requirements.

## 9. Data, security, and privacy

The product handles visitor contact information, incident locations and timestamps, alert delivery evidence, and ranger activity. Route/risk information is a separate content domain. Final payload fields, storage schema, retention periods, and the visitor identity model are not yet approved.

The following controls are required before the integrated pilot, based on S3's checklist:

- Encrypt sensitive local pending-alert data and use platform-provided key storage; keep secrets out of source and distributed binaries (C01–C02).
- Enforce API authorization and protect staff access with expiring, revocable sessions (C03–C04).
- Validate Internet certificates and protect LoRa message authenticity, integrity, and replay resistance (C05–C06).
- Validate coordinates and incident fields on the server (C07).
- Limit location collection to justified functions, exclude sensitive values from logs/notifications, and define retention/deletion behavior (C08–C10).
- Verify delivery-state correctness and idempotent alert processing (C11–C12).
- Apply least privilege, audit incident access/status changes, and maintain reviewed dependency/firmware inventories (C13–C15).
- Test unavailable GPS/Bluetooth and airplane-mode behavior (C16).

SMS must not be represented as end-to-end encrypted. Security controls remain unverified until implementation and test evidence are available. Source DFD identifiers contain inconsistencies; use domain names until the inventory is reconciled.

## 10. Success metrics and acceptance

These are targets from the project charter, not measured results.

| Metric                    | Target                                               | Evaluation                                                                                   |
| ------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Alert latency             | Less than 30 seconds                                 | Time from SOS-button activation to dashboard arrival with a functioning beacon in range.     |
| Location accuracy         | Error of 15 meters or less under suitable conditions | Compare reported coordinates with a reference location and document conditions.              |
| Alert delivery            | At least 90%                                         | Successfully received alerts divided by attempted alerts in controlled tests.                |
| Offline maps              | 100% of intended offline map functions               | Test downloaded content and positioning in airplane mode under suitable GPS conditions.      |
| Unassisted emergency flow | At least 80%                                         | Participants completing the defined emergency task without help.                             |
| Pilot participation       | At least 15 people                                   | Document participation and task results.                                                     |
| Satisfaction              | At least 4 out of 5                                  | Collect the pilot feedback score; agree on the questionnaire and aggregation before testing. |
| Beacon range              | Measure and report                                   | Record terrain, vegetation, equipment, and distance; no fixed range is established.          |

Acceptance of the integrated prototype requires:

1. A working downloaded map and a demonstrated end-to-end alert path in controlled tests.
2. Evidence against the charter metrics and the security checklist, with unresolved issues recorded.
3. A response protocol and solution validated by rangers and Más Bosque Manu.
4. A results report, usage guide, and implementation proposal with estimated costs.

Browser navigation tests and generated platform bundles validate the current skeleton only. They do not establish device, radio, security, or field acceptance. See the [testing guide](docs/testing.md).

## 11. Dependencies, risks, and ownership

| Dependency or risk                                      | Product impact                                                               | Response / owner                                                                                                   |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Validated routes, risk areas, and rescue-vehicle access | Incorrect content can mislead visitors or responders.                        | Research and ranger validation — Daniel Moreno.                                                                    |
| Terrain, vegetation, and Bluetooth proximity            | Alerts may have no usable radio path.                                        | Range tests, coverage feedback, persistent retries, and fallback evaluation — Carlos Arias with José Arturo Mitre. |
| Device permissions and SMS restrictions                 | A designed flow may not be supported identically on both platforms.          | Device testing and platform-specific interaction — José Arturo Mitre.                                              |
| Station connectivity and staffed monitoring             | Station receipt may not produce timely dashboard visibility or human action. | Define gateway behavior, notifications, and operational protocol — Cristian Cárdenas with partner/rangers.         |
| Hardware availability and battery life                  | Delays or unreliable test operation.                                         | Procurement and battery/range measurements — Carlos Arias.                                                         |
| Shared message and acknowledgment contracts             | App, firmware, and dashboard may interpret delivery differently.             | Agree on contracts before integration — José Arturo Mitre, Carlos Arias, and Cristian Cárdenas.                    |
| Partner availability and deployment permission          | Validation or future installation may be delayed.                            | Coordinate reviews and distinguish pilot from permanent rollout — Daniel Moreno.                                   |

These responsibilities follow the source WBS. Daniel Moreno coordinates the project and requirements; José Arturo Mitre owns mobile/UX work; Carlos Arias owns communications and technical architecture; Cristian Cárdenas owns backend/dashboard and integration/user testing. Partner acceptance remains separate from technical implementation.

## 12. Open product decisions

Resolve these before the dependent integration or pilot, and record the outcome in this PRD or the architecture decisions:

- Final emergency categories, confirmation timing, and cancellation semantics after a request has been queued or sent.
- Required profile fields, visitor identity/consent, and behavior when a visitor has no profile or usable GPS fix.
- Exact meaning of each transport acknowledgment and treatment of an offline receiving-station backend connection.
- Channel selection, retry/backoff policy, SMS recipient/provider, and radio coverage expectations.
- Map provider/SDK, package updates, supported devices, and resource budgets.
- Retention/deletion periods, key provisioning, staff roles, and dependency/security review evidence.
- Expected concurrent usage and a production deployment proposal based on measured pilot results.

The original schedule and budget remain in [project context](docs/project-context.md#planned-milestones-and-resources). They are planning inputs, not evidence of completed milestones or approved production expenditure.

## 13. Source traceability

| Reference | Source                                        | Primary contribution                                                            |
| --------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| S1        | `Stage1_PA.pdf`                               | Problem, goals, deliverables, scope, and prototype metrics.                     |
| S2        | `Stage 1 (Paco).pdf`                          | Users, functional requirements, and quality attributes.                         |
| S3        | `Stage_2_Cybersegurity.pdf`                   | Security/privacy requirements, delivery correctness, and verification controls. |
| S4        | `Stage2_PA.pdf`                               | WBS ownership, integration dependencies, and package acceptance criteria.       |
| S5        | `Stage 2 (Mobile Development).pdf`, pp. 10–18 | Project-specific visitor screens and provisional interaction details.           |

See the [source interpretation notes](docs/project-context.md#source-documents-and-interpretation) for naming differences and source conflicts. SafeReport's example screens on S5 pp. 2–9 do not define this product's API or authentication requirements. This PRD consolidates the supplied material for review; it does not assert partner approval.
