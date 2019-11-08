// Bank Statement Posting - Allocation Module 

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators
]
})

@Component({
  templateUrl: 'bank-posting.component.html'
})
export class BankPostingComponent {

  bankStatementID = new FormControl('', Validators.required) ;

  clear(){
    this.bankStatementID.reset() ;
  } 

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

  post(){}

  search(x){}

}
