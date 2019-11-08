import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllocationsService } from '../allocations.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../../services/index';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-paypoint',
  templateUrl: './bibo.component.html'
})
export class BiboComponent implements OnInit {

  paypointDetails: any;
  pager: any = {};
  pagedItems: any = [];
  paypointForm: FormGroup;
  public onClose: Subject<any>;
  constructor(private ppservice: AllocationsService,
    private bsModalRef: BsModalRef, private pagerService: PagerService,private http: HttpClient) {
    
    
      this.paypointForm = new FormGroup({
      bankstmt: new FormControl('')

    })
  }



  ngOnInit() {
    this.onClose = new Subject();
   
  }
  public populateDetails(ppId) {
    alert("by using click function we are capcaturing the cashAllocTrnId id")
    alert("calling populate click event cashAllocTrnId is---->"+ppId)
    this.onClose.next(ppId);
    this.bsModalRef.hide();
  }


biboo:any
bibopaymentMode:any
bibootransactionCode:any;
cashAllocTrnId:any;
bankcode:any;
branchCode:any;
bankStmtId:any;
stmtNumber:any;
accountNumber:any;
allocationStatus:any;
grossAmount:any;
allocatedAmount:any;



//  getmigdetails(s){


//   alert("from the search we are calling get method")

//   this.ppservice.getmigbobi(s)
//     .subscribe((bbb) =>
//          {
//           console.log(bbb)

          

//           this.biboo = bbb;
//           // "paymentMode": "BSO",
//           // "transactionCode": "CRE",
//           // "cashAllocTrnId": 1350690,
//           // "branchCode": "290367",
//           // "bankCode": "29",
//           // "bankStmtId": 60962,
//           // "stmtNumber": "6016/1",
//           // "accountNumber": "1039045",
//           // "allocationStatus": "U",
//           // "accountingDate": "2008-11-30T18:30:00.000+0000",
//           // "grossAmount": 50,
//           // "allocatedAmount": 0,
//           // "comments": null
//           alert("paymode---->"+this.biboo.paymentMode);
//           if(this.biboo.paymentMode == null || this.biboo.paymentMode == undefined ){
//             alert("no record found with this id ")
//       }
//            this.bibopaymentMode=this.biboo.paymentMode;
//            this.bibootransactionCode= this.biboo.transactionCode;
//            this.cashAllocTrnId = this.biboo.cashAllocTrnId;
//            this.bankcode= this.biboo.bankCode;
//            this.branchCode=this.biboo.branchCode;
//            this.bankStmtId = this.biboo.bankStmtId;
//            this.stmtNumber = this.biboo.stmtNumber;
//            this.accountNumber=this.biboo.accountNumber;
//            this.allocationStatus = this.biboo.allocationStatus;
//             this.grossAmount = this.biboo.grossAmount;
//            this.allocatedAmount = this.biboo.allocatedAmount;



           
//           // setpage is used for pagination
//         },
//         (error) =>{
         
//             alert("Problem with service. Please try again later!")
//         }
      
     
//     );    
 

//  this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualadjustmentvoucher')
//  .subscribe(
//    response => {
//     alert(response);
//     console.log(response);
     
   
//    }, (error) =>{
//      console.log(error);
//      alert("error while fetching bibo data ")
//  }

 
// );

 // }

  onSearch(value) {
    
   alert("bank stmt id -------->"+value)

   //this.getmigdetails(value);
this.getmigbobi(value);

  
  }


  getmigbobi(stmt){
        
    let bankstmt = stmt;

    alert(bankstmt+"bank statement details")

    this.http.get('http://192.168.1.58:9090/CashOffice-Test/api/allocations/manualadjustmentvoucher/bibo?bankstmtnum='+bankstmt)
    .subscribe(
      (response) => {

       
        console.log(response)
        this.biboo=response


        alert("paymode---->"+this.biboo.paymentMode);
        if(this.biboo.paymentMode == null || this.biboo.paymentMode == undefined ){
          alert("no record found with this id ")
    }
         this.bibopaymentMode=this.biboo.paymentMode;
         this.bibootransactionCode= this.biboo.transactionCode;
         this.cashAllocTrnId = this.biboo.cashAllocTrnId;
         this.bankcode= this.biboo.bankCode;
         this.branchCode=this.biboo.branchCode;
         this.bankStmtId = this.biboo.bankStmtId;
         this.stmtNumber = this.biboo.stmtNumber;
         this.accountNumber=this.biboo.accountNumber;
         this.allocationStatus = this.biboo.allocationStatus;
          this.grossAmount = this.biboo.grossAmount;
         this.allocatedAmount = this.biboo.allocatedAmount;

      }, (error) =>{
        console.log(error)
    }
 
   
);
  }


 }
