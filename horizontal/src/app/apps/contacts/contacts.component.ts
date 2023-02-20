import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from './contact';
import { ContactService } from './contact.service';



@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

    public showSidebar = false;

    contacts = this.contactService.getContacts();
    selectedContact: Contact;
    show: boolean = true;
    editSave: string = 'Edit';

    filterArray;
    
    _searchTerm: string;
 
    mobileSidebar() {
        this.showSidebar = !this.showSidebar;
    } 

    get searchTerm(): string {
        return this._searchTerm;
    }
    set searchTerm(val: string) {
        this._searchTerm = val;
        this.filterArray = this.filter(val);
    }

    filter(v: string) {
        return this.contacts.filter(x => x.firstName.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.lastName.toLowerCase().indexOf(v.toLowerCase()) !== -1);
    }

    constructor(public contactService: ContactService) {
    }

    ngOnInit() {
        this.filterArray = this.contacts;
        if (this.contacts.length > 0)
            this.onSelect(this.contacts[0]);
    }


    onSelect(contact) {
        this.selectedContact = contact;
    }

    editContact() {
        if (this.editSave == "Save") {
            this.show = true;
            this.editSave = 'Edit';
        }
        else {
            this.show = false;
            this.editSave = 'Save';
        }
    }

    addContact() {
        this.contacts.push({
            firstName: 'Enter',
            lastName: 'Name',
            mobile: '',
            home: '',
            company: '',
            work: '',
            notes: '',
            imagePath: 'assets/images/users/1.jpg'
        });

        this.filterArray = this.contacts;
        this.selectedContact = this.filterArray[this.filterArray.length - 1];
        this.editContact();
    }

    deleteContact(i) {
        this.contacts = this.contacts.filter(con => con.firstName !== i.firstName);
        this.filterArray = this.contacts.filter(con => con.firstName !== i.firstName);
        //if(this.filterArray.length>0)
        this.selectedContact = null;


    }
  

}
