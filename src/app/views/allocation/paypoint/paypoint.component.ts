import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllocationsService } from '../allocations.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../../services/index';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-paypoint',
  templateUrl: './paypoint.component.html'
})
export class PaypointComponent implements OnInit {

  paypointDetails: any;
  pager: any = {};
  pagedItems: any = [];
  paypointForm: FormGroup;
  public onClose: Subject<any>;
  constructor(private ppservice: AllocationsService,
    private bsModalRef: BsModalRef, private pagerService: PagerService) {
    this.paypointForm = new FormGroup({
      paypointName: new FormControl()
    })
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.ppservice.getPayPointDetails().subscribe(
      response => {
       // console.log(response+"this data is coming from paypoint naveen details");
        this.paypointDetails = response;

        console.log(this.paypointDetails[0])
        this.setPage(1);
      },
      error => {
        alert("Error at fetching paypoint details");
      }
    )
  }
  public populateDetails(x) {
    this.onClose.next(this.paypointDetails.filter(app => app.paypoint_id == x.paypoint_id));
    this.bsModalRef.hide();
  }
  onSearch(value) {
    //console.log(value.toLowerCase());
    let findPaypoint = this.paypointDetails.filter(app =>app.payPoint_Name.toLowerCase().includes(value.toLowerCase()));
    this.paypointDetails=findPaypoint;
    this.setPage(1);
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.paypointDetails.length, page, 10);

    // get current page of items
    this.pagedItems = this.paypointDetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
