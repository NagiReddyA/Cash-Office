// Partial MisAllocation Correction - Allocation Module

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators

    , FormArray, FormBuilder
]
})

@Component({
  templateUrl: './partial-correction.component.html'
})
export class PartialCorrectionComponent {
 
  viewMisallocations = false ;
  makeCorrections = true ; // show editable table for "Premium Reallocation" transactions.

  toggleMakeCorrections(transaction_type){
    if ( transaction_type == 'allocate')
    {
      this.makeCorrections = true ;
    }

    if ( transaction_type == 'reverse')
    {
      this.makeCorrections = false ;
    }
  }

  search(x){
    console.log("Searching " + x) ;
    this.viewMisallocations = true ;
  }
    
  misallocatedInput = new FormGroup({
    policyCode: new FormControl('', Validators.required),
    period: new FormControl("2018-09-01", Validators.required),

    misallocationID: new FormControl({value: '', disabled: true}),

    radios: new FormControl(''), // radio button things

    transType: new FormControl('') // radio button things
  }) ;

// An Array to hold dynamic data - Misallocations:  
misallocations = [
  {
    collID: 20, policyCode: "210611", policyStatus: "Terminated", period: "2012-06-21",
     payer: "Jane Doe", amount: 432.11, postingStatus: "T", receiptNo: 123456
  },
  {
    collID: 14, policyCode: "210617", policyStatus: "Terminated", period: "2013-06-21",
     payer: "John Doe", amount: 114.32, postingStatus: "U", receiptNo: 123457
  },
  {
    collID: 12, policyCode: "210618", policyStatus: "Terminated", period: "2014-06-21",
     payer: "Joanne Odin", amount: 413.12, postingStatus: "V", receiptNo: 123458
  }
]

selectedItem: any ; // placeholder for a specific collection item
 
onSelect(x, position) 
{
  this.selectedItem = x ;
  console.log("Selected item No. " + ( position +1 ) ) ; // dbg
}

clear(){
  window.location.reload() ;
}

exit(){
  // Re-direct to app landing page
  window.location.href = "http://localhost:4200/#/dashboard" ;
}

save(){}

myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })

  }

  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  addCorrection() {

    const correction = this.fb.group({ 
      corSelect:[],
      corPolicyCode: [],
      corPeriod: [],
      corPartyID: [],
      corPayerName: [],
      corExpectedAmnt: [],
      corPurpose: [],
      corAllocatedAmnt: []
      
    })

    this.correctionForms.push(correction);
  }

  deleteCorrection(i) {
    this.correctionForms.removeAt(i)
  }

  post(){
    console.table(this.myForm.get('corrections').value) ; // dbg

    // other form-processing code here:
  }

  totalAllocatedAmount: number ;

}