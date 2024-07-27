function(properties, context) {
    let jsonStructure;
    let error = null;
    let mergedString = properties.input_string;
    let tagFormat = properties.tag_format;
    let replaceMissingWithEmpty = properties.replace_missing_with_empty;
    let missingFields = [];

    // Function to get nested object value using dot notation
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return (current && current[key] !== undefined) ? current[key] : undefined;
        }, obj);
    }

    // Parse the JSON structure
    try {
        jsonStructure = JSON.parse(properties.json_structure);
    } catch (e) {
        error = "Invalid JSON structure";
    }

    // Ensure tag format includes a placeholder
    if (!error && !tagFormat.includes("tag")) {
        error = "Tag format must include 'tag' as a placeholder.";
    }

    // Perform bulk find and replace if no errors so far
    if (!error) {
        try {
            // Escape special regex characters in the tag format, except for the "tag" placeholder
            let escapedTagFormat = tagFormat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace('tag', '(.+?)');
            let regex = new RegExp(escapedTagFormat, 'g');
            
            mergedString = mergedString.replace(regex, (match, tag) => {
                let value = getNestedValue(jsonStructure, tag.trim());
                if (value === undefined) {
                    missingFields.push(tag.trim());
                    return replaceMissingWithEmpty ? "" : match;
                }
                return value;
            });
        } catch (e) {
            error = "Error during replacement";
        }
    }

    // Return the merged string, any error, and the list of missing merge fields
    return {
        merged_string: error ? null : mergedString,
        error: error,
        missing_merge_fields: missingFields
    };
}