<script>
    import { writable } from 'svelte/store';
    import { checkCollectionSchemas } from '../lib/web4.ts'; // Replace with the actual path to your library
    const collectionResult = writable({});
    const schemaResult = writable({});
    const templateResult = writable({});
    const collectionName = "cxcmusicnfts"; // Replace with a real collection name
    const fields = ["timestamp", "date", "year", "month", "day", "location", "nation", "state", "city", "geotag"]; // Example fields

    // Reactive statement to handle async operation
    $: if (collectionName) {
        checkCollectionSchemas(collectionName, fields).then(result => {
            collectionResult.set(result);
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
    }
</script>

<h1>Welcome to your library project</h1>
<p>Results from checkCollectionSchemas:</p>
<pre>{$collectionResult
        ? JSON.stringify($collectionResult, null, 2)
        : "Loading..."}</pre>

<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
