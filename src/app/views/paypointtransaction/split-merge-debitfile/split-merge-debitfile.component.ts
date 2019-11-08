import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaypointTransactionService } from '../paypointtransaction.service';
import { PagerService } from '../../../services';

@Component({
  templateUrl: './split-merge-debitfile.component.html'
})
export class SplitMergeDebitfileComponent implements OnInit {

  splitmergeDebitFileForm: FormGroup;
  hdrFileDetails: any;
  pager: any = {};
  pagedItems: any[];
  count: number;
  disableSplit: boolean = true;
  disableMerge: boolean = true;
  selctdFilesForMerge: any=[];
  selctdFileForSplit: any;
  constructor(private paytrans: PaypointTransactionService, private ps: PagerService) {
    this.splitmergeDebitFileForm = new FormGroup({
      period: new FormControl('', Validators.required),
      payPointId: new FormControl(''),
      paypointName: new FormControl(),
      fileName: new FormControl(),
      fileNames:new FormControl(),
      strikeDayFrom:new FormControl(),
      strikeDayTo:new FormControl(),
      noOfAvailableRecords: new FormControl(),
      filesize: new FormControl()
    });
  }
  countFunction(event) {
    //console.log(event.target.checked);
    if (event.target.checked) {
      this.count = this.count + 1;
      this.selctdFilesForMerge.push(this.hdrFileDetails.filter(fl => fl.ppHdrId == event.target.value)[0]);
    } else {
      this.count = this.count - 1;
      this.selctdFilesForMerge=this.selctdFilesForMerge.filter(fl => fl.ppHdrId != event.target.value);
    }
    if (this.count > 1) {
      this.disableSplit = true;
      this.disableMerge = false;
      console.log(this.selctdFilesForMerge);
    } else {
      this.selctdFileForSplit = this.hdrFileDetails.filter(fl => fl.ppHdrId == event.target.value)[0];
      this.disableSplit = false;
      this.disableMerge = true;
    }
  }
  private prepareSave(): any {
    console.log(this.selctdFileForSplit);
    this.splitmergeDebitFileForm.patchValue({
      payPointId: this.selctdFileForSplit.payPointId,
      paypointName:this.selctdFileForSplit.paypointName,
      fileName: this.selctdFileForSplit.fileName,
      strikeDayFrom:this.selctdFileForSplit.strikeDayFrom,
      strikeDayTo:this.selctdFileForSplit.strikeDayTo,
      noOfAvailableRecords: this.selctdFileForSplit.noOfAvailableRecords,
    });
  }
  onMerge() {
    if (this.count < 2) {
      alert("Minimum 2 files are needed for merging");
      return false;
    }
    this.splitmergeDebitFileForm.patchValue({
      fileNames :this.selctdFilesForMerge
    })
    console.log(this.splitmergeDebitFileForm.value);
    this.paytrans.mergeDebitFiles(this.splitmergeDebitFileForm.value).subscribe(
      response => {
        alert("Debit file successfully Merged ");
        console.log(response);
        this.reset();
      }, error => {
        console.log(error);
        alert("Error at Merging Debit files ");
      }
    )
  }
  onSplit() {    
    if (this.splitmergeDebitFileForm.controls['filesize'].value == null ||
      this.splitmergeDebitFileForm.controls['filesize'].value == 0) {
      alert("please enter valid number of records per file");
      return false;
    }
    this.prepareSave();
    console.log(this.splitmergeDebitFileForm.value);
    this.paytrans.splitDebitFile(this.splitmergeDebitFileForm.value).subscribe(
      response => {
        alert("Debit file successfully Split ");
        console.log(response);
        this.reset();
      }, error => {
        alert("Error at Splitting Debit file ");
      }
    );
  }
  ngOnInit() {
    this.count = 0;
  }
  search(value) {
    console.log(value);
    this.paytrans.getFileDetails(value).subscribe(
      response => {
        this.hdrFileDetails = response;
        //console.log(response);
        this.setPage(1);
      }
    )
  }
  reset() {
    this.splitmergeDebitFileForm.reset();
    this.selctdFilesForMerge=null;
    this.selctdFileForSplit=null;    
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.hdrFileDetails.length, page, 5);

    // get current page of items
    this.pagedItems = this.hdrFileDetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
