import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GlobalServices, PagerService } from "../../services";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component";
import { PaypointmasterService } from "./paypointmaster.service";
import { resetApplicationState } from "@angular/core/src/render3/instructions";
import { FileValidator } from "../../customvalidators";

@Component({
  templateUrl: 'debitfile-template-assignment.component.html'
})
export class DebitfileTemplateAssignmentComponent {
  bsModalRef: BsModalRef;
  selectedPaypoint: any;
  dbtFileTmpltAssignment: FormGroup;
  ppAttributes: any;
  asgndPayPoints :any;
  fileToUpload: File = null;
  pager: any = {};
  pagedItems: any[];
  //progress: { percentage: number } = { percentage: 0 };
  constantChecked: boolean = false;
  periodChecked: boolean = false;
  extensionChecked: boolean = false;
  strikeDayChecked: boolean = false;
  constructor(private gs: GlobalServices,private pagerService: PagerService,
     private modalService: BsModalService, private ppservice: PaypointmasterService) {
    this.dbtFileTmpltAssignment = new FormGroup({
      ppId: new FormControl('',[Validators.required]),
      ppName: new FormControl('',[Validators.required]),
      ppAttributeId: new FormControl('',[Validators.required]),
      ppAttributeDesc: new FormControl('',[Validators.required]),
      selectTemplate: new FormControl('',[FileValidator.validate]),
      pensionOnly: new FormControl(false),
      otherPremOnly: new FormControl(false),
      ffConstantValue: new FormControl(),
      ffPeriod: new FormControl(),
      ffStrikeday: new FormControl(),
      ffFileExtension: new FormControl()
    })
  }
  ngOnInit() {
    this.ppservice.getPpAttributes().subscribe(
      data => {
        this.ppAttributes = data;
      }
    );
    this.ppservice.getAsgndPayPointDetails().subscribe(
      data =>{
        console.log(data);
        this.asgndPayPoints=data;
        this.setPage(1);
      }
    )
  }
  populateDetails(value){    
    //console.log(event.target.value);
    //console.log(event.target.checked);
    let ppDet=this.asgndPayPoints.filter(pp => pp.ppId == value);
    if(ppDet.length == 0 ){
      alert("No templates are assigned to paypoint");
    }else{
      this.dbtFileTmpltAssignment.patchValue({
        ppId: ppDet[0].ppId,
        ppName: ppDet[0].ppName,
        ppAttributeId:ppDet[0].ppAttributeId,
        ppAttributeDesc:ppDet[0].ppAttributeDesc ,
        selectTemplate: '',
        pensionOnly: ppDet[0].pensionOnly == "Y" ? true :false,
        otherPremOnly: ppDet[0].otherPremOnly == "Y" ? true :false,
        ffConstantValue: ppDet[0].ffConstantValue,
        ffPeriod: ppDet[0].ffPeriod,
        ffStrikeday: ppDet[0].ffStrikeday,
        ffFileExtension:ppDet[0].ffFileExtension
      })
    }
    
  }
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.selectedPaypoint = result[0];
      this.dbtFileTmpltAssignment.reset();
      this.dbtFileTmpltAssignment.patchValue({
        ppId: this.selectedPaypoint.payPointId,
        ppName: this.selectedPaypoint.payPointName
      })
    })
  }
  setPpAttrDesc(event) {
    let currPpAttr = this.ppAttributes.filter(attr => attr.ppAttributeId == event.target.value);
    this.dbtFileTmpltAssignment.patchValue({
      ppAttributeId: currPpAttr[0].ppAttributeId,
      ppAttributeDesc: currPpAttr[0].attrComDesc
    })
  }
  
  //on file browsing
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  isChecked(event) {
    console.log(event.target.name);
    if (event.target.name == "constantCheckBox") {
      if (event.target.checked) {
        this.constantChecked = true;
      }
      if (!event.target.checked) {
        this.constantChecked = false;
      }
    }
    if (event.target.name == "periodCheckBox") {
      if (event.target.checked) {
        this.periodChecked = true;
      }
      if (!event.target.checked) {
        this.periodChecked = false;
      }
    }
    if (event.target.name == "strikedayCheckBox") {
      if (event.target.checked) {
        this.strikeDayChecked = true;
      } if (!event.target.checked) {
        this.strikeDayChecked = false;
      }
    }
    if (event.target.name == "fileExtCheckBox") {
      if (event.target.checked) {
        this.extensionChecked = true;
      } if (!event.target.checked) {
        this.extensionChecked = false;
      }
    }
  }
  //just before submitting the form
  private prepareSave(): any {
    let input = new FormData();
    input.append('selectTemplate', this.fileToUpload);
    input.append('formValue', JSON.stringify(this.dbtFileTmpltAssignment.value));
    return input;
  }
  onSubmit() {
    if (this.dbtFileTmpltAssignment.get('pensionOnly').value == null) {
      this.dbtFileTmpltAssignment.controls['enabled'].setValue(false);
    }
    if (this.dbtFileTmpltAssignment.get('otherPremOnly').value == null) {
      this.dbtFileTmpltAssignment.controls['enabled'].setValue(false);
    }
    const formModel = this.prepareSave();
    //console.log(formModel);
    this.ppservice.assignTemplate(formModel).subscribe(
      (response) => {
        alert("template is successfully assigned");
        //console.log(JSON.parse(response));
        this.resetForm();
      },
      (error) => {
        //this.dbtFileTmpltAssignment.reset(this.dbtFileTmpltAssignment.value);
        this.resetForm();
        console.log(error.message);
      }
    ) 
  }  
  resetForm(): any {
    this.dbtFileTmpltAssignment.reset();
  this.constantChecked = false;
  this.periodChecked = false;
  this.extensionChecked = false;
  this.strikeDayChecked = false;
  } 

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.asgndPayPoints.length, page,5);

    // get current page of items
    this.pagedItems = this.asgndPayPoints.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}