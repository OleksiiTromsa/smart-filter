import {LightningElement, api} from 'lwc';

export default class FilterRecord extends LightningElement {
    slotTitleClass;
    relText;

    @api recordName;
    @api lookupFieldName;

    _fields;


    @api set fields(v) {
        this._fields = v.split(',');
    }

    get fields() {
        return this._fields;
    }

    _state = {};

    getState() {
        return this._state;
    }

    saveState(fieldName, fieldValue) {
        this._state['recordName'] = this.recordName;
        this._state['lookupFieldName'] = this.lookupFieldName;
        this._state[fieldName] = fieldValue;
    }

    fieldChanged(e) {
        // todo get field name from e

        this.saveState(e.target.label, e.target.value);

        this.dispatch();
    }

    dispatch() {
        const state = this.getState();
        this.dispatchEvent(new CustomEvent('changed', {detail: state}));
    }

    handleSlotChange(evt){

        const slot = evt.target;
        const hasTitle = slot.assignedElements().length !== 0;

        this.slotTitleClass = hasTitle ? 'record-cont' : '';
        this.relText = hasTitle ? 'Related' : '';
    }

}