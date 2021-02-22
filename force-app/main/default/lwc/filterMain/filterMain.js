import {LightningElement} from 'lwc';
import buildQuery from "@salesforce/apex/Builder.buildQueryWithFilters"

export default class FilterAccounts extends LightningElement {

    query = '';

    mainFilter = {};
    relatedFilters = [];

    mainFields = 'Name,Phone';

    relatedConfig = [
        {
            name: 'Contact',
            lookup: 'AccountId',
            fields: 'LastName,Phone'
        },
        {
            name: 'Opportunity',
            lookup: 'AccountId',
            fields: 'Amount,StageName'
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

    isModalOpen;
    isRel;
    promptAddField(e) {
        console.log(e);
        this.isRel = 'true' === e.target.dataset.rel;

        this.isModalOpen = true;

    }

    closeModal(){
        this.isModalOpen = false;
    }

    submitDetails(e) {
    }


    modalSubmitted(e) {
        console.log(e.detail.filterField);

        if(e.detail.isRelation) {

        } else {
            this.mainFields = this.mainFields + ',' + e.detail.filterField;
        }
    }
}