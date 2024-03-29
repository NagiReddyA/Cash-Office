import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaypointTransactionRoutingModule } from './paypointtransaction-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaypointComponent } from '../paypointmaster/paypoint/paypoint.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../services';
import { GenerateDebitfileComponent } from './generate-debitfile/generate-debitfile.component';
import { SplitMergeDebitfileComponent } from './split-merge-debitfile/split-merge-debitfile.component';
import { SplitMergeSearchComponent } from './split-merge-search/split-merge-search.component';
import { UploadCreditfileComponent } from './upload-creditfile/upload-creditfile.component';
import { PaypointMasterModule } from '../paypointmaster/paypointmaster.module';


@NgModule({
    imports: [
        CommonModule,
        PaypointMasterModule,
        PaypointTransactionRoutingModule, FormsModule, ReactiveFormsModule, ModalModule.forRoot()
    ],
    entryComponents: [
        PaypointComponent,
    ],
    declarations: [
        GenerateDebitfileComponent,
        SplitMergeDebitfileComponent,
        SplitMergeSearchComponent,
        UploadCreditfileComponent],
    providers: [BsModalService, PagerService]
})
export class PaypointTransactionModule { }
