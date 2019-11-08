import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

import { FormBuilder, FormArray } from '@angular/forms'; // form array things require FormGroup as well

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
  templateUrl: 'bank-processing.component.html'
})
export class BankProcessingComponent {

  bnkAccDetails = new FormGroup({
    paymentMode: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
    creationDate: new FormControl({value:"2018-09-01", disabled: true}),
    modifiedDate: new FormControl({value:"2018-09-30", disabled: true}),

    bankStatementID: new FormControl('', Validators.pattern("^[0-9]*$") ),
    accountNo: new FormControl({value:'', disabled: true}), // , Validators.required), // auto-filled
    accountDesc: new FormControl({value:'', disabled: true}) // , Validators.required) // auto-filled

  }) ;

  // Array to hold dynamic data - Bank Account Details
  banks = [
    {bankName:"Bank ABC", accountNo:"ABC-2018", accountDesc: "Bank ABC Satellite", creation: "2013-01-01", 
      modified: "2016-08-24"},
    {bankName:"Bank Gaborone", accountNo:"BG-01234", accountDesc: " Bank GC Main Mall", creation: "2015-06-11", 
      modified: "2018-03-31"},
    {bankName:"Bank of Baroda", accountNo:"BB-43210", accountDesc: "Baroda RailPark ATM", creation: "2017-01-21", 
      modified: "2014-10-10"}
  ];

  bnkStmtDetails = new FormGroup({
    statementNo: new FormControl('', Validators.required),
    fromDate: new FormControl("2018-09-01", Validators.required),
    openingBalance: new FormControl('', Validators.required),
    // reversalPeriod: new FormControl("2018-04-30"),
    branch: new FormControl({value: '', disabled: true}),

    // bankStatementID: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$") ] ),
    postingStatus: new FormControl({value:'', disabled: true}),
    toDate: new FormControl('2018-09-30', Validators.required),
    closingBalance: new FormControl('', Validators.required),
    loginName: new FormControl({value: '', disabled: true})
  }) ;

  // Dynamic Data - Branch/login-name
  loginName = "user1" ;
  branch = "Gaborone Head Office";
  postingStatus = "UNPOSTED" ;

  BankStatInput = new FormGroup({
    paymentMode: new FormControl('', Validators.required),
    Bdid: new FormControl('', Validators.required),
    BName: new FormControl('', Validators.required),
    accNumber: new FormControl('', Validators.required),
    CrDate: new FormControl('', Validators.required),
    mdDate: new FormControl('', Validators.required),
    AccDesc: new FormControl('', Validators.required),
    statementNumber: new FormControl('', Validators.required),
    postingStatus: new FormControl('UNPOSTED', Validators.required),
    dateFrom: new FormControl('', Validators.required),
    dateTo: new FormControl('', Validators.required),
    loginName: new FormControl('tkadimo', Validators.required),
    opBalance: new FormControl('', Validators.required),
    closingBalance: new FormControl('', Validators.required),
    Branch: new FormControl('Gaborone HQ', Validators.required),
  });

  summaryReport(){
    console.table(this.BankStatInput.value) ;

    // form-processing code
  }

  viewtable = false;
  editField: string;
  personList: Array<any> = [
    { id: 1, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
    { id: 2, name: 'Guerra Cortez', age: 45, companyName: 'Insectus', country: 'USA', city: 'San Francisco' },
    { id: 3, name: 'Guadalupe House', age: 26, companyName: 'Isotronic', country: 'Germany', city: 'Frankfurt am Main' },
    { id: 4, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
    { id: 5, name: 'Elisa Gallagher', age: 31, companyName: 'Portica', country: 'United Kingdom', city: 'London' },
  ];

  awaitingPersonList: Array<any> = [
    { id: 6, name: 'George Vega', age: 28, companyName: 'Classical', country: 'Russia', city: 'Moscow' },
    { id: 7, name: 'Mike Low', age: 22, companyName: 'Lou', country: 'USA', city: 'Los Angeles' },
    { id: 8, name: 'John Derp', age: 36, companyName: 'Derping', country: 'USA', city: 'Chicago' },
    { id: 9, name: 'Anastasia John', age: 21, companyName: 'Ajo', country: 'Brazil', city: 'Rio' },
    { id: 10, name: 'John Maklowicz', age: 36, companyName: 'Mako', country: 'Poland', city: 'Bialystok' },
  ];

  myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      corrections: this.fb.array([])
    })

  }

  get correctionForms() {
    return this.myForm.get('corrections') as FormArray
  }

  addCorrection() {

    const correction = this.fb.group({ 
      corTransType:[],
      corPeriod: [],
      corPolicyCode: [],
      corPayerName: [],
      corExpectedAmnt: [],
      corAllocatedAmnt: [],
      corSunTransType: [],
      corDescription: [],
      corTransDate: [],
      corAllocatedAmnt1: [],
      corSunTransType1: [],
      corDescription1: [],
      corTransDate1: [],
      corAllocatedAmnt2: [],
      
    })

    this.correctionForms.push(correction);
    this.viewtable = true;
  }
  deleteCorrection(i) {
    this.correctionForms.removeAt(i)
  }

  cancel(){}

  clear(){}

  exit(){}

  save(){}

  search(){}

  printStatement(){}

  totalPaypoint: number ;
}
