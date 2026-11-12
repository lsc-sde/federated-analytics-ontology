import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), 'utf8'));
const ontology = read('ontology.json');
const layers = read('atlas-layers.json');
const visibleIds = layers.flatMap(layer => layer.nodes);

test('Atlas retains exactly the existing Why and all ten What concepts', () => {
    assert.deepEqual(layers.map(layer => layer.label), ['Why', 'What']);
    assert.deepEqual(layers[0].nodes, ['fed_ecosystem']);
    assert.deepEqual([...layers[1].nodes].sort(), [
        'fed_people', 'fed_data', 'fed_analytics', 'research_outputs', 'fed_storage',
        'fed_gov', 'fed_infra', 'fed_access', 'fed_outputs', 'data_protect',
    ].sort());
    assert.equal(new Set(visibleIds).size, 11);
});

test('every visible concept has explicit shared content and legacy content', () => {
    for (const id of visibleIds) {
        const node = ontology[id];
        for (const field of ['summary', 'detailed', 'example']) {
            assert.equal(typeof node.shared_definition[field], 'string', `${id}.${field}`);
            assert.ok(node.shared_definition[field].trim(), `${id}.${field} must not be blank`);
        }
        for (const audience of ['public', 'tech', 'researcher', 'gov']) {
            assert.ok(node.definitions[audience], `${id} retains ${audience}`);
            assert.ok(node.examples[audience], `${id} retains the ${audience} example`);
        }
    }
});

test('only the three supplied definitions are verified, with cumulative detail', () => {
    const verified = Object.values(ontology).filter(node => node.shared_definition?.status === 'verified');
    assert.deepEqual(verified.map(node => node.id).sort(), ['fed_ecosystem', 'fed_data', 'fed_analytics'].sort());
    for (const node of verified) {
        assert.ok(node.shared_definition.detailed.startsWith(node.shared_definition.summary));
        assert.ok(node.shared_definition.detailed.length > node.shared_definition.summary.length);
    }
    for (const id of visibleIds.filter(id => !verified.some(node => node.id === id))) {
        assert.equal(ontology[id].shared_definition.status, 'draft');
    }
});

test('verified Summary text matches the accessible definitions supplied by the project', () => {
    assert.equal(ontology.fed_ecosystem.shared_definition.summary,
        'A group of Trusted Research Environments (TREs) which follow shared standards and comparable data security, governance and access processes.');
    assert.equal(ontology.fed_data.shared_definition.summary,
        'Federated data refers to multiple different datasets stored in different Trusted Research Environments (TREs) that can be accessed and analysed together as though they were in one place.');
    assert.equal(ontology.fed_analytics.shared_definition.summary,
        'A form of analytics that is run across data held in multiple independent Trusted Research Environments (TREs), with each organisation keeping control of their own data.');
});

test('How and Who nodes and their relationships remain in the ontology, outside Atlas scope', () => {
    for (const id of ['access_process', 'dacs', 'smpc', 'pseudonym', 'anonymise', 'synth_data', 'datashield', 'trevolution', 'tes', 'ohdsi', 'opensafely']) {
        assert.ok(ontology[id], `${id} remains available to data consumers`);
        assert.ok(!visibleIds.includes(id), `${id} is not an Atlas node`);
    }
    assert.ok(ontology.fed_analytics.children.includes('smpc'));
    assert.ok(ontology.data_protect.children.includes('pseudonym'));
});
