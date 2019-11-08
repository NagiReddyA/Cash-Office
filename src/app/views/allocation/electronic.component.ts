// Electroninc Allocation - Allocation Module

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
  templateUrl: 'electronic.component.html'
})
export class ElectronicComponent {

  electronicInput = new FormGroup({
    paypointID: new FormControl('', Validators.required),
    creditFile: new FormControl('', Validators.required),
    receiptNo: new FormControl('', Validators.required),
    receiptPeriod: new FormControl({value:"", disabled: true}),
    statementNo: new FormControl('', Validators.required),
    statementPeriod: new FormControl({value:"", disabled: true}),
    allocatedPeriod: new FormControl('2018-09-30', Validators.required),

    // 2nd column - Auto-filled Fields
    paypointName: new FormControl({value:"", disabled: true}),
    creditFileAmount: new FormControl({value:"", disabled: true}),
    grossAmountReceipt: new FormControl({value:"", disabled: true}),
    grossAmountStatement: new FormControl({value:"", disabled: true}),
    
  });

  electronicAllocation(){
    console.table(this.electronicInput.value) ; //dbg
    this.electronicInput.disable() ; 

  }

today = new Date() ;

  onSubmit(){
    this.displayAllocation = true ; // show container for the results
  
    console.table(this.electronicInput.value) ;

  }

  displayAllocation = false ;

  allocate(){ 
    this.displayAllocation = true ;
    this.electronicInput.disable() ; 
  }

  clear(){
    window.location.reload() ;
  }

  exit(){
    // Re-load or do something else /?
    window.location.reload() ;
  }
  
  // Array to hold Dynamic Data - Paypoints:
  paypoints = [ 
    {ppID:123, ppName: "Air Botswana"},
    {ppID:456, ppName: "Botswana Post"},
    {ppID:789, ppName: "Botswana Railways"}
  ];

  // Array to hold Dynamic Data - Credit Files:
  creditFiles = [
    {crFileNo: 249, crFileAmnt: 250.12},
    {crFileNo: 351, crFileAmnt: 352.34},
    {crFileNo: 462, crFileAmnt: 563.45}
  ]
  
  // Array to hold Dynamic Data - Credit Files:
  receipts = [
    {rctNo: 244, rctAmnt: 210.12, rctPeriod: "01-Jan-2012"},
    {rctNo: 355, rctAmnt: 312.34, rctPeriod: "01-Jun-2014"},
    {rctNo: 466, rctAmnt: 513.45, rctPeriod: "01-Jan-2016"}
  ]
  
  // Array to hold Dynamic Data - Statements:
  statements = [
    {stmtNo: 247, stmtAmnt: 210.12, stmtPeriod: "07-Jan-2012"},
    {stmtNo: 357, stmtAmnt: 312.34, stmtPeriod: "07-Jun-2014"},
    {stmtNo: 467, stmtAmnt: 513.45, stmtPeriod: "07-Jan-2016"}
  ]

  // // Dynamic Data: 
  // receivedFrom = "Janet Dozen" ; 
  // sum = 678.90 ;
  // paymentType = "CSH" ;
  // date = "21-Jun-11" ;
  // branchCode = "102" ;
  // cashier = "Janelle Dose" ;

  // // An Array to hold dynamic data - Receipts
  // receipts = [
  //   { application: "Group Life System", transactionType: "Group Funeral Premium Receipts", paypointID: "", paypointName: "", amount: "123.45"},
  //   { application: "Policy", transactionType: "Credit Class Premiums", policyNo: "1234567", payer: "John Doe", period: "21-Jun-11", amount: "678.90"},
  //   { application: "Sundry Receipts", transactionType: "Sundry Re-imbursement of Staff Advances", amount: "101.11"}
  // ]

  // // An Array to hold dynamic data - Bank Statements
  // bankStatement =
  //   { bankAccNo: 747, bankStmID: 243, stmtNo: 10932, fromDate: "27-Jul-14", toDate: "27-Aug-14",
  //     openingBalance: 442.11, bankName: "Ftown Bank", inputDate: "08-Aug-14", cashierCode: 256, 
  //     cashierName: "Al Gore", closingBalance: 452.45 }
  
  // // An Array to hold dynamic data - Statment Transations
  // stmTransactions = [
  //   {bankStmID: 243, transDesc: "Auto Transfers", policyNo: "", policyPayor:"", payMode:"BSO", amount: 532.99},
  //   {bankStmID: 247, transDesc: "Bank Charges", policyNo: "", policyPayor:"", payMode:"BSO", amount: 232.61},
  //   {bankStmID: 243, transDesc: "Premium Receipts", policyNo: "", policyPayor:"", payMode:"BSO", amount: 362.55},
  //   {bankStmID: 243, transDesc: "Bank Charges", policyNo: "", policyPayor:"", payMode:"BSO", amount: 232.61}    
  // ]

  // netMovement: number = 
  //   this.stmTransactions.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.amount}, 0 ) ;

}
