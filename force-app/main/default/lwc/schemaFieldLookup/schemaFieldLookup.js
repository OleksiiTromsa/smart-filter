import { LightningElement, wire, track, api } from "lwc";
import getFields from '@salesforce/apex/DynamicLookupApi.getFieldsInfo';
import getChildRelationships from '@salesforce/apex/DynamicLookupApi.getChildRelationships';
export default class SchemaFieldLookup extends LightningElement {

  @api sobjectName = 'Account';
  @api isRelationship;

  @track fieldOptions;
  @track childOptions;
  @track childRelationOptions;
  fieldsResponse;
  childResponse;
  @wire(getFields, {sobjectName: '$sobjectName'})
  setFields({error, data}) {
    this.fieldsResponse = {error, data};
    if (data) {
      this.fieldOptions = this.processFields(data);
      console.log([...this.fieldOptions]);
    }
  }
  @wire(getChildRelationships, {sobjectName: '$sobjectName'})
  childRelationships({error, data}) {
    this.childResponse = {error, data};
    if (data) {
      console.log([...data]);
      this.childOptions = data.map((_, index) => Object.assign({
        label: _.sobjectLabel,
        value: _.sobjectName
      }))
      console.log(JSON.parse(JSON.stringify(this.childOptions)));
    }
  }

  handleCheckboxChange(event) {
    this.isRelationship = event.target.checked;
  }
  field;
  relationship;
  relationshipField;
  onChange(event) {
    this[event.target.dataset.name] = event.target.value;
    console.log(event.target.dataset.name, event.target.value);
  }

  async onRelationshipChange(event) {
    this.onChange(event);

    this.childRelationOptions = this.processFields(await getFields({sobjectName: event.target.value}));
  }

  processFields(data) {
    return data.map((_, index) => Object.assign({
      label: _.label,
      value: _.name
    }));
  }

  addField() {
    const response = {
      isRelation: this.isRelationship
    };

    if (this.isRelationship) {
      response.filterField = this.relationshipField;
      response.relatedField = this.childResponse.data.find(_ => _.sobjectName === this.relationship).relatedFieldName;
      response.sobjectName = this.relationship;
    } else {
      response.filterField = this.field;
    }

    console.log(response);

    this.dispatchEvent(new CustomEvent('submit', {
      detail: response
    }));
  }
}

