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
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'company-modal-edit',
  templateUrl: './company-modal-edit.component.html',
  styleUrls: ['./company-modal-edit.component.scss'],
})
export class CompanyModalEditComponent implements OnInit {
  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    private fb: UntypedFormBuilder,
    private api: BackEndService
  ) {}
  @Input() company: any;
  showSpinnerSample = false;
  showSpinner = false;
  xml2js = require('xml2js');
  firstTime:boolean = false;

  email = false;
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      phoneNumber: ['', []],
      message: [null, [Validators.required]],
    });

  }

  validateForm!: UntypedFormGroup;
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
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      let fromname =
        this.validateForm.value.firstName +
        ' ' +
        this.validateForm.value.lastName;
      let email = this.validateForm.value.email;
      let phone = this.validateForm.value.phoneNumber;
      let message = this.validateForm.value.message;
      let body = `<h4>ReadyLists Contact US</h4><span>name:</span><span>${fromname}</span><br><span>email:</span><span>${email}</span><br><span>phone:</span><span>${phone}</span><br><span>message:</span><span>${message}</span><br>`;
      this.api
        .postEmail(
          fromname,
          'customersuccess@leadspotting.com',
          'ReadyLists Contact US',
          body
        )
        .subscribe((res) => {
          console.log(res);
          if (res.includes('Email sent')) {

          } else {
            
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
