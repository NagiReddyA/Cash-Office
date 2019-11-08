// Payment Receipt Component - Transactions Module

import { Component, NgModule } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiURL } from '../../_nav';
import { HttpClient } from '@angular/common/http';
import { PagerService, GlobalServices } from '../../services';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PolicyComponent } from "./policy/policy.component";
import { CashofficeTransactionService } from "./cashofficetransaction.service";
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { formatDate } from '@angular/common';

@NgModule({
  imports: [
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'payment-receipt.component.html'
})
export class PaymentreceiptComponent {
  bsModalRef: BsModalRef;
  rcptDetails: any;
  co_ID: any;
  PayMethods: any;
  paymentDtls: boolean;
  selectedPolicy: any;
  userName: any;
  tillStatus:any;
  userId: any;
  cashOfficeId: any;
  cashierId: any;
  appDtls: any;
  appD_TPOL: any;
  appD_ACL: any;
  appD_GPL: any;
  appD_UPR: any;
  appD_TPP: any;
  appD_SUN: any;
  bankNames: any;
  branchNames: any;
  correction: any;
  // myFormTPOL:FormGroup;
  constructor(private http: HttpClient, private gs: GlobalServices, private fb: FormBuilder,
    private modalService: BsModalService, private ctservice: CashofficeTransactionService) { }
  receiptDetails = new FormGroup({
    // 1st Column
    paymentMethod: new FormControl('', Validators.required),
    cashOffice: new FormControl({ value: '', disabled: true }),
    receiptAmount: new FormControl('', Validators.required),
    receiptNumber: new FormControl({ value: '', disabled: true }, Validators.required),
    receivedFrom: new FormControl('', Validators.required),
    tillActivityStatus: new FormControl(''),
    // 2nd Column
    cashierName: new FormControl({ value: '', disabled: true }),
    postedStatus: new FormControl({ value: '', disabled: true }),
    receiptDate: new FormControl({ value: '', disabled: true })
  });

  paymentDetails = new FormGroup({
    // 1st Column
    bankName: new FormControl('', Validators.required),
    drawee: new FormControl('', Validators.required),
    referenceNumber: new FormControl('', Validators.required),

    // 2nd Column
    branchName: new FormControl('', Validators.required),
    referenceDate: new FormControl('2018-09-01', Validators.required)
  });

  receiptApplications = new FormGroup({
    corPeriod: new FormControl('', Validators.required),
    corPolicyCode: new FormControl('', Validators.required),
    corPayerName: new FormControl('', Validators.required),
    corStatus: new FormControl('', Validators.required),
    corArrears: new FormControl('', Validators.required),
    corExpectedAmount: new FormControl('', Validators.required)

  });

  // Placeholders - Dynamic Data: 
  paymentMethods = ["", "CSH", "CHQ", "DDE"];
  receiptAllocations = [];
  totalAmount: number = 0.0; // receipt allocations section

  // bgn. Editable Table Things

  myFormACL: FormGroup;
  totalAmountACL: number = 0.0;
  viewtableACL = false;

  myFormGPL: FormGroup;
  totalAmountGPL: number = 0.0;
  viewtableGPL = false;

  myFormSUN: FormGroup;
  totalAmountSUN: number = 0.0;
  viewtableSUN = false;

  //myFormTPOL: FormGroup ;
  myFormTPOL = new FormGroup({
    corSelect: new FormControl('', Validators.required),
    appActCode: new FormControl('', Validators.required),
    corPeriod: new FormControl('', Validators.required),
    corPolicyCode: new FormControl('', Validators.required),
    corPayerName: new FormControl('', Validators.required),
    corStatus: new FormControl('', Validators.required),
    corArrears: new FormControl('', Validators.required),
    corExpectedAmount: new FormControl('', Validators.required),
    corAllocatedAmount: new FormControl(''),
    correctionFormsTPOL: new FormArray([])

  });
  totalAmountTPOL: number = 0.0;
  viewtableTPOL = false;

  myFormTPP: FormGroup;
  totalAmountTPP: number = 0.0;
  viewtableTPP = false;

  myFormUPR: FormGroup;
  totalAmountUPR: number = 0.0;
  viewtableUPR = false;

  // constructor(private fb: FormBuilder) { }
  // GPL_access=false;
  // ACL_access=false;
  // UPR_access=false;

  //Page Load
  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.userId = sessionStorage.getItem('userID');
    this.cashierId = sessionStorage.getItem('CashierID');
    this.http.get(apiURL +'/CheckTillStatus/'+ JSON.stringify(this.userName))
    .subscribe(response => {
      this.tillStatus = response;
    //  console.log( this.tillStatus[0].tillActivityStatus);
   
    if (this.userId != null &&  this.tillStatus != null) {
      this.co_ID = this.tillStatus[0].cashOfficeId;
     // GET CASH OFFICE and Till Details. 
      this.http.get(apiURL + `/PRPayMethods?Id=${this.co_ID}`).subscribe(
        (response) => {
          this.PayMethods = response;
        }
      );
       
     //this.cashOfficeId = 10; 
      this.paymentDtls = true;
      this.cashierId=this.tillStatus[0].cashierId;
      console.log(this.cashierId);
      this.getRcptDetails(this.cashierId);
     

      // //this.http.get(apiURL + `/PRPayMethods?Id=${this.co_ID}`).subscribe(
      // this.http.get(apiURL + `/PRPayMethods?Id=${this.co_ID}`).subscribe(
      //   (response) => {
      //     this.PayMethods = response;
      //   }
      // );

      this.myFormACL = this.fb.group({
        correctionsACL: this.fb.array([])
      });
      this.myFormGPL = this.fb.group({
        correctionsGPL: this.fb.array([])
      });
      this.myFormSUN = this.fb.group({
        correctionsSUN: this.fb.array([])
      });
      this.myFormTPOL = this.fb.group({
        correctionFormsTPOL: this.fb.array([])
      });
      this.myFormTPP = this.fb.group({
        correctionsTPP: this.fb.array([])
      });
      this.myFormUPR = this.fb.group({
        correctionsUPR: this.fb.array([])
      });

      //FILL BANK DETAILS
      this.http.get(apiURL + `/getBankDtls`).subscribe(
        (response) => {
          this.bankNames = response;
        }
      );

      //FILL RECEIPT ACTIVITY DETAILS
      this.http.get(apiURL + `/getApplicationDtls`).subscribe(
        (response) => {
          this.appDtls = response;
          this.appD_TPOL = this.appDtls.filter(app => app.appCode == "TPOL");
          this.appD_ACL = this.appDtls.filter(app => app.appCode == "ACL");
          this.appD_GPL = this.appDtls.filter(app => app.appCode == "GPL");
          this.appD_UPR = this.appDtls.filter(app => app.appCode == "UPR");
          this.appD_TPP = this.appDtls.filter(app => app.appCode == "TPP");
          this.appD_SUN = this.appDtls.filter(app => app.appCode == "SUN");
        }
      );
    }
    else{
      alert("Till Activity not opened");
    //  window.location.href = "http://localhost:4200/#/login";
    }
  }) 
  }

  onBankChange(val) {
  //  console.log("BANK CODE IS:" + val);
    this.http.get(apiURL + `/getBankBranchDtls?Id=${val}`).subscribe(
      (response) => {
        this.branchNames = response;
      }
    );
  }

  onChange(val) {
    if (val != 2) {
      this.paymentDtls = false;
    }
    else {
      this.paymentDtls = true;
    }
  }

  togglepaymentDtls() {
    this.paymentDtls = !this.paymentDtls;
  }

  //pop up screen for given Policy code
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(PolicyComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.selectedPolicy = result[0];
      this.patchValues();
    })
  }
  studFg:any;
  //To patch values by the policy code table values
  patchValues() {
      this.studFg = <FormArray>this.myFormTPOL.controls['correctionFormsTPOL'];   
     const studFg = this.fb.group({
      corSelect: '',
      appActCode: '',
      corPeriod: this.selectedPolicy.due_DATE,
      corPolicyCode: this.selectedPolicy.policy_CODE,
      corPayerName: this.selectedPolicy.payor,
      corStatus: this.selectedPolicy.status,
      corArrears: this.selectedPolicy.arrears,
      corExpectedAmount: this.selectedPolicy.expected_PREMIUM
    });
    this.studFg.push(studFg);
  }

  //To get the Receipt details
  getRcptDetails(Id) { 
  this.http.get(apiURL + `/getPayRcptDtlsWithID?Id=${Id}`).subscribe(
      response => {
        this.rcptDetails = response
        if (this.rcptDetails.length > 0) {
          this.receiptDetails.patchValue({
            cashOffice: this.rcptDetails[0].cashOffCode,
            cashierName: this.rcptDetails[0].cashierName,
            co_ID: this.rcptDetails[0].cashOffId,
            postedStatus: "UNPOSTED",
            receiptDate: formatDate(new Date(), 'dd/MM/yyyy', 'en')
          });
        } else {
          alert("Please Open the Cash Till Activity");
        }   
      }, error => {
        alert("Did not find Receipt Details with given input parameters");
       // console.log(error);
      }
    );

  }

  // TPOL
  get correctionFormsTPOL() {
    return this.myFormTPOL.get('correctionFormsTPOL') as FormArray
  }
  addCorrectionTPOL() {

    // const correction = this.fb.group({ 

    //   appActCode: [],      
    //   corAllocatedAmount: [],
    //   corPeriod: [],
    //   corPolicyCode: [],
    //   corArrears: [],
    //   corExpectedAmount: [],
    //   corPayerName: [],
    //   corPurpose: [],
    //   corSelect: [],
    //   corStatus: [],

    // })
    this.openModalWithComponent();
    //  this.correctionFormsTPOL.push(correction);
    this.viewtableTPOL = true;
  }
  deleteCorrectionTPOL(i) {
    this.correctionFormsTPOL.removeAt(i)
  }


  // ACL
  get correctionFormsACL() {
    return this.myFormACL.get('correctionsACL') as FormArray
  }
  addCorrectionACL() {

    const correction = this.fb.group({

      corActivity: [],
      corAllocatedAmount: [],
      corDescription: [],
      corDealNumber: [],
      corPeriod: [],
      corSelect: []

    })

    this.correctionFormsACL.push(correction);
    this.viewtableACL = true;
  }
  deleteCorrectionACL(i) {
    this.correctionFormsACL.removeAt(i)
  }

  // GPL
  get correctionFormsGPL() {
    return this.myFormGPL.get('correctionsGPL') as FormArray
  }
  addCorrectionGPL() {

    const correction = this.fb.group({

      corActivity: [],
      corAllocatedAmount: [],
      corDescription: [],
      corPeriod: [],
      corSelect: []

    })

    this.correctionFormsGPL.push(correction);
    this.viewtableGPL = true;
  }
  deleteCorrectionGPL(i) {
    this.correctionFormsGPL.removeAt(i)
  }

  // SUN
  get correctionFormsSUN() {
    return this.myFormSUN.get('correctionsSUN') as FormArray
  }
  addCorrectionSUN() {

    const correction = this.fb.group({

      corActivity: [],
      corAllocatedAmount: [],
      corDescription: [],
      corPeriod: [],
      corSelect: []

    })

    this.correctionFormsSUN.push(correction);
    this.viewtableSUN = true;
  }
  deleteCorrectionSUN(i) {
    this.correctionFormsSUN.removeAt(i)
  }



  // TPP
  get correctionFormsTPP() {
    return this.myFormTPP.get('correctionsTPP') as FormArray
  }
  addCorrectionTPP() {

    const correction = this.fb.group({

      corActivity: [],
      corActivityDesc: [],
      corGrossAmount: [],
      corPaypoint: [],
      corPeriod: [],
      corReceiptedAmount: [],
      corSelect: [] 

    })

    this.correctionFormsTPP.push(correction);
    this.viewtableTPP = true;
  }
  deleteCorrectionTPP(i) {
    this.correctionFormsTPP.removeAt(i)
  }

  // UPR
  get correctionFormsUPR() {
    return this.myFormUPR.get('correctionsUPR') as FormArray
  }
  addCorrectionUPR() {

    const correction = this.fb.group({

      corActivity: [],
      corAllocatedAmount: [],
      corPayer: [],
      corPeriod: [],
      corPolicyCode: [],
      corProductCode: [],
      corSelect: [],
      corStatus: [],
      corUnitsEncashed: []

    })

    this.correctionFormsUPR.push(correction);
    this.viewtableUPR = true;
  }
  deleteCorrectionUPR(i) {
    this.correctionFormsUPR.removeAt(i)
  }

  // end: Editable Table Things

//Clear the form
  clear() {
    this.receiptDetails.setValue({ 
      cashOffice: '',
      receiptNumber: '', 
      cashierName: '',
      postedStatus: '',
      receiptDate: ',',
      receivedFrom: '',
      receiptAmount: '',
      paymentMethod: ''   
    })
    this.selectedPolicy=null;
    this.correctionFormsTPOL.reset();
  }

  //To save the receipt details
  save() {
    this.http.post(apiURL + '/InsertRcptDtls',
      {
        "rcptAmount": this.receiptDetails.value.receiptAmount,
        "rcvdFrom": this.receiptDetails.value.receivedFrom,
        "payMtdId": this.receiptDetails.value.paymentMethod,
        "cashOffId": this.co_ID,
        "cashierId": this.cashierId,
        "creatBy": this.userName,
        "appId": 3,
        "allocAmt": this.myFormTPOL.value.corAllocatedAmount,
        "unallocAmt": 0.0
      }).subscribe(
        (response) => {
          alert("record has been inserted with an Id :" + response);
          this.receiptDetails.patchValue({
            receiptNumber: response
          });
        }, (error) => {
         // console.log(error);
        }
      );
  }
}
