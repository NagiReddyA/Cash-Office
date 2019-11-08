import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaypointComponent } from '../../paypointmaster/paypoint/paypoint.component';
import { PaypointTransactionService } from '../paypointtransaction.service';

@Component({
  templateUrl: './generate-debitfile.component.html'
})
export class GenerateDebitfileComponent implements OnInit {
  generateDebitFileForm: FormGroup;
  bsModalRef: BsModalRef;
  selectedPaypoint: any;
  constructor(private modalService: BsModalService, private ptService: PaypointTransactionService) {
    this.generateDebitFileForm = new FormGroup({
      paypointId: new FormControl('', Validators.required),
      paypointName: new FormControl(''),
      templateName: new FormControl(),
      period: new FormControl(),
      strikeDateFrom: new FormControl('', Validators.required),
      strikeDateTo: new FormControl()
    })
  }
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.selectedPaypoint = result[0];
      console.log(this.selectedPaypoint);
      this.generateDebitFileForm.patchValue({
        paypointId: this.selectedPaypoint.payPointId,
        paypointName: this.selectedPaypoint.payPointName
      });
      this.ptService.getTemplateNameForPaypoint(this.selectedPaypoint.payPointId).subscribe(
        data => {
          this.generateDebitFileForm.patchValue({
            templateName: data
          })
        },error =>{
          alert(error+"Please verify a template is assinged to this paypoint or not");
        }
        );
    })
  }
  ngOnInit() {
  }

  onSubmit(){
    console.log(this.generateDebitFileForm.value);
    this.ptService.generateDebitFile(this.generateDebitFileForm).subscribe(
      response =>{
        console.log(response);
        alert("Generated Debit File Successfully");
      }
    )

  }

}
