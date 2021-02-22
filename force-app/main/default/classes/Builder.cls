public with sharing class Builder {

    @AuraEnabled
    public static String buildQueryWithFilters(Map<String, String> mainFilter, List<Map<String, String>> relatedFilters) {
        // get the Main Record Name
        String recordName = mainFilter.get('recordName');

        List<Filter> filters = new List<Filter>();

        // add filters for Main Record search
        for (String key : mainFilter.keySet()) {
            if (key == 'recordName') {
                continue;
            }

            filters.add(new Filter(key, mainFilter.get(key)));
        }

        // add filters for Related Records search
        for (Map<String, String> relatedFilter : relatedFilters) {
            String relRecordName = relatedFilter.get('recordName');
            String lookupFieldName = relatedFilter.get('lookupFieldName');
            for (String key : relatedFilter.keySet()) {
                if (key == 'recordName' || key == 'lookupFieldName') {
                    continue;
                }

                filters.add(new Filter(key, relatedFilter.get(key), relRecordName, lookupFieldName));
            }
        }

        return buildQuery(recordName, filters);
    }

    @AuraEnabled
    public static String buildQuery(String sObjectName, List<Filter> filters) {
        String query = 'SELECT Id, Name FROM ' + sObjectName;
        if (!filters.isEmpty()) {
            query += ' WHERE ';
            for (Filter filter : filters) {
                query += filter.toString() + ' AND ';
            }
            query = query.removeEnd(' AND ');
        }
        return query;
    }


//    @AuraEnabled
//    public static String buildSimpleQuery(String aName, String cName) {
//        return buildQuery('Account', new List<Filter> {
//                new Filter('Name', aName),
//                new Filter('LastName', cName, 'Contact', Contact.AccountId.getDescribe().getName())
//        });
//    }


    @AuraEnabled(Cacheable=true)
    public static List<SObject> getRecords(String query) {
        return Database.query(query);
    }

//    @AuraEnabled
//    public static Filter test() {
//        return new Filter('LastName', 'John', 'Contact', Contact.AccountId.getDescribe());
//    }

}