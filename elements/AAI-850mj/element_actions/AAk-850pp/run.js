function(instance, properties, context) {
    // Reset workflow output
    instance.publishState('workflow_result', null);
    instance.publishState('workflow_error', null);
    instance.publishState('workflow_missing_fields', null);

    // Reset element output
    instance.publishState('resulting_string', null);
    instance.publishState('error', null);
    instance.publishState('missing_merge_fields', null);

    // Reset any other states you might have
    instance.data.jsonObject = {};
    instance.data.mergeString = "";
    instance.data.resultingString = "";
    instance.data.replaceMissingWithEmpty = false;
}