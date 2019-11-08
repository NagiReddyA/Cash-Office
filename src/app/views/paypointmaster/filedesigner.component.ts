import { Component } from "@angular/core";
import { PaypointmasterService } from "./paypointmaster.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component";
import { PagerService } from "../../services";

@Component({
  templateUrl: 'filedesigner.component.html'
})
export class FileDesignerComponent {
  fileDesignerForm: FormGroup;
  bsModalRef: any;
  selectedPaypoint: any;
  fields: any;
  showFieldInputs: boolean = false;
  asgndPayPoints: any;
  asgndFields: any;
  pager: any=[];
  pagedItems: any=[];
  constructor(private ppService: PaypointmasterService, private modalService: BsModalService,
    private pagerService:PagerService) {
    this.fileDesignerForm = new FormGroup({
      ppId: new FormControl('', Validators.required),
      ppName: new FormControl(),
      fileName: new FormControl('', Validators.required),
      noOfCrHdrLines: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      fieldName: new FormControl(),
      delimiter: new FormControl(),
      startPosition: new FormControl(),
      endPosition: new FormControl(),
      length: new FormControl(),
      datatype: new FormControl(),
      constants: new FormControl()
    })
  }
  ngOnInit() {
    this.ppService.getAssignedFileDetails().subscribe(
      response => {
        console.log(response);
        this.asgndPayPoints = response;
        this.setPage(1);
      }
    );
    this.ppService.getFileDesignFields().subscribe(
      response => {
        this.fields = response;
      }, error => {
        alert("Error at fetching field names")
      }
    )
  }
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.selectedPaypoint = result[0];
      this.fileDesignerForm.patchValue({
        ppId: this.selectedPaypoint.payPointId,
        ppName: this.selectedPaypoint.payPointName
      })
    })
  }
  showFieldForm() {
    this.showFieldInputs = true;
    //dynamic validation enable
    this.fileDesignerForm.controls['fieldName'].setValidators([Validators.required])
    this.fileDesignerForm.controls['fieldName'].updateValueAndValidity();

    this.fileDesignerForm.controls['delimiter'].setValidators([Validators.required])
    this.fileDesignerForm.controls['delimiter'].updateValueAndValidity();

    //there is great article about dynamic validations
    //https://netbasal.com/three-ways-to-dynamically-alter-your-form-validation-in-angular-e5fd15f1e946
  }
  populatePaypointDetails(value) {
    let current = this.asgndPayPoints.filter(pp => pp.ppId == value);
    this.fileDesignerForm.patchValue({
      ppId: current[0].ppId,
      ppName: current[0].ppName,
      fileName: current[0].fileName,
      noOfCrHdrLines: current[0].noOfCrHdrLines,
      currency: current[0].currency,
    });
    this.ppService.getAssignedFieldDetails(current[0].ppId).subscribe(
      response => {
        //console.log("89 " + response.toString());
        if(response.toString() == ""){
          alert("No fields exists for this File");
          this.asgndFields=null;
        }else{
          this.asgndFields = response;
        }        
      },error =>{
        console.log(error.error.message);
      }
    );
  }
  searchWithPayPoint(value){
    //console.log(value);
    let current = this.asgndPayPoints.filter(pp => pp.ppId == value);
    //console.log(current);
    if(current.length == 0){
      alert("No Details Found for the selected Paypoint")
    }else{
      this.populatePaypointDetails(value);
    }
  }
  populateFieldDetails(event) {
    this.showFieldForm();
    let current = this.asgndFields.filter(fld => fld.fieldSequence == event.target.value);
    console.log(current);
    this.fileDesignerForm.patchValue({
      fieldName: current[0].fieldName,
      delimiter: current[0].delimiter,
      startPosition: current[0].startPosition,
      endPosition: current[0].endPosition,
      length: current[0].length,
      datatype: current[0].datatype,
      constants: current[0].constants
    });
  }
  deleteField(formValue) {
    console.log(formValue);
    this.ppService.deleteFileField(formValue.ppFileFormatId).subscribe(
      response => {
        alert("successfully deleted");
        this.asgndFields=this.asgndFields.filter(fld => fld.ppFileFormatId != formValue.ppFileFormatId);
        if(this.showFieldInputs){
            this.showFieldInputs=false;
        } 
        //this.ngOnInit();
      }, error => {
        alert("failed to delete " + error.statusText);
      }
    );
  }
  resetForm() {
    this.fileDesignerForm.reset();
    this.asgndFields = null;
    this.showFieldInputs=false;
  }
  onSubmit() {
    console.log(this.fileDesignerForm.value);
    this.ppService.postFileDetailsToPP(this.fileDesignerForm.value).subscribe(
      response => {
        console.log(response);
        alert(response["message"]);
        this.resetForm();
        this.ngOnInit();        
      },
      error => {
        console.log(error);
        alert("Error while saving the details " + error.statusText);
      }
    );
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