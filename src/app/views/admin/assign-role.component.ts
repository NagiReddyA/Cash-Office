// Assign Role - Admin Module 

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
  templateUrl: 'assign-role.component.html'
})
export class AssignRoleComponent {

  roleInput = new FormGroup({
    roleID: new FormControl('', Validators.required),
    
    roleDesc: new FormControl('', Validators.required),
   
  }) ;
  roleInput2 = new FormGroup({

    roleID1: new FormControl('', Validators.required),
    roleDesc1: new FormControl('', Validators.required),
    groupCode: new FormControl('', Validators.required),
    

  });

  // Array to hold dynamic data - Current Roles
  currentRoles = [
    {roleID: "role_adm_cash", roleName: "Admin Authority for Cash Office",groupID:21,groupName:"Cash Office Admin",enable:"true"},
 
  ] ;

  displayPopUp = false;

  save(){}

  find(){}

  assignRole(){

    this.displayPopUp = true;
  }

  clear(){
    this.roleInput.reset() ;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

}
