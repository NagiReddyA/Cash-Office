import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaypointComponent } from '../../paypointmaster/paypoint/paypoint.component';
import { PaypointTransactionService } from '../paypointtransaction.service';
import { PagerService } from '../../../services';

@Component({
  templateUrl: './split-merge-search.component.html'
})
export class SplitMergeSearchComponent implements OnInit {
  splitmergeSearchForm: FormGroup;
  bsModalRef: BsModalRef;
  pager: any = {};
  pagedItems: any[];
  pagedItems1:any;
  splitFiles:any;
  mergeFiles:any;
  constructor(private modalService: BsModalService, private ptService: PaypointTransactionService,
    private ps:PagerService) {
    this.splitmergeSearchForm = new FormGroup({
      period: new FormControl('', Validators.required),
      paypointId: new FormControl('', Validators.required)
    })
  }
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.splitmergeSearchForm.patchValue({
        paypointId: result[0].payPointId
      });
    })
  }
  onSubmit(form) {
    console.log(form.value);
    this.ptService.searchSplitFiles(form.value).subscribe(
      response => {
        this.splitFiles=response;
        this.setPage(1);
      },
      error => {
        console.log(Response);
      });
      this.ptService.searchMergeFiles(form.value).subscribe(
        response => {
          console.log(response);
          this.mergeFiles=response;
          this.setPage1(1);
        },
        error => {
          console.log(Response);
        });
  };
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.splitFiles.length, page, 5);

    // get current page of items
    this.pagedItems = this.splitFiles.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  setPage1(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.mergeFiles.length, page, 5);

    // get current page of items
    this.pagedItems1 = this.mergeFiles.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  ngOnInit() {
  }

}
