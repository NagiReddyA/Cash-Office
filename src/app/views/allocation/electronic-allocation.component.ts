import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { HttpClient, HttpParams} from '@angular/common/http';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {TpaypointComponent} from './tpaypoint/tpaypoint.component';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";



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
  templateUrl: 'electronic-allocation.component.html'
})
  export class ElectronicAllocationComponent {

    bsModalRef: BsModalRef;
    electronicInput:FormGroup;

    constructor(private http:HttpClient,private modalService: BsModalService){


      this.electronicInput = new FormGroup({
        paypointID: new FormControl('', Validators.required),
        creditFile: new FormControl('', Validators.required),
        receiptNo: new FormControl('', Validators.required),
        receiptPeriod: new FormControl({value:"", disabled: true}),
        statementNo: new FormControl(''),
        statementPeriod: new FormControl({value:"", disabled: true}),
        allocatedPeriod: new FormControl(''),
    
        // 2nd column - Auto-filled Fields
        paypointName: new FormControl({value:"", disabled: true}),
        creditFileAmount: new FormControl({value:"", disabled: true}),
        grossAmountReceipt: new FormControl({value:"", disabled: true}),
        grossAmountStatement: new FormControl({value:"", disabled: true}),
        
      });


    }

  

  ngOnInit(){

  }

  // calling pop up for fetching tpaypoint details

  select:any;
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(TpaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
   
      
      alert(result);
  
      this.select = result;
      alert("selected value coming from entery component"+this.select[0])
      
      console.log("this my data"+result[0].paypointid)
      console.log("this my data"+result[0].paypointname)
      
     this.patchpaypointname()
      this.getcreditfiledetails(result[0].paypointid);
      this.getreceiptdetails(result[0].paypointid);
       this.getstmtdetails(result[0].paypointid)

    })
  }
   
  
  // patching the paypoint name 
   
    patchpaypointname(){
    
      this.electronicInput.patchValue({
         
        paypointID:this.select[0].paypointid,
        paypointName:this.select[0].paypointname
      })


   }
  

 
    
    creditfiles:any;
   // fetching credit file details  --140,264

      
    getcreditfiledetails(pp){
         
       this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/electronicallocations/creditfiles?paypointid=${pp}`).subscribe(result=>{
      
        
       console.log("credit details "+result)
       this.creditfiles = result
      },(error)=>console.log(error));


    }


     receiptdetails:any;
    // fetching the recepit details 

     getreceiptdetails(paypoint){
      
      this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/electronicallocations/recepitdetails?paypointid=${paypoint}`).subscribe(result=>{

        console.log("recepit details "+result)
        this.receiptdetails = result
        console.log("recepit details "+ this.receiptdetails[0].receiptno)
       },(error)=>console.log(error));


     }


     bankstmtdetails:any;
     getstmtdetails(paypoint){
      
      this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/electronicallocations/bankstmtdetails?paypointid=${paypoint}`).subscribe(result=>{

        console.log("recepit details "+result)
        this.bankstmtdetails = result
         console.log("bank stmt  details "+ this.bankstmtdetails[0].bankstmtid)
       },(error)=>console.log(error));


     }
 

     // patching the credit amount based on credit name 

    

     creditdetails(){

    

    let bbee =  this.electronicInput.get('creditFile').value
    
           
    let desc = this.creditfiles.filter(app => app.filename == bbee );

    
    
  
  if(desc.length != 0 ){
    this.electronicInput.patchValue({
      creditFileAmount: desc[0].amount
    });
         }



         let crhhdriddetails = desc[0].crhhdrid

          alert(crhhdriddetails)

     }




     recepitdetails(){
     
      let bbee =  this.electronicInput.get('receiptNo').value
     
      let desc = this.receiptdetails.filter(app => app.receiptno == bbee );

      alert(desc)
       
      if(desc.length != 0 ){
        this.electronicInput.patchValue({
          grossAmountReceipt: desc[0].amount,
          receiptPeriod:desc[0].period
        }
        );
      }


     }





  
  allocate(){ 

     let paypointid = this.electronicInput.get('paypointID').value
     let  paypointname =this.electronicInput.get('paypointName').value
     let creditfilename = this.electronicInput.get('creditFile').value
     let creditamount = this.electronicInput.get('creditFileAmount').value
     let receiptnum= this.electronicInput.get('receiptNo').value
     let  receiptamount= this.electronicInput.get('grossAmountReceipt').value
     let  receiptperiod= this.electronicInput.get('receiptPeriod').value
     let allocatedperiod= this.electronicInput.get('allocatedPeriod').value

     alert(paypointid)
     alert(creditfilename)
     alert(receiptnum)
     alert(allocatedperiod)


      if(paypointid == '' || paypointid == null || paypointid == 'undefined' || creditfilename == '' || creditfilename == null || receiptnum == '' || receiptnum == null || allocatedperiod == '' || allocatedperiod == null ){
           if(paypointid == ''){
             alert("No paypoint is selected")
           }

           if( creditfilename == ''){
             alert("No creditfile is selected ")
           }

           if(receiptnum == '' ){
             alert("please select the receipt number ")
           }

           if(allocatedperiod == ''){
             alert("please select the allocated period")
           }
      }else{
        alert(" now we can post the recored")
      }
  }


  



  clear(){
    window.location.reload() ;
  }

  exit(){
    window.location.reload() ;
  }
  
  



}
