// Bank Statement Adjustment Voucher - Allocation Module

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators
  
  , FormArray, FormBuilder]
})

@Component({
  templateUrl: 'bank-adjustment.component.html'
})
export class BankAdjustmentComponent {

  bankStatementID = new FormControl('', Validators.required) ;

  bnkAccDetails = new FormGroup({
    paymentMode: new FormControl({value:'', disabled: true}),
    creationDate: new FormControl({value:"2018-09-01", disabled: true}),
    modifiedDate: new FormControl({value:"2018-09-30", disabled: true}),

    bankName: new FormControl({value:'', disabled: true}),
    accountNo: new FormControl({value:'', disabled: true}),
    accountDesc: new FormControl({value:'', disabled: true})

  }) ;

  searchSucceeded: boolean = false ;

  clear(){
    // clearing code here: 

    this.searchSucceeded = false ; // hide control buttons
  }

  post(){}

  search(x){
    console.log('Searching ' + x) ; // dbg

    // form-processing code here: 

    this.searchSucceeded = true ; // show control buttons
  }

  bnkStmtDetails = new FormGroup({
    statementNo: new FormControl({value: '', disabled: true}),
    fromDate: new FormControl({value: '2018-09-01', disabled: true }),
    openingBalance: new FormControl({value: '', disabled: true}),

    postingStatus: new FormControl({value:'', disabled: true}),
    toDate: new FormControl({value: '2018-09-30', disabled: true }),
    closingBalance: new FormControl({value: '', disabled: true}),

    glPostingStatus: new FormControl({value:'', disabled: true}),
    loginName: new FormControl({value: '', disabled: true}),
    branch: new FormControl({value: '', disabled: true})

  }) ;

  // Array to hold dynamic data - Unspecified allocations
  unspecifieds = [
    {
      transType: "CRE", policyCode: "100210611", description: "Premium Allocation", policyID: "210611", 
       comments: "Unprocessed Allocation", amount: 432.11, glPostingStatus: "", bobiRefNo: 123456, period: "2012-06-21"
    },
    {
      transType: "LRE", policyCode: "100210617", description: "Class Premium Receipts", policyID: "210617", 
       comments: "Review the Allocation", amount: 114.32, glPostingStatus: "", bobiRefNo: 123457, period: "2013-06-21"
    },
    {
      transType: "LRX", policyCode: "100210618", description: "Premium Allocation", policyID: "210618", 
       comments: "Unprocessed Allocation", amount: 413.12, glPostingStatus: "", bobiRefNo: 123458, period: "2014-06-21"
    }
  ]

  // Array to hold dynamic data - Re-allocations
  reallocations = [
    {
      transType: "CRE", description: "Premium Allocation", policyID: "210611", application: "TPOL", activity:"",
       payor: "Jane Doe", amount: 432.11, rPostingStatus: "POSTED", refNo: 123456, period: "2012-06-21", refStatus: "Terminated",
    },
    {
      transType: "LRE", description: "Class Premium Receipts", policyID: "210617", application: "ACL", activity:"",
       payor: "Janelle Done", amount: 114.32, rPostingStatus: "UNPOSTED", refNo: 123457, period: "2013-06-21", refStatus: "SETTLED",
    },
    {
      transType: "LRX", description: "Premium Allocation", policyID: "210618", application: "TPOL", activity:"",
       payor: "Jane Doe", amount: 413.12, rPostingStatus: "POSTED", refNo: 123458, period: "2014-06-21", refStatus: "Terminated",
    }
  ]

  // Dynamic Data - Unspecified Totals
  unallocatedCRE: number ;
  unallocatedLRE: number ;
  unallocatedCRX: number ;
  unallocatedLRX: number ;

  // Dynamic Data - Re-allocation Totals
  reallocatedCRE: number ;
  reallocatedLRE: number ;
  reallocatedCRX: number ;
  reallocatedLRX: number ;

  // bgn: editble table

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
      corApplication: [],
corActivity: [],
corPeriod: [],
corRefNo: [],
corRefStatus: [],
corPayor: [],
corTransType: [],
corAmount: [],
corRPostingStatus: []
      
    })

    this.correctionForms.push(correction);
  }

  deleteCorrection(i) {
    this.correctionForms.removeAt(i)
  }

  // end: editable table

  // Dynamic Data - Branch/login-name
  loginName = "user1" ;
  branch = "Gaborone Head Office";
  postingStatus = "UNPOSTED" ;

}
