import { ExplorerApi, RpcApi } from "atomicassets";
//import fetch from 'node-fetch';


const defaultFields = ["timestamp", "date", "year", "month", "day", "location", "nation", "state", "city", "geotag"];


/**
 * Retrieves schemas from a collection that contain specific fields, aggregated across templates.
 * @param collectionName The name of the collection to check.
 * @param fieldsToCheck Array of fields to check for in the schemas. Defaults to a predefined set.
 * @returns Promise<object> Object with schema names and an array of fields present in that schema.
 */
export async function getSchemasWithFields(collectionName, fieldsToCheck = defaultFields) {
    console.log(`Getting schemas with fields for collection '${collectionName}'`);
    try {
        const templatesData = await getTemplatesWithFields(collectionName, fieldsToCheck);
        let schemaFieldAggregation = {};

        for (const schemaName in templatesData) {
            let aggregatedFields = new Set();
            for (const templateId in templatesData[schemaName]) {
                templatesData[schemaName][templateId].forEach(field => aggregatedFields.add(field));
            }
            schemaFieldAggregation[schemaName] = Array.from(aggregatedFields);
        }

        console.log('Aggregated schema fields:', schemaFieldAggregation);
        return schemaFieldAggregation;
    } catch (error) {
        console.error('Error retrieving schemas with aggregated fields:', error);
    }
}



export async function getTemplatesWithFields(collectionName: string, fieldsToCheck: string[] = defaultFields): Promise<object> {
    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
        const schemas = await explorerApi.getSchemas({ collection_name: collectionName });
        
        if (!schemas || schemas.length === 0) {
            throw new Error('Schemas not found for collection');
        }
        let schemaFieldData = {};
        for (const schema of schemas) {
            const templates = await explorerApi.getTemplates({ schema_name: schema.schema_name });
            for (const template of templates) {
                let foundFields = fieldsToCheck.filter(field => Object.keys(template.immutable_data).includes(field));
                if (foundFields.length > 0) {
                    console.log("foundFields");
                    
                    if (!schemaFieldData[schema.schema_name]) {
                        schemaFieldData[schema.schema_name] = {};
                    }
                    schemaFieldData[schema.schema_name][template.template_id] = foundFields;
                }
            }
        }

        return schemaFieldData;
    } catch (error) {
        console.log('Error checking collection schemas:', error);
    }
}

export async function getNFTsWithFields(collectionName, fieldsToCheck = defaultFields) {
    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
        // Fetch templates containing the specified fields
        const filteredTemplates = await getTemplatesWithFields(collectionName, fieldsToCheck);
        const templateIds = Object.keys(filteredTemplates); // Get only the template IDs

        if (templateIds.length === 0) {
            console.log('No templates found with the specified fields');
            return [];
        }

        // Fetch NFTs for all the filtered template IDs in one call
        const nfts = await explorerApi.getAssets({
            collection_name: collectionName,
            template_ids: templateIds.join(',')
        });

        console.log('Retrieved NFTs with specified fields:', nfts);
        return nfts.map(nft => nft.asset_id); // Returning only the asset IDs for simplicity
    } catch (error) {
        console.error('Error retrieving NFTs with fields:', error);
    }
}
