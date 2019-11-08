// Unspecified Bank - Paypoint Reports Module
// http://localhost:8080/cash/paypoint-reports/unspecified-bank/2011-11-01&2011-11-01

import { Component,NgModule } from '@angular/core';
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
  templateUrl: './unspecified-bank.component.html'
})
export class UnspecifiedBankComponent {

  unspecifiedInput = new FormGroup({
    fromDate: new FormControl('2011-11-01', Validators.required),
    toDate: new FormControl('2011-11-01', Validators.required)
  });

  bankStatements: any ; 

  displayReport = false ;

  reportNo = 1234 ; // how is this generated /? 

  today = new Date() ;
  totalUnallocated: number = 0.0 ;

  constructor(private http:HttpClient){}

  onSubmit(){
    this.unspecifiedInput.disable() ;

    let fdate = this.unspecifiedInput.get('fromDate').value  ;
    let tdate = this.unspecifiedInput.get('toDate').value  ;
    console.table(this.unspecifiedInput.value) ; // dbg

    let url = apiURL + "/paypoint-reports/unspecified-bank/" + fdate + "&" + tdate ; 

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.http.get(url, httpOptions)

    .subscribe(
      
        (response)=>{ this.bankStatements = response ; }

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

    if ( this.bankStatements.length == 0 ) // Error handling. Put all-else in ELSE part
    {
      console.log("[No Matching Data Found]" ) ;

      window.alert("[No Matching Data Found]" ) ;

      this.unspecifiedInput.enable() ;
    }
    else
    {
      this.totalUnallocated = this.bankStatements.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.alloc_amt)}, 0 ) ;

      this.displayReport = true ;
    }
  }

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
    this.unspecifiedInput.enable() ;
  }
    
}