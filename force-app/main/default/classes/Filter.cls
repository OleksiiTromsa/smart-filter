public class Filter {
    public String filterField;
    public String value;
    public String relatedSObject;
    public String relatedSObjectField;

    public Filter(String filterField, String value) {
        this(filterField, value, null, null);
    }
    public Filter(String filterField, String value, String relatedSObject, String relatedField) {
        this.filterField = filterField;
        this.value = value;
        this.relatedSObject = relatedSObject;
        this.relatedSObjectField = relatedField;
    }
    public override String toString() {
        return this.relatedSObject == null ? simpleFilter() :
                'Id IN (SELECT ' + relatedSObjectField + ' FROM ' + relatedSObject + ' WHERE ' + simpleFilter() + ')';
    }
    private String simpleFilter() {
        return filterField + ' = ' + '\'' + value + '\'';
    }

}