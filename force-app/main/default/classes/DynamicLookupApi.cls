public with sharing class DynamicLookupApi {

    @AuraEnabled(Cacheable=true)
    public static List<Field> getFieldsInfo(String sobjectName) {
        List<Field> result = new List<Field>();

        for (SObjectField sObjectField : Schema.getGlobalDescribe().get(sobjectName).getDescribe().fields.getMap().values()) {
            result.add(new Field(sObjectField.getDescribe()));
        }

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

        public Field(DescribeFieldResult describeFieldResult) {
            this.label = describeFieldResult.label;
            this.name = describeFieldResult.name;
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
