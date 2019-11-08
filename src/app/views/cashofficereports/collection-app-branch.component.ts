// TO-DO: Error Handling. and Progress Spinner. Vertical Scroll on Tables

import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

// import { NgxXml2jsonService } from 'ngx-xml2json'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiURL } from '../../_nav' ;

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'collection-app-branch.component.html'
})
export class CollectionAppBranchComponent implements OnInit {

  cashierInput = new FormGroup({ branchCode: new FormControl('', Validators.required)});

  branchName: string = "" ;
  cashOfficeName: string ;

  cashOfficeCollection: number = 0.0 ; 
  branchCodes :any;
  branchCollection: number = 0.0 ;
  displayReport = false ;

  reciepts: any ; 

  url : string;

  constructor(private http:HttpClient){}

  ngOnInit(){
    
    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.url = apiURL + "/cor_collection-branch/"
   this.http.get(this.url,httpOptions)
    .subscribe((response)=>{
      const obj = response;
      
      this.branchCodes = obj; 

    }
    ,err => this.handleError(err));
  }

  onSubmit(){
      
    let bc = this.cashierInput.get('branchCode').value ;
    let url = apiURL + "/cor_collection-branch/" + bc ;

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.http.get(url, httpOptions)
    .subscribe((response)=>
    {
      this.reciepts = response; 
      
      this.cashOfficeCollection = this.reciepts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;
           
      this.branchCollection = this.reciepts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;
    }
    ,err => this.handleError(err)
    , () => this.sums() 
  );

    this.displayReport = true ; // show container for the results. 
  }

  private handleError(error:Response){
    console.log(error);
    return Observable.throw('server error');
  }

  private sums(){
    this.branchName = this.reciepts[0].branch_name ;
    this.cashOfficeName = this.reciepts[0].cash_office_desc ;

    this.cashOfficeCollection = this.reciepts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;
  }
    
  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
  }
  
}
