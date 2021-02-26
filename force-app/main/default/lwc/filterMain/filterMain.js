import {LightningElement, track} from 'lwc';
import buildQuery from "@salesforce/apex/Builder.buildQueryWithFilters"

export default class FilterAccounts extends LightningElement {

    query = '';

    mainFilter = {};
    relatedFilters = [];

    @track
    mainFields = [
            {label: 'Name', isText: 'true', isCheckbox: false, isPicklist: false},
            {label: 'Phone', isText: 'true', isCheckbox: false, isPicklist: false}
        ];

    relatedConfig = [
        {
            name: 'Contact',
            lookup: 'AccountId',
            fields: [{label: 'LastName', isText: 'true', isCheckbox: false, isPicklist: false},
                {label: 'Phone', isText: 'true', isCheckbox: false, isPicklist: false}]
        },
        {
            name: 'Opportunity',
            lookup: 'AccountId',
            fields: [{label: 'Amount', isText: 'true', isCheckbox: false, isPicklist: false},
                {label: 'StageName', isText: 'true', isCheckbox: false, isPicklist: false}]
        }
    ];

    search() {

        console.log(JSON.stringify(this.mainFilter, null, 4));
        console.log(JSON.stringify(this.relatedFilters, null, 4));

        buildQuery({mainFilter: this.mainFilter, relatedFilters: this.relatedFilters})
            .then(res => {
                this.query = res;
                this.queryChanged();
            })
            .catch(e => {
                console.log(e);
            });

    }

    mainFilterChanged(e) {
        // console.log(JSON.stringify(this.mainFilter));
        this.mainFilter = e.detail;
    }

    relatedFilterChanged(e) {
        // remove previous state
        let rel = this.relatedFilters.filter(el => el.recordName !== e.detail.recordName);

        // add new version of record state
        rel.push(e.detail);

        // assign
        this.relatedFilters = rel;
    }


    queryChanged() {
        this.dispatchEvent(new CustomEvent('querychanged', {detail: this.query}));
    }

    // sObjectType;
    isModalOpen;
    isRel;
    promptAddField(e) {
        console.log(e);
        console.log(e.target.dataset);
        console.log(e.target.dataset.rel);
        this.isRel = 'true' === e.target.dataset.rel;

        // this.sObjectType = e.target.related.name;

        console.log(this.sObjectType);

        this.isModalOpen = true;
    }

    closeModal(){
        this.isModalOpen = false;
    }

    submitDetails(e) {
    }


    modalSubmitted(e) {
        console.log('modalSubmitted');
        // console.log(e.detail.fieldType);
        // console.log(e.detail.picklistValues);

        if(e.detail.isRelation) {
            console.log(JSON.stringify(this.relatedConfig));

            if (this.relatedConfig.find(_ => _.name === e.detail.sobjectName)) {
                this.relatedConfig.fields.push({label: e.detail.filterField, isText: 'true', isCheckbox: false, isPicklist: false});
            } else {
                this.relatedConfig.push({name: e.detail.sobjectName, lookup: e.detail.relatedField,
                    fields: [{label: e.detail.filterField, isText: 'true', isCheckbox: false, isPicklist: false}]});
            }
            console.log(JSON.stringify(this.relatedConfig));

        } else {
            // this.mainFields = this.mainFields + ',' + e.detail.filterField;
            // let field = {label: e.detail.filterField};
            console.log('detail.type');
            console.log(e.detail.fieldType);
            if (e.detail.fieldType === 'BOOLEAN') {
                this.mainFields.push({label: e.detail.filterField, isText: false, isCheckbox: true, isPicklist: false});
            } else if (e.detail.fieldType === 'PICKLIST') {
                let plv = [];
                e.detail.picklistValues.forEach( a => plv.push({label: a.toString(), value: a.toString()}))
                console.log('plv');
                console.log(plv);
                this.mainFields.push({label: e.detail.filterField, isText: false, isCheckbox: false, isPicklist: true, picklistValues: plv});
            } else {
                this.mainFields.push({label: e.detail.filterField, isText: true, isCheckbox: false, isPicklist: false});
            }
            console.log('mainfields');
            console.log(this.mainFields);
            // this.mainFields.push(field);
            // this.mainFields.push({label: e.detail.filterField, type: 'checkbox'});

        }
    }
}