import { ExplorerApi, RpcApi } from "atomicassets";


const defaultFields = ["timestamp", "date", "year", "month", "day", "location", "nation", "state", "city", "geotag"];

/**
 * Checks collection schemas and templates for specific fields.
 * @param collectionName The name of the collection to check.
 * @param fieldsToCheck Array of fields to check for in the templates. Defaults to a predefined set.
 * @returns Promise<object> A multidimensional object with schema names and templates containing the relevant fields.
 */
export async function getSchemasWithFields(collectionName: string, fieldsToCheck: string[] = defaultFields): Promise<object> {
    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
        const schemas = await explorerApi.getSchemas({ collection_name: collectionName });

        console.log("schemas found");
        
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


export async function getTemplatesWithFields(collectionName: string, fieldsToCheck: string[] = defaultFields): Promise<object> {
    try {
        const schemaFieldData = await getSchemasWithFields(collectionName, fieldsToCheck);
        return schemaFieldData;
    } catch (error) {
        console.log('Error retrieving templates with fields:', error);
    }
}


export async function getNFTsWithFields(collectionName: string, fieldsToCheck: string[] = defaultFields): Promise<any[]> {
    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
        const verifiedSchemas = await getSchemasWithFields(collectionName);
        const nfts = await explorerApi.getAssets({ collection_name: collectionName });

        return nfts.filter(nft => {
            const schemaName = nft.schema.schema_name;
            const templateId = nft.template.template_id;
            return verifiedSchemas[schemaName] && verifiedSchemas[schemaName][templateId];
        });
    } catch (error) {
        console.log('Error retrieving NFTs with fields:', error);
    }
}
