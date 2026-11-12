# Ontology data

> **Licence note:** everything in this directory is licensed under
> **CC BY 4.0** (see [`LICENSE-DATA.txt`](LICENSE-DATA.txt)) — **not** the
> Apache-2.0 licence that covers the application code in `/src`.

This directory is the **canonical, machine-readable source** of the Federated
Analytics Ontology vocabulary. The React application in `/src` imports these
files; it does not hold its own copy.

> **Provenance:** original audience definitions in `ontology.json` were
> **AI-generated** as a drafting starting point and remain drafts. Shared
> definitions for Federation, Federated Data and Federated Analytics use
> project-supplied verified text. Other shared definitions reuse existing draft
> content pending review. Status applies to the shared content, not the retained
> legacy audience text or framework mappings.

## Files

| File | Contents |
|---|---|
| `ontology.json` | The 34 ontology nodes — definitions, examples, characteristics, tags and hierarchy |
| `framework-categories.json` | Which tags belong to which framework (Five Safes, FAIR, PEDRI, SATRE) |
| `framework-tag-definitions.json` | Plain-English definition of each of the 20 framework tags |
| `tag-reasons.json` | Why a given framework tag was applied to a given node |
| `initial-visible-nodes.json` | Legacy root-node list, retained for data consumers |
| `atlas-layers.json` | Ordered Why/What membership used by both Atlas views |
| `schema/ontology.schema.json` | JSON Schema (draft 2020-12) describing `ontology.json` |

## Shared Atlas definitions

Every node listed in `atlas-layers.json` must have a `shared_definition`:

```json
{
  "summary": "An accessible definition.",
  "detailed": "A more detailed explanation of the same concept.",
  "example": "A shared example.",
  "status": "draft"
}
```

`status` is `draft` or `verified`. Verified text for the three reviewed concepts
was transcribed from the project-supplied spreadsheet image: Summary uses L1,
Detailed uses the cumulative column, and Example uses the example column.
The L3 column is blank and the separate working notes are not used as definitions.
Draft content reuses the previous public/researcher definitions and public
examples; it is not newly verified by being shown under the shared labels.

The Atlas shows one Why concept and all ten existing What concepts. How/Who
nodes remain in `ontology.json`, including their relationships, but are excluded
from both views and search. Links to them are not shown as related concepts.
The graph shows both visible layers immediately rather than progressively
revealing the removed outer layers.

Contacts currently use an intentionally unresolved `#contact-tbc` link in the
details panel, not invented personal details or a contact record in the ontology.

## Retained four-audience content

Every node retains its original four audience definitions for compatibility and
future editorial reference. These fields are not displayed in the Atlas:

- **`public`** — plain English, no jargon
- **`tech`** — technical and architectural detail
- **`researcher`** — what it means for doing research
- **`gov`** — governance, legal and information-governance framing

`examples` follows the same legacy shape, and may additionally carry `sde` and
`dare` examples. The Atlas uses `shared_definition.example` instead.

## Optional enrichment fields

Two optional fields let a node carry context without adding clutter to the graph:

- **`related_terms`** — an array of `{ term, definition }`. Use this for
  vocabulary that is worth explaining next to a concept but does not warrant a
  node of its own (for example *re-identification risk*). Rendered in both the
  sidebar and the tabular view.
- **`additional_resources`** — an array of `{ label, url, doi?, note? }`. Further
  reading and source material. `label` and `url` are required; `url` must be
  absolute. Use `note` to say why the link is worth following. Being listed is
  not an endorsement, and linked works may use terms differently to this
  ontology.

## Project-level further reading

`resources.json` holds reading that applies to the ontology **as a whole**
rather than to one concept. Each entry is `{ id, label, url, doi?, publisher?,
note? }`; `id` is kebab-case and unique, `url` must be absolute. It is rendered
in the sidebar's collapsible **Resources** panel, which is visible whether
or not a node is selected.

Use `resources.json` for framework sources and general background; use a node's
`additional_resources` for reading that only makes sense next to that concept. The
same work may legitimately appear in both, with a concept-specific `note` on the
node. As with `additional_resources`, listing is not an endorsement, and linked
works may use terms differently to this ontology.

## Known gaps

The ontology currently has no branch covering **dataset discovery and
metadata** — cataloguing, data dictionaries, and how a researcher finds out
what exists before requesting access. The `Findable` tags on existing nodes
gesture at it, but the concepts themselves are not modelled. Noted here so the
gap is deliberate and visible rather than forgotten.

## Framework tagging

Nodes are mapped to four established assurance frameworks: **Five Safes**,
**FAIR**, **PEDRI** and **SATRE**. Tags assert that a concept is relevant to a
principle; `tag-reasons.json` records the justification. Framework filters, tags,
the framework ring, Purpose and Essential Characteristics are hidden in both
Atlas views while their language and alignment are reviewed. The underlying
fields are retained.

## Validating changes

After editing any file here, run:

```bash
npm run validate:data
```

This checks structure, that every tag is recognised, that `id` matches its key,
that `children` resolve to real nodes, and that `tag-reasons.json` only
references nodes that exist. It also checks Why/What layer membership and the
shared content required for every visible node. `npm test` checks the retained
branch list and verified/draft status expectations.

## Attribution

When reusing this data, please credit the collaboration between Lancashire
Teaching Hospitals NHS Foundation Trust, the University of Liverpool
(DataSHIELD), the University of Nottingham, and DARE UK. For academic citation
use [`CITATION.cff`](../CITATION.cff).
