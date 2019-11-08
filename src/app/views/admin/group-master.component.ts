// Group Master - Admin Module

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule
  ]
})

@Component({
  templateUrl: 'group-master.component.html'
})
export class GroupMasterComponent {

  groupInput = new FormGroup({
    groupName: new FormControl('', Validators.required),
    groupDesc: new FormControl('', Validators.required)
  }) ;

  // Array to hold dynamic data - Current Groups
  currentGroups = [
    {groupName: "adm", groupDesc: "Admin Group"},
    {groupName: "cas", groupDesc: "Cashier Group"},
    {groupName: "usr", groupDesc: "User Group"}
  ] ;

  save(){}

  find(){}

  clear(){
    this.groupInput.reset() ;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

}
