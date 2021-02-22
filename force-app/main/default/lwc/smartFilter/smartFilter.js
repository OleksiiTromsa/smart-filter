import {LightningElement} from 'lwc';

export default class SmartFilter extends LightningElement {

    query;// = 'SELECT Id, Name, Website, Phone, Type FROM Account WHERE Name = \'Google\' AND Id IN (SELECT AccountId FROM Contact WHERE LastName = \'John\')\n';

    setQuery(e) {
        console.log(e.detail);
        this.query = e.detail;
    }
}
