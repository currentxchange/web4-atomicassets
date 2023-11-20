<script>
    import { writable } from 'svelte/store';
    import { getSchemasWithFields, getTemplatesWithFields, getNFTsWithFields } from '../lib/web4.ts'; // Replace with the actual path to your library

    const collectionResult = writable({});
    const templateResult = writable({});
    const nftResult = writable({});
    const collectionName = "cxcmusicnfts"; // Replace with a real collection name
    const fields = ["timestamp", "date", "year", "month", "day", "location", "nation", "state", "city", "geotag"]; // Example fields

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
</script>

<h1>Welcome to your library project</h1>
<button on:click={fetchCollectionSchemas}>Check Collection Schemas</button>
<button on:click={fetchTemplatesWithFields}>Get Templates with Fields</button>
<button on:click={fetchNFTsWithFields}>Get NFTs with Fields</button>

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

<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
