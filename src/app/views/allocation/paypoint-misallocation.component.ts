import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { HttpClient, HttpParams} from '@angular/common/http';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component";
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
  // selector: 'app-user-management',
  templateUrl: './paypoint-misallocation.component.html'
})
export class PaypointMisallocationComponent {



  bsModalRef: BsModalRef;
  ngOnInit(){
    
    // at loading time only we are calling the credit file api
    this.getcreditfiles()
    this.getpaypointdetails()

  }

  constructor(private http:HttpClient,private modalService: BsModalService){

  }
 
  paypointMis = new FormGroup({
    rid: new FormControl('', Validators.required),

  });

  paypointMis2 = new FormGroup({
    rNo: new FormControl('', Validators.required),
    gAmnt: new FormControl('', Validators.required),
    pp: new FormControl('', Validators.required),
    pp1: new FormControl('', Validators.required),
    period: new FormControl("", Validators.required),

  });



  paypointMis3 = new FormGroup({
    ppnt: new FormControl('', Validators.required),
    ppName: new FormControl('', Validators.required),
    period2: new FormControl('', Validators.required),
    creditfile: new FormControl('', Validators.required),
    creditamount: new FormControl("", Validators.required),

  });
  


  // calling paypoint details
  paypointdetails:any;
   getpaypointdetails(){
     this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypoint`).subscribe((result)=>{
       
      console.log(result)
      this.paypointdetails=result

     },(error)=>{


     })
   }
 
  selectedPaypoint:any;
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {

       console.log("this my data"+result[0].paypoint_id)
       console.log("this my data"+result[0].payPoint_Name)
       console.log("this is paypointactid id "+result[0].pay_Point_Type_id)
      console.log(result)
      this.selectedPaypoint = result[0];
     // console.log("this my data 2 "+this.selectedPaypoint.paypoint_id)
      this.patchthepaypoint()

    })
  }
   
 

  patchthepaypoint(){
    this.paypointMis3.patchValue({

      ppnt:this.selectedPaypoint.paypoint_id,
      ppName:this.selectedPaypoint.payPoint_Name


    })
  }

   receiptdetails:any;
// fetching recepit or bank stmt details
   getbankstmtorreceipdetails(receipt){
     alert(receipt)

     this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/receiptorbkstmtdetails?receiptnum=${receipt}`).subscribe((result)=>{
       console.log(result)
       this.receiptdetails=result
       this.patchreceiptdetails()
     },(error)=>{
       console.log(error)
     })  

   }

   // patching the result coming from serve it can be recepit or bank stmt details depends upon input given
  //  amount: 55476.99
  //  paypointid: 515
  //  paypointname: "NORTH WEST DISTRICT COUNCIL - PERMANENT STAFF"
  //  period: "2011-09-30T18:30:00.000+0000"
  //  postingstatus: "C"
  //  recepitno: "3872"

   patchreceiptdetails(){

    this.paypointMis2.patchValue({
      
      gAmnt: this.receiptdetails[0].amount,
      pp: this.receiptdetails[0].paypointid,
      pp1: this.receiptdetails[0].paypointname,
      period: this.receiptdetails[0].period
   


    })
   }
    
   creditfilesdetails:any;

   // fetching credit files 

   getcreditfiles(){
    //  alert("calling credit files ")

    this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/creditfiledetails`)
          .subscribe((result)=>{
            console.log(result)
            this.creditfilesdetails=result
          },(error)=>{
            console.log(error)
          })

   }

  credithdrid:any;
   getcreditamount(){
          
    let creditfilename = this.paypointMis3.get('creditfile').value
    alert(creditfilename)
     

    let desc = this.creditfilesdetails.filter(app => app.creditfilename == creditfilename );

    if(desc.length != 0 ){
   
      this.credithdrid=desc[0].credithdrid

      this.paypointMis3.patchValue({
        creditamount: desc[0].cramount
      });
           }
       
   }
 
   // insert record into treceiptreallocallocation
    reallochdrid:any;
   inserttoreceiptrealloc(){

    let receiptno = this.paypointMis2.get('rNo').value

    // type casting receipt no which is in string to double 
    let receiptnumber = +receiptno
    let receiptamount = this.paypointMis2.get('gAmnt').value

    alert(receiptno)
    alert(receiptamount)
         
      
          this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/inserttoreceiptrealloc`,{
             "receiptNo":receiptnumber,
             "rcptAllocAmt":receiptamount
          }).subscribe((result)=>{
            console.log(result)
            this.reallochdrid=result

            alert(this.reallochdrid)
            this.insertfromreallocationdet()
            this.inserttorealloctodet()

           
            this.paypointMis.controls['rid'].setValue(this.reallochdrid);
            
          },(error)=>{console.log(error)})

   }



   // update t_receipt_realloca record
   updatetoreceiptrealloc(){


    let reallochdrid = this.paypointMis.get('rid').value
    let receiptno = this.paypointMis2.get('rNo').value

    // type casting receipt no which is in string to double 
    let receiptnumber = +receiptno
    let receiptamount = this.paypointMis2.get('gAmnt').value

       alert("reallochdrid--->"+reallochdrid)
      
      
          this.http.put(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/updatereceiptrealloc?reallochdrid=${reallochdrid}`,{
             "receiptNo":receiptnumber,
             "rcptAllocAmt":receiptamount
          }).subscribe((result)=>{
            console.log(result)
            alert("record is update sucessfully")
           
            
          },(error)=>{console.log(error)})

   }



   // insert into from reallocation det
    reallocfromedetid:any;
   insertfromreallocationdet(){

    let reallocid = this.reallochdrid

    alert(reallocid+"this is coming from fromdet hdr id ")

    this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/inserttoreceiptreallofromdet?reallochdrid=${reallocid}`,{
      "referenceNo":this.receiptdetails[0].paypointid,
      "period":this.receiptdetails[0].period
    
    

    }).subscribe(
    (result)=>{

      console.log(result)
      this.reallocfromedetid=result


    },
    (error)=>{

      console.log(error)
    }
      
   

    )

   }
   

   // update realloc from reallocation 
    
   updatefromreallocationdet(){

    let reallocfromid = this.reallocationdetails[0].rcptfromrealldetid

    alert(reallocfromid+"fromrealloc id ")
    
    this.http.put(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/updatetoreceiptreallofromdet?reallocfromid=${reallocfromid}`,{
      "referenceNo":this.reallocationdetails[0].referencenumber,
      "period":this.reallocationdetails[0].period
    
    

    }).subscribe(
    (result)=>{

      console.log(result)
      this.reallocfromedetid=result


    },
    (error)=>{

      console.log(error)
    }
      
   

    )



   }



   // insert record into realloc to det

   realloctoedetid:any;
    inserttorealloctodet(){

     
      
      let reallocid = this.reallochdrid
     let period =this.paypointMis3.get('period2').value
     let crfilename = this.paypointMis3.get('creditfile').value
     let cerditfileamount = this.paypointMis3.get('creditamount').value
    let credithdrid =  this.credithdrid

     
    alert(reallocid+"this is coming from todet hdr id ")

    //  alert(period)
    //  alert(crfilename)
    //  alert(cerditfileamount)
    //  alert(credithdrid)
  


    this.http.post(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/inserttoreceiptreallotodet?reallochdrid=${reallocid}`,{
     "referenceNo":this.selectedPaypoint.paypoint_id,
     "period":period,
     "crFileName":crfilename,
     "totCrAmt":cerditfileamount,
     "crHdrId":credithdrid
    
    

    }).subscribe(
    (result)=>{

      console.log(result)
      this.reallocfromedetid=result
    },
    (error)=>{

      console.log(error)
    }
      
   

    )


    }




    // update realloc to reallocation

    updaterealloctoreallocation(){


      let realloctoid = this.reallocationdetails[0].rcpttorealldetid

      let period =this.paypointMis3.get('period2').value
      let crfilename = this.paypointMis3.get('creditfile').value
      let cerditfileamount = this.paypointMis3.get('creditamount').value
      let credithdrid = this.reallocationdetails[0].credithdrid
      let referenceNo = this.paypointMis3.get('ppnt').value
 
    
      this.http.put(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/updatetoreceiptreallotodet?realloctoid=${realloctoid}`,{
        "referenceNo":referenceNo,
        "period":period,
        "crFileName":crfilename,
        "totCrAmt":cerditfileamount,
        "crHdrId":credithdrid
       
       
   
       }).subscribe(
       (result)=>{
   
         console.log(result)
        
       },
       (error)=>{
   
         console.log(error)
       }
         
      
   
       )
   

    }



   save(){
     
  let receiptno=  this.paypointMis2.get('rNo').value
  let pointno =   this.paypointMis3.get('ppnt').value
   let creditfile = this.paypointMis3.get('creditfile').value
  
  //  alert(receiptno)
  //  alert(pointno)
  //  alert(creditfile)

    if(receiptno=='' || pointno=="" || creditfile ==""){

          if(pointno=='' ){
            alert("no receipt num found")
          }
          if(receiptno=='' ){
            alert("no pointno id found")
          }
          if(creditfile=='' ){
            alert("no creditfile is selected")
          }

    }else{

        alert(this.paypointMis.value.rid)
 
        let hdrid = this.paypointMis.value.rid

        if(hdrid == ""|| hdrid==null ){
          alert("we are inserting the record")


        }else {
          alert("we are updating the record ")

          // let hdrid=this.reallocationdetails[0].receiptresllocationid
          // let fromreallocid=this.reallocationdetails[0].rcptfromrealldetid
          // let toreallocid = this.reallocationdetails[0].rcpttorealldetid

          // alert(hdrid)
          // alert(fromreallocid)
          // alert(toreallocid)

          this.updatetoreceiptrealloc()
          this.updatefromreallocationdet()
          this.updaterealloctoreallocation()
        
           
        }
      
       
         

    }


    
   }
   
  
   // fetching all reallocation details based on realloc hdr id 
  reallocationdetails:any;
   getreallocationdetails(hdrid){

    alert(hdrid)

   
    this.http.get(`http://192.168.1.58:9090/CashOffice-Test/api/allocations/paypointmisallocations/reallocationdetails?reallochdrid=${hdrid}`).subscribe((result)=>{
       
         console.log(result)
         this.reallocationdetails=result
         this.getpatchdetails()
     },
     
     (error)=>{
        console.log(error)

     })

   }

  

   // patch frpm paypoint details and to paypoint details 
   formattedDate:any;
   getpatchdetails(){

    

    this.paypointMis2.patchValue({
      rNo:this.reallocationdetails[0].receiptno,
      gAmnt:this.reallocationdetails[0].rcptallocamount,
      pp:this.reallocationdetails[0].referencenumber,
      pp1:this.reallocationdetails[0].ppname,
      period:this.reallocationdetails[0].period
    })
       

    let paypointid=this.reallocationdetails[0].toreferenceno
    alert(paypointid)

    let desc = this.paypointdetails.filter(app => app.paypoint_id == paypointid );
    
    alert(desc[0].payPoint_Name)
    alert(this.reallocationdetails[0].toperiod)

    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
     this.formattedDate = formatDate(this.reallocationdetails[0].toperiod, format, locale);
   alert(this.formattedDate)

    this.paypointMis3.patchValue({
      ppnt:this.reallocationdetails[0].toreferenceno,
      ppName:desc[0].payPoint_Name,
      period2: this.formattedDate,
      creditfile:this.reallocationdetails[0].creditfilename,
      creditamount:this.reallocationdetails[0].totalcreditamount
    })


   }





}