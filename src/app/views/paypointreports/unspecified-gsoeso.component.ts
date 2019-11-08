// Unspecified GSO-ESO - Paypoint Reports module
// http://localhost:8080/cash/paypoint-reports/unspecified-gsoeso/2006-03-01&2019-03-31

import { Component, NgModule } from '@angular/core';
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
  templateUrl: './unspecified-gsoeso.component.html'
})
export class UnspecifiedGsoesoComponent {

  unspecifiedInput = new FormGroup({
    fromDate: new FormControl('2006-03-01', Validators.required),
    toDate: new FormControl('2019-03-31', Validators.required)
  });

  displayReport = false ;

  receipts : any ;
  reportNo = 1234 ;  // how is this generated /? 

  today = new Date() ;
  totalAllocated: number = 0.0 ; 
  totalGross: number = 0.0 ; 
  totalReceipts: number = 0.0 ; 
  totalUnallocated: number = 0.0 ; 

  constructor(private http:HttpClient){}

  onSubmit(){
    this.unspecifiedInput.disable() ;

    let fdate = this.unspecifiedInput.get('fromDate').value  ;
    let tdate = this.unspecifiedInput.get('toDate').value  ;
    console.table(this.unspecifiedInput.value) ; // dbg

    let url = apiURL + "/paypoint-reports/unspecified-gsoeso/" + fdate + "&" + tdate ; 

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.http.get(url, httpOptions)

    .subscribe(
      
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
      console.log("[No Matching Data Found]" ) ;

      window.alert("[No Matching Data Found]" ) ;

      this.unspecifiedInput.enable() ;
    }
    else
    {
      this.totalUnallocated = this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.alloc_amt)}, 0 ) ;

      this.totalAllocated = 
        this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.allocated_amount)}, 0 ) ;
    
      this.totalGross = 
        this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.gross_amount)}, 0 ) ;
        
      this.totalReceipts = 
        this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;
        
      this.totalUnallocated = 
        this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.unallocated_amount)}, 0 ) ;

      this.displayReport = true ;
    }
  }

  toggleDisplayReport(){

    this.displayReport = !this.displayReport ; // false
    this.unspecifiedInput.enable() ;
  }

}
