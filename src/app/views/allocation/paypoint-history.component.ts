// TO-DO: Data - what goes for field3/item3 ? 

import { Component,NgModule, OnInit } from '@angular/core';
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
  templateUrl: './paypoint-history.component.html'
})
export class PaypointHistoryComponent {

  detailInput = new FormGroup({
    paypointID: new FormControl('', Validators.required),
    
    paypointName: new FormControl({value:"", disabled: true}),

    field3: new FormControl({value:"", disabled: true}) 
  });

  receiptDetail = new FormGroup({
    collPeriod: new FormControl('2018-09-01'),
    
    receiptNo: new FormControl({value:"", disabled: true}),

    rcptAmnt: new FormControl({value:"", disabled: true}) ,

    rcptDate: new FormControl('2018-09-30')
  });

  // Array to hold Dynamic Data - Paypoints:
  paypoints = [ 
    {ppID:123, ppName: "Air Botswana", item3: "AB-231"},
    {ppID:456, ppName: "Botswana Post", item3: "BP-232"},
    {ppID:789, ppName: "Botswana Railways", item3: "BR-233"}
  ];

  // An Array to hold dynamic data - Collection History:  
  collections = [
    {
      collID: 20, xpectedAmount: 210.61, transType: "Premium Allocation", policyID: "210611", period: "2012-06-21",
       comments: "Unprocessed Allocation", amount: 432.11, collStatus: "C", receiptNo: 123456, collPeriod: "2012-06-21"
    },
    {
      collID: 14, xpectedAmount: 270.41, transType: "Reverse Offset", policyID: "210617", period: "2013-06-21",
       comments: "Review the Allocation", amount: 114.32, collStatus: "D", receiptNo: 123457, collPeriod: "2013-06-21"
    },
    {
      collID: 12, xpectedAmount: 240.84, transType: "Premium Allocation", policyID: "210618", period: "2014-06-21",
       comments: "Unprocessed Allocation", amount: 413.12, collStatus: "C", receiptNo: 123458, collPeriod: "2014-06-21"
    }
  ]

  showDetail = false ;

  selectedItem: any ; // placeholder for a specific collection item

  onSelect(x){
    this.selectedItem = x ;
    this.showDetail = true ;
  }

  clear(){
    //window.location.reload() ;
    this.detailInput.reset();
    this.showDetail = false ;

  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
    
  }

}