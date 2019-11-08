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
  templateUrl: 'bank-statement-posting.component.html'
})
export class BankStatementPostingComponent {

  detailInput = new FormGroup({
    branchCode: new FormControl('', Validators.required),
    fromDate: new FormControl('2018-09-01', Validators.required),
    toDate: new FormControl('2018-09-30', Validators.required)
  });

  detailReport(){
    console.table(this.detailInput.value) ;

    // form-processing code
  }

}
