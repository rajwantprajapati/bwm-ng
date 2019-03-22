module.exports = {
    normalizeErrors: function(errors){
        let normalizeErrors = [];
        Object.keys(errors).forEach(function(property){
            normalizeErrors.push({title: property, detail: errors[property].message});
        });
        return normalizeErrors;
    }
}