# Federated Analytics Ontology

**An interactive map of the language used to describe the federation of data within UK health data research systems.**

**[Explore the Federation Atlas →](https://lsc-sde.github.io/federated-analytics-ontology/)**

Led by **Lancashire Teaching Hospitals NHS Foundation Trust**, in collaboration with the University of Liverpool and the University of Nottingham, and supported by DARE UK.

> **On naming:** the **Federated Analytics Ontology** is the work — the vocabulary itself, this repository, and the thing you cite. **Federation Atlas** is the name of the interactive tool used to explore it.

> ⚠️ **Prototype.** This is a working prototype intended to support discussion. Federation, Federated Data and Federated Analytics have project-verified shared definitions; remaining definitions are drafts under review. Review status is shown per concept. The tool is not authoritative.

---

## Why this exists

When multiple Trusted Research Environments (TREs) and Secure Data Environments (SDEs) link up to allow analysis across their data without moving it, the people involved — the public, engineers, researchers, and information governance teams — frequently use the same words to mean different things, or different words to mean the same thing.

This project maps that vocabulary so that everyone can start from shared ground. The Atlas focuses on **Why** federation matters and **What** it involves, with the same definitions available to all users.

## Shared definitions

Each visible concept has two definition levels and a shared example:

| Level | Framing |
|---|---|
| **Summary** | An accessible starting point, selected by default |
| **Detailed** | More information about the same concept |

The verified definitions and examples for Federation, Federated Data and Federated Analytics were supplied by the project. Their Summary text comes from the accessible definition column; Detailed uses the cumulative definition column. The remaining concepts use existing draft content pending editorial review.

## Retained supporting content

How/Who concepts, original audience definitions, purpose text, essential characteristics and mappings to Five Safes, FAIR, PEDRI and SATRE remain in the downloadable ontology. How/Who layers, framework controls and tags, Purpose and Essential Characteristics are not displayed in the Atlas. Framework alignment needs further review before these features return.

## Using the app

- **Graph view** — explore Why and all current What branches and their relationships
- **Tabular view** — compare the same concepts; select a term to open its details
- **Summary / Detailed** — change the definition level for both views from the details panel
- **Search** — find visible concepts by name, either shared definition or related terms; hidden framework tags and archived concepts are not searched
- **Resources** — browse general reading or resources associated with a selected concept
- **Contacts** — each selected concept has an intentionally unresolved **Contact TBC** placeholder link until contact details are confirmed
- **Reset** — clear search and selection, restore Summary and reset the graph layout

## The ontology as data

The vocabulary is **not locked inside the application**. It lives as machine-readable JSON in [`/data`](data/), described by a [JSON Schema](data/schema/ontology.schema.json), so it can be reused, validated and cited independently of this website.

See [`data/README.md`](data/README.md) for the structure.

## Running locally

```bash
npm ci
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and produce a production build |
| `npm run validate:data` | Validate the ontology in `/data` |
| `npm test` | Check Atlas scope and shared-definition data |
| `npm run lint` | Lint the source |
| `npm run preview` | Preview the production build |

Built with React, TypeScript, Vite, Tailwind CSS and React Flow (`@xyflow/react`).

## How the definitions were produced

> Original audience definitions were AI-generated as a starting point and
> remain drafts. Three shared definitions have since been replaced with
> project-supplied verified text; their status is recorded separately from
> the retained legacy text. The other shared definitions and examples reuse
> existing draft content and still need review. Contributions and corrections
> are welcome — see Contributing below.

## Contributing

**Contributions are welcome — including from people who don't write code.**

If a definition is unclear, wrong, or missing, that is exactly the kind of feedback this project needs. You do not need to understand GitHub or ontologies to help; opening an issue in plain English is enough.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) to get started.

Code and data changes submitted as pull requests are covered by the
[Developer Certificate of Origin](DCO.md), which means commits need a
`Signed-off-by` line (`git commit -s`). This does **not** apply to issue
feedback, which stays anonymous by default.

## Maintaining this project

If you are taking over or helping run this repository, see
[`MAINTAINERS.md`](MAINTAINERS.md) for the release process, deployment notes and
known issues.

## Acknowledgements

This work has been shaped by extensive public engagement and by contributions from advisory groups committed to ethical, transparent and accountable health data research — in particular the **Lancashire and South Cumbria Data into Impact Programme (SDE) Public Advisory Group**, the **North West Secure Data Environment Public Advisory and Accountability Group**, and the **Federated Research Community Group**.

## Citation

If you use this work, please cite it using the metadata in [`CITATION.cff`](CITATION.cff).

## License

This repository uses a dual-license structure to accommodate both software and data.

* **Source Code:** All application code, build configuration and scripts are licensed under the [Apache License 2.0](LICENSE).
* **Data and Ontologies:** All datasets, mappings and ontology files in the [`data/`](data/) directory are licensed under a [Creative Commons Attribution 4.0 International License (CC BY 4.0)](data/LICENSE-DATA.txt).

When utilizing the data or ontologies, please attribute the work as **led by Lancashire Teaching Hospitals NHS Foundation Trust**, in collaboration with **the University of Liverpool** and **the University of Nottingham**, and supported by **DARE UK**.
