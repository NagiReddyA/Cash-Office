// Manual Adjustment Report - Paypoint Reports module
// http://localhost:8080/cash/paypoint-reports/manual-adjustment/2006-03-01&2019-03-31

import { Component,NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms' ; 

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
  templateUrl: './manual-adjustment.component.html'
})
export class ManualAdjustmentComponent {
  
  unspecifiedInput = new FormGroup({
    fromDate: new FormControl('2006-03-01', Validators.required),
    toDate: new FormControl('2019-03-31', Validators.required)
  });
  
  adjustments : any ;

  displayReport = false ;
  
  today = new Date() ;
  totalAmount: number = 0.0 ;

  constructor(private http:HttpClient){}

  onSubmit(){

    this.unspecifiedInput.disable() ;

    let fdate = this.unspecifiedInput.get('fromDate').value  ;
    let tdate = this.unspecifiedInput.get('toDate').value  ;
    console.table(this.unspecifiedInput.value) ; // dbg

    let url = apiURL + "/paypoint-reports/manual-adjustment/" + fdate + "&" + tdate ; 

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }

    this.http.get(url, httpOptions)

    .subscribe(
      
        (response)=>{ this.adjustments = response ; }

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
    
    if ( this.adjustments.length == 0 ) // Error handling. Put all-else in ELSE part
    {
      console.log("[No Matching Data Found]" ) ;
      
      window.alert("[No Matching Data Found]" ) ;
      
      this.unspecifiedInput.enable() ;
    }
    else
    {
      this.totalAmount = this.adjustments.reduce( function(accumulator, currentValue){ return accumulator + parseFloat(currentValue.amount)}, 0 ) ;

      this.displayReport = true ;
    }
  }

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
    this.unspecifiedInput.enable() ;
  }
  
}
