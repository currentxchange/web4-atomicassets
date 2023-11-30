<script>
    import { writable } from 'svelte/store';
    import { getNFTsByField, getSchemasWithFields, getTemplatesWithFields, getNFTsWithFields } from '../lib/web4.ts'; // Replace with the actual path to your library

    const collectionResult = writable({});
    const templateResult = writable({});
    const nftResult = writable({});
    const collectionName = "cxcmusicnfts"; // Replace with a real collection name
    const fields = ["timestamp", "date", "year", "month", "day", "location", "nation", "state", "city", "geotag"]; // Example fields
    const nftFieldResult = writable({});
    const fieldFilters = writable({});
    let filterPairs = [{ key: '', value: '' }];

    // Function to get schemas
    async function fetchCollectionSchemas() {
        try {
            const result = await getSchemasWithFields(collectionName, fields);
            collectionResult.set(result);
        } catch (error) {
            console.log('Error in getSchemasWithFields:', error);
        }
    }

    // Function to get templates with fields
    async function fetchTemplatesWithFields() {
        try {
            const result = await getTemplatesWithFields(collectionName, fields);
            templateResult.set(result);
        } catch (error) {
            console.log('Error in getTemplatesWithFields:', error);
        }
    }

    // Function to get NFTs with fields
    async function fetchNFTsWithFields() {
        try {
            const result = await getNFTsWithFields(collectionName);
            nftResult.set(result);
        } catch (error) {
            console.log('Error in getNFTsWithFields:', error);
        }
    }
    
// Function to get NFTs by field
async function fetchNFTsByField() {
    const currentFilters = filterPairs.reduce((acc, { key, value }) => {
        if (key && value) acc[key] = value;
        return acc;
    }, {});

    try {
        const result = await getNFTsByField(collectionName, currentFilters);
        nftFieldResult.set(result);
    } catch (error) {
        console.log('Error in getNFTsByField:', error);
    }
}

// Update field filter
function updateFieldFilter(index, type, event) {
    const { value } = event.target;
    filterPairs = filterPairs.map((pair, idx) => {
        if (index === idx) {
            return { ...pair, [type]: value };
        }
        return pair;
    });
}

// Add a new filter pair
function addFilterPair() {
    filterPairs = [...filterPairs, { key: '', value: '' }];
}
</script>

<h1>Welcome to your library project</h1>
<button on:click={fetchCollectionSchemas}>Check Collection Schemas</button>
<button on:click={fetchTemplatesWithFields}>Get Templates with Fields</button>
<button on:click={fetchNFTsWithFields}>Get NFTs with Fields</button>

<h1>Test NFTs by Field</h1>

<!-- Simple form for adding field filters -->
<form on:submit|preventDefault={fetchNFTsByField}>
    {#each filterPairs as pair, index}
        <div>
            <input type="text" placeholder="Field Key" on:input={(event) => updateFieldFilter(index, 'key', event)} />
            <input type="text" placeholder="Field Value" on:input={(event) => updateFieldFilter(index, 'value', event)} />
        </div>
    {/each}
    <button type="button" on:click={addFilterPair}>Add Filter Pair</button>
    <button type="submit">Get NFTs by Field</button>
</form>

<button on:click={addFilterPair}>Add More Filters</button>

<p>Results from getSchemasWithFields:</p>
<pre>{$collectionResult
        ? JSON.stringify($collectionResult, null, 2)
        : "Loading..."}</pre>

<p>Results from getTemplatesWithFields:</p>
<pre>{$templateResult
        ? JSON.stringify($templateResult, null, 2)
        : "Loading..."}</pre>

<p>Results from getNFTsWithFields:</p>
<pre>{$nftResult
        ? JSON.stringify($nftResult, null, 2)
        : "Loading..."}</pre>
<p>Results from getNFTsByField:</p>
<pre>{$nftFieldResult
        ? JSON.stringify($nftFieldResult, null, 2)
        : "Loading..."}</pre>

<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
