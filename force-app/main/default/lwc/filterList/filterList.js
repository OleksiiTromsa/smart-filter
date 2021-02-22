import { LightningElement, wire, api } from 'lwc';
import getRecords from '@salesforce/apex/Builder.getRecords';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Type', fieldName: 'Type'}
];

export default class FilterList extends LightningElement {
    columns = columns;

    @api query;// = 'SELECT Id, Name, Website, Phone, Type FROM Account WHERE Name = \'Google\' AND Id IN (SELECT AccountId FROM Contact WHERE LastName = \'John\')\n';

    @wire(getRecords, {query: '$query'}) res;

}
