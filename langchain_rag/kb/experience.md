# Work Experience

## Qualcomm — Infrastructure Engineer, Server Lifecycle Automation
**San Diego, CA | February 2024 – Present**

Praveen's primary role at Qualcomm covers end-to-end server lifecycle automation across a global, enterprise-scale data center footprint. He owns everything from physical server procurement to the AI agents that make the infrastructure queryable.

### Scale of the Environment
- 5,000+ ESXi hosts under management
- 20+ global data centers
- ~100 production servers delivered (procurement to production)
- 400+ monthly net-new host onboardings

### AI / LLM Agent — Flagship Achievement
Praveen designed and built a production natural-language to SQL agent using LangChain, Anthropic's Claude API, and FAISS vector search. The agent sits on top of a semantic layer over infrastructure data — engineers and directors type plain-English questions like "Which servers in Singapore are running outdated firmware?" and the agent writes the SQL, runs it, and returns the answer.

**Result**: reduced root-cause analysis (RCA) time-to-insight by approximately 90%. This went from a process that required an analyst to write SQL queries and navigate multiple dashboards, to a conversational interface used by directors for daily capacity planning decisions.

**Tech used**: LangChain, Anthropic API, FAISS, PostgreSQL, Python.

### Infrastructure Telemetry Pipelines
Praveen built continuous infrastructure telemetry ingestion pipelines that process 100,000+ rows of server data every 30 minutes. The pipeline is orchestrated through Azure DevOps CI/CD, uses distributed low-latency ingestion VMs, includes validation checks, and feeds automated alerting.

**Tech used**: PowerShell, Python, Azure DevOps, Grafana, Prometheus.

### Grafana Dashboards and Capacity Planning
Designed structured SQL data models and Grafana dashboards for director-level capacity planning covering CPU, memory, and storage optimization. These dashboards are used for strategic decisions about server procurement across Qualcomm's global data center fleet.

### CyberArk PAM and Security
Led CyberArk PAM (Privileged Access Management) onboarding for 5,000+ ESXi hosts, implementing automated password vaulting and rotation. This secured credentials at scale and eliminated manual credential management for the monthly onboarding of 400+ net-new hosts.

### Server Lifecycle Ownership
Delivered approximately 100 production servers across 20+ global data centers. Owned the complete lifecycle: procurement, validation of firmware and BIOS settings, out-of-band management configuration (iDRAC/iLO), and handoff for customer-facing engineering workloads.

---

## Qualcomm — Software Engineering Intern, Server Lifecycle Automation
**San Diego, CA | May 2023 – August 2023**

Praveen's internship at Qualcomm directly preceded his full-time offer, demonstrating he could deliver production-quality work quickly. He worked on the same team he later joined full-time.

### Key Work
- Built a showback notification framework with SQL query views and director-level visualizations to reduce company-wide VMware virtualization costs. This framework surfaces which teams are over-provisioning VM resources and by how much.
- Constructed a VM template pipeline on Azure DevOps + VMware vRealize: monthly template updates, new OS security features, and automated deployment tests to ensure templates are consistently hardened.
- Enhanced a system-management software framework used across IT; validated end-to-end with Postman for API correctness.

---

## Stryker — Software Design Engineering Intern
**San Jose, CA | May 2022 – August 2022**

- Built a C# Windows GUI application that dynamically presents and updates display monitor parameters, improving monitor testing efficiency by 70%. The app replaced a manual process of comparing test results against specifications.
- Used Microsoft SQL Server to store and query performance test data for further analysis by the hardware engineering team.
