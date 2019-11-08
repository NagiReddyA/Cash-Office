// http://localhost:8080/cash/collection-detail/106&2019-01-01&2019-01-31

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
  templateUrl: 'collection-app-detail.component.html'
})
export class CollectionAppDetailComponent implements OnInit{

  detailInput = new FormGroup({
    branchCode: new FormControl('', Validators.required),
    fromDate: new FormControl('2018-09-01', Validators.required),
    toDate: new FormControl('2018-09-30', Validators.required)
  });

  branchCodes : any;
  branchName: string = "" ;

  displayReport = false ;

  receipts : any ;
  receipts_gls : any ; // Group Life System
  receipts_sun : any ; // Sundry Receipts
  receipts_tpol : any ; // Policy

  // Collection Totals
  totalBranch: number = 0.0 ; 
  totalGls: number = 0.0 ; 
  totalSun: number = 0.0 ; 
  totalTPOL: number = 0.0 ; 

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

  detailReport(){

    // let bc = btoa(this.detailInput.get('branchCode').value + "                      ") ; // dbg. Base64 Encoder Things
    let bc = this.detailInput.get('branchCode').value ;
    let fd = this.detailInput.get('fromDate').value ;
    let td = this.detailInput.get('toDate').value ;

    let url = apiURL + "/cor_collection-detail/" + bc + "&" + fd  + "&" + td ;

    const httpOptions ={
      headers : new HttpHeaders({'Content-Type':'application/json','responseType':'application/json'})
     }
   this.http.get(url, httpOptions)

    .subscribe(
      
        (response)=>{ this.receipts = response ; }

      , err => this.handleError(err)

      , () => this.sums() 
    );

    this.displayReport = true ;

  }

  private handleError(error:Response){
    console.log(error);
    return Observable.throw('server error');
  }

  private sums(){
    this.branchName = this.receipts[0].branch_name ;

    this.receipts_gls = this.filterApp(this.receipts, "GPL") ;
    this.receipts_sun = this.filterApp(this.receipts, "SUN") ;
    this.receipts_tpol = this.filterApp(this.receipts, "TPOL") ;

    this.totalBranch = this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;

    this.totalGls = this.receipts_gls.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;
    this.totalSun = this.receipts_sun.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;
    this.totalTPOL = this.receipts_tpol.reduce( function(accumulator, currentValue){ return accumulator +  parseFloat(currentValue.receipt_amount)}, 0 ) ;

    console.log(this.totalSun) ; // dbg
  }

  // returns all items that have "filter" from the "list"
  filterApp(list, filter) { return list.filter(e=>e.app_code.includes(filter));}

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
  }

}
