import { ReadyListDownload } from './../../../shared/Models/ReadyListDownload-Model';
import { BackEndService } from 'src/app/shared/services/back-end-service';
import {
  Component,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { first } from 'rxjs';
import { FinalList } from 'src/app/shared/Models/FinalList-Model';

@Component({
  selector: 'company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.scss'],
})
export class CompanyModalComponent implements OnInit {
  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    private api: BackEndService
  ) {}
  @Input() company: any;
  showSpinnerSample = false;
  showSpinner = false;
  xml2js = require('xml2js');
  firstTime:boolean = false;

  email = false;
  ngOnInit(): void {
  }

  isVisiblePaymentSuccess = false;

  isVisible = false;
  showModal(): void {
    this.isVisible = true;
    this.showSpinner = true;

    // this.isVisible ? this.paypal() : true;
  }

  isVisibleSample = false;

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleSample = false;
    this.isVisiblePaymentSuccess = false;
  }

  openCompanyDetails($event: any){
    this.firstTime = !this.firstTime;
  }
}
