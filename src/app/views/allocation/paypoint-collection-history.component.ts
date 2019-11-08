// TO-DO: Data - what goes for field3/item3 ? 

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AllocationsService } from "./allocations.service";
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component"

import { PagerService, GlobalServices } from './../../services/index';
import { formatDate } from "@angular/common";


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
  templateUrl: './paypoint-collection-history.component.html'
})
export class PaypointCollectionHistoryComponent {
   
  detailInput:FormGroup;
  receiptDetail:FormGroup

  constructor(private allocationservice:AllocationsService,private fb: FormBuilder,private http:HttpClient,private http1: Http,
    private modalService: BsModalService,private pagerService: PagerService){

    this.detailInput = new FormGroup({
      paypointID: new FormControl(''),
      
      paypointName: new FormControl(''),
  
      field3: new FormControl('') 
    });
  
    this.receiptDetail = new FormGroup({
      collPeriod: new FormControl(''),
      
      receiptNo: new FormControl(''),
  
      rcptAmnt: new FormControl('') ,
  
      rcptDate: new FormControl('')
    });

  }


  ngOnInit() {
     
   this.getpaypointname();

   }
   
   paypointDetails1:any;

   
   
   // getting paypoint details

   getpaypointname(){
    this.allocationservice.getPayPointDetails().subscribe(
    
    response => {
     // console.log(response[0].pay_Point_Type_id+"------this data is coming from paypoint  details");
    
      this.paypointDetails1 = response;
     // console.log("paypoint Pay_Point_Type_id ------name"+this.paypointDetails1[0].pay_Point_Type_id)
   
    },
    error => {
      alert("Error at fetching paypoint details");
    }
    )
    
    
  }
    

  // passing the paypoint details 

  // pop up details 

  bsModalRef:any;
  selectedPaypoint:any;

    
  openModalWithComponent() {

    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {

      console.log("this my data"+result[0].paypoint_id)
      console.log("this my data"+result[0].payPoint_Name)
      this.selectedPaypoint = result[0];
      console.log("this my data 2 "+this.selectedPaypoint.paypoint_id)

     
// calling patch method for first two fields
  this.patchingpaypointdetails()

  alert("paypoint id------------from popup"+this.selectedPaypoint.paypoint_id);



 // used to set value for 3rd variable
    
  let cashier=this.paypointDetails1.filter(app => app.paypoint_id == this.selectedPaypoint.paypoint_id);
  alert("pay_Point_Type_id that we are setting to cashier "+cashier[0].pay_Point_Type_id);
if(cashier.length != 0){
this.detailInput.patchValue({
 field3:cashier[0].pay_Point_Type_id
   
});
}
      
this.getcollectionhistoryrecords(this.selectedPaypoint.paypoint_id);

    })

    // calling paypointid to get collection history records 

    
   
    
  }

 collectionhistory:any;
  // code used for fetching data from paypoint collection history 2nd stage
 getcollectionhistoryrecords(ppi){

  alert("calling a method for fetching collection history records")
  this.allocationservice.getpaypointcollectionhistory(ppi).subscribe(
    
    response => {
     // console.log(response[0].pay_Point_Type_id+"------this data is coming from paypoint  details");
    
      this.collectionhistory = response;
      console.log("collectionhistory expected_amount------------->"+this.collectionhistory[0].paypoint_due_date)
 
      this.setPage(1);
      this.receiptDetail.reset()
   
    },
    error => {
      alert("Error at fetching collectionhistory details");
    }
    )

  
 }

  

  
  patchingpaypointdetails(){

    this.detailInput.patchValue({
   
      paypointID:this.selectedPaypoint.paypoint_id,
      paypointName:this.selectedPaypoint.payPoint_Name,

    })
  }

  pager: any = {};
  pagedItems: any[];

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.collectionhistory.length, page, 10);

    // get current page of items
    this.pagedItems = this.collectionhistory.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }




 // get recepit details 

paypoint_due:Date;
  receiptdetails:any;



  getrecepitdetails(pp,pe){

    alert("calling 3rd stage procedure")

    this.paypoint_due=pe

    alert(this.paypoint_due);
    this.allocationservice.getreceiptdetails(pp,pe).subscribe(
    
      response => {
      
       this.receiptdetails = response

       if(this.receiptdetails[0] == undefined){
         alert("no data found")
       }
       
       this.getpatchingreceiptdetails();
     
     },
      error => {
       alert("Error at fetching paypoint details");
      }
      )
      
  }


  // patching the receipt details

  getpatchingreceiptdetails(){


      let collPeriod1:String = this.selectedItem12.paypoint_due_date
       let    collPeriod2=   collPeriod1.substring(0,10)

   

       if( this.receiptdetails[0] == undefined){
         console.log("no data for the paypoint and coressponing date ")

         this.receiptDetail.patchValue({
          collPeriod: collPeriod2
         })
       } else{


        let rcptDate:String = this.receiptdetails[0].recepitdate
        let rcptDate1 = rcptDate.substring(0,10)
     
     this.receiptDetail.patchValue({
                    
          
       collPeriod: collPeriod2,
       
       receiptNo: this.receiptdetails[0].receiptno,
   
       rcptAmnt: this.receiptdetails[0].receiptamount,
   
       rcptDate: rcptDate1
 
       
      
      
 
 
     })

       }

    
     
    



  }



  showDetail = false ;

  selectedItem12: any ; // placeholder for a specific collection item


  // this click event is used for fetching the selected items
  onSelect(x){

    alert("calling on select event")

    this.selectedItem12 = x ;
    // alert("this details paypoint_due_date -------->"+this.selectedItem12.paypoint_due_date);
    console.log("this details paypoint_due_date -------->"+this.selectedItem12.paypoint_due_date)
  //  alert("this details expected_amount -------->"+this.selectedItem12.expected_amount);
    //alert("this details status -------->"+this.selectedItem12.status)
   // this.showDetail = true ;

     let datafromat = this.selectedItem12.paypoint_due_date
     const format = 'yyyy-MM-dd';
     const locale = 'en-IND';
    // THIS IS USED FOR SEPARATE DATEANDTIMESTAMP TO DATE
    let formattedDate = datafromat.substring(0, 10)
     let ppid =  this.selectedPaypoint.paypoint_id
      
    // console.log("paypoint id  go to recepit details --->"+ppid)
    // alert("format date -------->"+formattedDate);
     //console.log("formateed date====>"+formattedDate)

   this.getrecepitdetails(ppid,formattedDate)
   // this.getrecepitdetails(ppid,this.selectedItem12.paypoint_due_date)
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