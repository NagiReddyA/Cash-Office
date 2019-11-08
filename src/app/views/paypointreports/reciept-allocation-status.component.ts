// Receipt Allocation Status - Paypoints Reports Module
// http://localhost:8080/cash/paypoint-reports/receipt-allocation-status/1606
// TO-DO: MySQL query optimisation.
// RFC. Unsubscribe when user move to a different page

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs'; // rfc: Subscription
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
  templateUrl: 'reciept-allocation-status.component.html'
})
export class recieptAllocationStatusComponent {

  detailInput = new FormGroup({
    receipt_number: new FormControl('', Validators.required)
  }) ;

  amount: number = 0.0 ;
  disableForm = false;
  displayReport = false ;
  headerDetails: any ;
  receipt_status = "" ;
  receipts: any ;  
  subscription: Subscription ; // rfc. 
  today = new Date() ;
  constructor(private http:HttpClient){}

  detailReport(){
    this.detailInput.disable() ;
    let rn = this.detailInput.get('receipt_number').value ;
    console.log("Loading Receipt " + rn) ; // dbg. 
    // let url = apiURL + "receipt-listing/" + '14-Jan-2019' + "&" + 'LOBA' + "&" + 106 + "&" + 'SHLA' ; // dbg. dummy functionality
    let url = apiURL + "/paypoint-reports/receipt-allocation-status/" + rn ; /// actual fuctionality
    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     } ; 
     this.subscription = // rfc. 
    this.http.get(url, httpOptions).subscribe(
        (response)=>{ this.receipts = response ; }
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
    if ( this.receipts.length == 0 ) // Error handling. Put all-else in ELSE part
    {
      console.log("No Receipts captured" ) ;
      window.alert("No Receipts captured" ) ;
    }
    else // bgn: Actual Data Functionality
    {
      this.amount = this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.amount)}, 0 ) ;
      this.headerDetails = this.receipts[0] ; // track features common to all receipt items
      console.table( this.headerDetails ) ;
      this.receipt_status = "Allocated" ; /// frontEnd.status (bold tableCaption) is "Allocated":: What is backEnd field?
      // this.http.unsubscribe() ; // rfc. m. refactoring
      this.displayReport = true ;
    } // end: Actual Data Functionality
  }

  toggleDisplayReport()
  {
    this.displayReport = !this.displayReport ; // false
    this.detailInput.enable() ;
  }

  // // rfc.
  // ngOnDestroy() {
  //   this.subscription.unsubscribe() ;
  // }

}
