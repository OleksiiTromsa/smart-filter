import { LightningElement, wire, track, api } from "lwc";
import getFields from '@salesforce/apex/DynamicLookupApi.getFieldsInfo';
import getChildRelationships from '@salesforce/apex/DynamicLookupApi.getChildRelationships';
export default class SchemaFieldLookup extends LightningElement {

  // @api sobjectName = 'Account';
  @api sobjectName;
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
      console.log('setFields');
      console.log(data);
      console.log(this.fieldOptions);
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
    console.log('onChange');
    this[event.target.dataset.name] = event.target.value;

    let val = event.target.value;
    console.log(val);
    // if(this.fieldOptions && event && event.target) {
      if (!this.isRelationship) {
        let chosenOption = this.fieldOptions.find(e => e.value === val);
        this['type'] = chosenOption.type;
        this['picklistValues'] = chosenOption.picklistValues.slice();
      }
    // }
  }

  async onRelationshipChange(event) {
    this.onChange(event);

    this.childRelationOptions = this.processFields(await getFields({sobjectName: event.target.value}));
  }

  processFields(data) {
    console.log('processFields');
    console.log(data);
    return data.map((_, index) => Object.assign({

      label: _.label,
      value: _.name,
      type: _.type,
      picklistValues: _.picklistValues
    }));

  }

  addField() {
    console.log('Add field');
    const response = {
      isRelation: this.isRelationship
    };

    if (this.isRelationship) {

      response.filterField = this.relationshipField;
      response.relatedField = this.childResponse.data.find(_ => _.sobjectName === this.relationship).relatedFieldName;
      response.sobjectName = this.relationship;
    } else {
      response.filterField = this.field;
      response.fieldType = this.type;
      response.picklistValues = this.picklistValues.slice();
    }
    console.log('addFieldResponse:')
    console.log(response);

    this.dispatchEvent(new CustomEvent('submit', {
      detail: response
    }));
  }
}

