import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileValidator } from '../../../customvalidators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaypointComponent } from '../../paypointmaster/paypoint/paypoint.component';
import { PaypointTransactionService } from '../paypointtransaction.service';

@Component({
  templateUrl: './upload-creditfile.component.html'
})
export class UploadCreditfileComponent implements OnInit {

  uploadCreditFileForm: FormGroup;
  bsModalRef: BsModalRef;
  fileToUpload: File;
  creditFileName: string;
  AllowedExtns: string[] = ["txt", "csv", "xls", "TXT"];
  constructor(private modalService: BsModalService, private ptService: PaypointTransactionService) {
    this.uploadCreditFileForm = new FormGroup({
      paypointId: new FormControl('', Validators.required),
      paypointName: new FormControl('', Validators.required),
      period: new FormControl('', Validators.required),
      creditFile: new FormControl('', [FileValidator.validate])
    })
  }
  ngOnInit() {

  }  
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.uploadCreditFileForm.patchValue({
        paypointId: result[0].payPointId,
        paypointName: result[0].payPointName
      });
      console.log(this.uploadCreditFileForm.controls['paypointId'].value);
      this.ptService.getCreditFileName(this.uploadCreditFileForm.controls['paypointId'].value).
        subscribe(
          response => {
            console.log(response);
            this.creditFileName = response;
          },
          error => console.log(error)
        );
    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    let name = this.fileToUpload.name;
    let extn = name.split(".").pop();
    if (name.length < 9) {
      alert("Invalid File");
      return false;
    }
    if (this.AllowedExtns.indexOf(extn) > -1) {

    } else {
      alert("Not a Valid File! Allowed File Formats are .txt,.csv,.xls");
      this.uploadCreditFileForm.reset();
    }

    let strTemp = name.substring(0, name.lastIndexOf("."));
    //console.log(strTemp);
    let crFile = strTemp.substring(0, strTemp.length - 4);
    let strMonth = strTemp.substring(strTemp.length - 4, strTemp.length - 2);
    let strYear = strTemp.substring(strTemp.length - 2, strTemp.length);
    console.log("file datails : " + crFile + " month: " + strMonth + " year: " + strYear);
    let period = this.uploadCreditFileForm.controls['period'].value;//2019-03-01
    console.log(period + " " + this.creditFileName);

    let calMonth, calYear;
    if (period.substring(5, 7) == "01") {
      calMonth = 12;
      calYear = period.substring(2, 4) - 1;
      //console.log(calMonth);
    } else {
      calMonth = period.substring(5, 7) - 1;
      calYear = period.substring(2, 4);
    }
    //console.log(calYear +" month "+calMonth);
    if (this.creditFileName != crFile) {
      alert("Credit File not belong to Paypoint ");
      this.uploadCreditFileForm.reset();
    }
    if (strYear != calYear) {
      alert("File period (Year)is not matching with upload period");
      this.uploadCreditFileForm.reset();
    }
    if (strMonth != calMonth) {
      // if (neMonth!=strCalMonth){
      alert("File period (Month)is not matching with upload period");
      this.uploadCreditFileForm.reset();
    }    
  }
  private prepareSave(): any {
    let input = new FormData();
    input.append('creditFile', this.fileToUpload);
    input.append('formValue', JSON.stringify(this.uploadCreditFileForm.value));
    return input;
  }
  onSubmit() {    
    const formModel = this.prepareSave();
    //console.log(formModel);
    this.ptService.uploadCreditFile(formModel).subscribe(
      (response) => {
        alert("File is successfully uploaded");
        console.log(response);
        //this.resetForm();
      },
      (error) => {
        //this.dbtFileTmpltAssignment.reset(this.dbtFileTmpltAssignment.value);
        //this.resetForm();
        alert(error.error.message);
      }
    ) 
  }
}
