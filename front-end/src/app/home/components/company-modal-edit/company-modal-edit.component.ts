import {BackEndService} from 'src/app/shared/services/back-end-service';
import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserServiceService} from "../../../shared/services/user.service.service";

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
    private api: BackEndService,
    private userService: UserServiceService
  ) {}

  private _isVisible:boolean = false;
  get isVisible(): boolean {
    return this._isVisible;
  }
  @Input() set isVisible(value: boolean){
    this._isVisible = value;
    if(this._isVisible){
      this.validateForm = this.fb.group({
        description: [this.company.description, [Validators.required]],
        benefits: [this.company.benefits, [Validators.required]],
        benefitsImageUrl: [this.company.benefitsImage, [Validators.required]],
        logoUrl: [this.company.logo, [Validators.required]],
        url: [this.company.url, [Validators.required]],
      });
    }
  }
  @Input() company: any;

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

  xml2js = require('xml2js');

  email = false;
  ngOnInit(): void {
  }

  validateForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);

      const description = this.validateForm.value.description;
      const benefits = this.validateForm.value.benefits;
      const benefitsImageUrl = this.validateForm.value.benefitsImageUrl;
      const logoUrl = this.validateForm.value.logoUrl;
      const url = this.validateForm.value.url;

      this.api.updateUserInfo(this.userService.getUserId(), description, benefits, benefitsImageUrl, logoUrl, url)
        .subscribe((res) => {
          if (res.includes('Email sent')) {
            this.isVisible = false;
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
