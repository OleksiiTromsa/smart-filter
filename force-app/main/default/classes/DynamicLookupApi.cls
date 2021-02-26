public with sharing class DynamicLookupApi {

    @AuraEnabled(Cacheable=true)
    public static List<Field> getFieldsInfo(String sobjectName) {
        List<Field> result = new List<Field>();

        for (SObjectField sObjectField : Schema.getGlobalDescribe().get(sobjectName).getDescribe().fields.getMap().values()) {
//            Field f = new Field(sObjectField.getDescribe());
//            System.debug(sObjectField.getDescribe());
            result.add(new Field(sObjectField.getDescribe()));
        }

        System.debug(result);
        return result;
    }

    @AuraEnabled(Cacheable=true)
    public static List<ChildRelationship> getChildRelationships(String sobjectName) {
        List<ChildRelationship> result = new List<ChildRelationship>();

        for (Schema.ChildRelationship childRelationship : Schema.getGlobalDescribe().get(sobjectName).getDescribe().childRelationships) {
            result.add(new ChildRelationship(childRelationship));
        }
        return result;
    }

    public class Field {
        @AuraEnabled public String label;
        @AuraEnabled public String name;
        @AuraEnabled public String type;
        @AuraEnabled public List<String> picklistValues = new List<String>();

        public Field(DescribeFieldResult describeFieldResult) {
            this.label = describeFieldResult.label;
            this.name = describeFieldResult.name;
            this.type = describeFieldResult.type + '';

            if (this.type == 'PICKLIST') {
                List<Schema.PicklistEntry> picklistEntries = describeFieldResult.getPicklistValues();
                for(Schema.PicklistEntry ple : picklistEntries) {
                    this.picklistValues.add(ple.getLabel());
                }
            }
        }

    }

    public class ChildRelationship {
        @AuraEnabled public String relatedFieldName;
        @AuraEnabled public String sobjectName;
        @AuraEnabled public String sobjectLabel;

        public ChildRelationship(Schema.ChildRelationship childRelationship) {
            this.relatedFieldName = childRelationship.field.getDescribe().name;
            this.sobjectName = childRelationship.childSObject.getDescribe().name;
            this.sobjectLabel = childRelationship.childSObject.getDescribe().label;
        }
    }


}

