// Unmatched Credits - Paypoints Reports Module
// http://localhost:8080/cash/paypoint-reports/unmatched-credits/32&2017-03-01
// TO-DO: Back-end service - MySQL and Spring. inc. retrieving PPIDs and corresponding PPNs
// 649 - ELECTRONIC - HUKUNTSI SUB-DISTRICT COUNCIL - PERM || 508 - STANDARD CHARTERED BANK - DIRECT DEBITS

import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../_nav' ;

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
  templateUrl: 'unmatchedCredit.component.html'
})
export class unmatchedCreditComponent implements OnInit {

  detailInput = new FormGroup({
    PayPointID: new FormControl('', Validators.required),
    Paypoint_Name: new FormControl({value: "", disabled: true}),
    Period: new FormControl('2017-03-01', Validators.required)
  });

  disableForm = false;
  displayReport = false ;
  headerDetails: any ;
  paypointIds: any ;
  receipt_status = "" ;
  today = new Date() ;
  totalUnmatched: number = 0.0 ;
  unmatched_credits: any ;
  url: string = "" ;

  constructor(private http:HttpClient){}

  ngOnInit(){
    
    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.url = apiURL + "/collection-branch/paypoints" ; // returns array-list: {[paypoint_id, paypoint_name]}
   this.http.get(this.url,httpOptions)
    .subscribe((response)=>{
      const obj = response;
      this.paypointIds = obj; 
    }
    ,err => this.handleError(err));
  }

  detailReport(){

    this.detailInput.disable() ;

    let ppid = this.detailInput.get('PayPointID').value[0] ; /// actual fuctionality
    // console.log(this.detailInput.get('PayPointID').value) ;
    console.log(this.detailInput.get('PayPointID').value[0] ) ;
    // console.log(this.detailInput.get('Paypoint_Name').value ) ; // this is not showing PPN /? 
    let ppn = this.detailInput.get('PayPointID').value[1] ;
    console.log(this.detailInput.get('PayPointID').value[1]) ;
    let prd = this.detailInput.get('Period').value  ; /// actual fuctionality
    console.log(this.detailInput.get('Period').value);

    // let url = apiURL + "receipt-listing/" + '14-Jan-2019' + "&" + 'LOBA' + "&" + 106 + "&" + 'SHLA' ; // dbg. dummy functionality
    let url = apiURL + "/paypoint-reports/unmatched-credits/" + ppid + "&" + ppn + "&" + prd ; /// actual fuctionality

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.http.get(url, httpOptions)
    .subscribe(      
        (response)=>{ this.unmatched_credits = response ; }
      , err => this.handleError(err)
      , () => this.sums() 
    );

  }

  print(){
    // Print-handler functionality
    console.log("Printing...") ; //
  }

  private handleError(error:Response){
    console.log(error);
    return Observable.throw('server error');
  }

  private sums(){
    if ( this.unmatched_credits.length == 0 ) // Error handling. Put all-else in ELSE part
    {
      console.log("[No Matching Data Found]" ) ;
      window.alert("[No Matching Data Found]" ) ;
      this.detailInput.enable() ;
      this.detailInput.get('Paypoint_Name').disable();
    }
    else // bgn: Actual Data Functionality
    { 
      this.headerDetails = this.unmatched_credits[0] ; // track features common to all receipt items
      console.table( this.headerDetails ) ;
      this.receipt_status = "Allocated" ; /// frontEnd.status (bold tableCaption) is "Allocated":: What is backEnd field?
      this.totalUnmatched = this.unmatched_credits.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.cr_amount)}, 0 ) ;
      this.displayReport = true ;
    } // end: Actual Data Functionality
  }

  toggleDisplayReport()
  {
    this.displayReport = !this.displayReport ; // false
    this.detailInput.enable() ;
    this.detailInput.get('Paypoint_Name').disable();
  }

}


