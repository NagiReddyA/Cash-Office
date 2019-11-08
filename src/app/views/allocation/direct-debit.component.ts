// Direct Debit Processing - Allocation Module 

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule

    , FormArray, FormBuilder
]
})

@Component({
  templateUrl: './direct-debit.component.html'
})
export class DirectDebitComponent {

  today = new Date() ;

  bnkAccDetails = new FormGroup({
    paymentMode: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
    creationDate: new FormControl({value:"2018-09-01", disabled: true}),
    modifiedDate: new FormControl({value:"2018-09-30", disabled: true}),

    bankStatementID: new FormControl('', Validators.pattern("^[0-9]*$") ),
    accountNo: new FormControl({value:'', disabled: true}), // , Validators.required), // auto-filled
    accountDesc: new FormControl({value:'', disabled: true}) // , Validators.required) // auto-filled

  }) ;

  // Array to hold dynamic data - Bank Account Details
  banks = [
    {bankName:"Bank ABC", accountNo:"ABC-2018", accountDesc: "Bank ABC Satellite", creation: "2013-01-01", 
      modified: "2016-08-24"},
    {bankName:"Bank Gaborone", accountNo:"BG-01234", accountDesc: " Bank GC Main Mall", creation: "2015-06-11", 
      modified: "2018-03-31"},
    {bankName:"Bank of Baroda", accountNo:"BB-43210", accountDesc: "Baroda RailPark ATM", creation: "2017-01-21", 
      modified: "2014-10-10"}
  ];

  bnkStmtDetails = new FormGroup({
    statementNo: new FormControl('', Validators.required),
    fromDate: new FormControl("2018-09-01", Validators.required),
    openingBalance: new FormControl('', Validators.required),
    reversalPeriod: new FormControl("2018-04-30"),
    branch: new FormControl({value: '', disabled: true}),

    // bankStatementID: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$") ] ),
    postingStatus: new FormControl({value:'', disabled: true}),
    toDate: new FormControl('2018-09-30', Validators.required),
    closingBalance: new FormControl('', Validators.required),
    loginName: new FormControl({value: '', disabled: true})

  }) ;

  // Array to hold dynamic data - Bank Statement Details
  // statements = [
    // { stmtID: "210", bankName: "First Nation Bank", stmtNo: "FNB42/12012019", accNo: "4638001", 
      // accDesc: "DDE Collection Account", period: "21-Jan-2017", strikeDate: "21-Mar-17", allocatedAmount: 451.05}
    // ]

  // Dynamic Data - Branch/login-name
  loginName = "user1" ;
  branch = "Gaborone Head Office";
  postingStatus = "UNPOSTED" ;

  // bgn: Complete Editable Table

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

      // DDE/EFT 
      corTransType: [],
      corSelect:[],
      corPolicyCode: [],
      corPeriod: [],
      corPartyID: [],
      corPayerName: [],
      corExpectedAmnt: [],
      corPurpose: [],
      corAllocatedAmnt: []

      // Policy Exclusions
      , corPolicyStatus: []

      // Reversals
      // , uploadReversal: []

      // Sundry
      , corSundryDescription: []
      , corTransDate: []
      
    })

    this.correctionForms.push(correction);
  }

  deleteCorrection(i) {
    this.correctionForms.removeAt(i) ;
  }

  // end: Complete Editable Table

  // Dynamic Data - Tab Totals
  totalDDE: number ; 
  totalExclusions: number ; 
  totalReversals: number ; 
  totalSundry: number ; 
  totalUnspecified: number ; 

  // Controls

  cancel(){}

  clear(){}

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }
  
  print(){
    console.table(this.myForm.get('corrections').value) ; // dbg
  }

  save(){}

  search(){}

}
