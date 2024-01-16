import { BackEndService } from 'src/app/shared/services/back-end-service';
import { FinalListt } from './../../../shared/Models/FinalList-Model';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import {UserServiceService} from "../../../shared/services/user.service.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private drawerService: NzDrawerService,
    private api: BackEndService,
    private fb: UntypedFormBuilder,
    private userService: UserServiceService
  ) {}
  private _drawer: any;
  @Input() cart: any;
  // @Input() drawer: any;
  @Input()
  set parentVar(value: any) {
    this._drawer = value;
    if (value == true) {
      this.openTemplate();
    }
  }
  get parentVar(): string {
    return this._drawer;
  }
  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { value: string };
    drawerRef: NzDrawerRef<string>;
  }>;
  value = 'ng';
  drawerRef: any;
  isVisibleAbout = false;
  isVisibleContactUs = false;
  isVisibleBookADemo = false;
  isVisibleVideoTutorial = false;

  //region  REGISTRATION
  register_isVisible = false;
  register_formGroup!: UntypedFormGroup;
  register_passwordVisible:boolean = false;
  register_verifyPasswordVisible:boolean = false;
  register_success = false;
  register_error: boolean = false;
  register_tokenError: boolean = false;
  registrationError = false;
  register_step = 0;
  register_token:string[] = ['', '', '', '', '', ''];

  register_handleCancel(): void {
    this.register_isVisible = false;
  }
  register_submitForm(): void {
    this.register_success = false;
    this.registrationError = false;

    if (this.register_formGroup.valid) {
      let password = this.register_formGroup.value.password;
      let verifyPassword = this.register_formGroup.value.verifyPassword;

      if(password !== verifyPassword){
        this.register_formGroup.get("verifyPassword")?.setErrors({"customError": "Passwords do not match!"});
        return;
      }

      this.api.register(this.register_formGroup.value).subscribe((res) => {
        this.xml2js.parseString(res, (err: any, result: any) => {
          if (
            result.LSResponse.Response[0] ===
            'SUCCESS;Thanks for registering! We’ve sent you a link to verify your email. Please check your email'
          ) {
            this.register_step = 1;
          } else {
            this.register_error = true;
          }
        });
      });
    } else {
      Object.values(this.register_formGroup.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  register_submitToken() {
    this.userService.verifyUser(this.register_token.join('')).subscribe((res) => {
      if (res.includes('SUCCESS')) {
        this.register_step = 2;
        setTimeout(() => {
          this.showModalLogin();
        }, 1300);

        try {
          let ele = document.getElementsByClassName('otp');
          for (let i = 0; i < ele.length; i++) {
            ele[i].classList.remove('danger');
          }
        } catch {
        }
      } else {
        this.register_tokenError = true;

        let ele = document.getElementsByClassName('otp');
        for (let i = 0; i < ele.length; i++) {
          ele[i].classList.add('danger');
        }
        setTimeout(() => {
          for (let i = 0; i < ele.length; i++) {
            ele[i].classList.remove('danger');
            (ele[i] as HTMLInputElement).value = '';
          }
          this.register_tokenError = false;
        }, 2000);
      }
    });
  }

  register_check() {
    if (this.register_token.join('').length == 6) {
      return true;
    } else {
      return false;
    }
  }

  register_tabChange(num: number, e:any = null) {
    return;
    let ele = document.getElementsByClassName('otp');

    if ((ele[num - 1] as HTMLInputElement).value != '') {
      (ele[num] as HTMLInputElement).focus();
    } else if ((ele[num - 1] as HTMLInputElement).value == '') {
      (ele[num - 2] as HTMLInputElement).focus();
    }
  }
  register_keyUp(event: KeyboardEvent, index: number){
    switch (event.key) {
      case 'ArrowLeft':
        this.register_focusPreviousInput(index);
        break;
      case 'ArrowRight':
        this.register_focusNextInput(index);
        break;
      case 'Backspace':
        this.register_handleBackspace(event, index);
        break;
    }
  }

  register_onInput(event: Event, nextIndex: number): void {
    const value = (event.target as HTMLInputElement).value;

    if (value && nextIndex < this.register_token.length) {
      this.register_token[nextIndex] = value;
      this.register_focusNextInput(nextIndex);
    }
  }

  register_focusPreviousInput(index: number): void {
    let ele = document.getElementsByClassName('otp');

    if (index > 0) {
      (ele[index - 1] as HTMLInputElement).focus();
    }
  }

  register_focusNextInput(index: number): void {
    let ele = document.getElementsByClassName('otp');

    if (index < this.register_token.length - 1) {
      (ele[index + 1] as HTMLInputElement).focus();
    }
  }
  register_handleBackspace(event: KeyboardEvent, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    // if (!value && index > 0) {
    this.register_token[index] = '';
    if (index > 0) {
      this.register_focusPreviousInput(index);
    }
  }

  //endregion


  // Login
  login_isVisible = false;
  validateLoginForm!: UntypedFormGroup;
  login_passwordVisible:boolean = false;
  login_error: boolean = false;
  login_errorMessage: string = "";
  loggedInSuccessfully = false;

  // Reset password
  isVisibleResetPassword: boolean = false;
  validateResetPasswordForm!: UntypedFormGroup;
  resetPassword_errorMessage: string = "";
  resetPasswordSuccessfully = false;

  // Account
  isVisibleAccount: boolean = false;
  company:any = null;

  validateForm!: UntypedFormGroup;
  xml2js = require('xml2js');
  isLoggedIn = false;



  ERROR_CODES = {
    'verifyPassword': {
      'required': 'Reenter your password!'
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      phoneNumber: ['', []],
      message: [null, [Validators.required]],
    });
    this.register_formGroup = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      verifyPassword: [null, [Validators.required]],
      termsAndConditions: [false, [Validators.requiredTrue]],
      receiveNewsLetter: [false],
    });
    this.validateLoginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      rememberMe: [false, [Validators.required]],
    });
    this.validateResetPasswordForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]]
    });

    this.isLoggedIn = this.userService.isUserLoggedIn();
  }
  submitForm(): void {
    this.register_success = false;
    this.registrationError = false;

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
            this.register_success = true;
          } else {
            this.registrationError = true;
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

  submitLoginForm(): void {
    this.loggedInSuccessfully = false;
    this.login_errorMessage = "";

    if (this.validateLoginForm.valid) {
      const form = this.validateLoginForm.value;
      this.userService.login(form).subscribe((successful:any) => {
        debugger;
        if(successful){
          this.isLoggedIn = true;
          this.login_isVisible = false;
        } else {
          this.login_errorMessage = 'Please try again or click "Forgot password"';
        }
      }, (err: any) => {
          this.login_errorMessage =
            err.error.message + ' Please try again or click "Forgot password"';
        });
    } else {
      Object.values(this.validateLoginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitResetPasswordForm(): void {
    this.resetPasswordSuccessfully = false;
    this.resetPassword_errorMessage = "";

    if (this.validateResetPasswordForm.valid) {
      const email = this.validateResetPasswordForm.value.email;
      this.userService.forgotPasswordRequest(email).subscribe((res: any) => {
        if (res.includes('FAIL')) {
          this.validateResetPasswordForm.get("email")?.setErrors({"valid": true});
        } else {
          this.isVisibleResetPassword = false;
        }
      });
    } else {
      Object.values(this.validateResetPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls['checkPassword'].updateValueAndValidity()
    );
  }

  confirmationValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
  HomeClicked() {
    this.router.navigate(['']);
  }
  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Shopping Cart',
      nzFooter: 'Leadspotting ©',
      nzExtra: this.cart.length + ' Items',
      nzContent: this.drawerTemplate,
    });

    this.drawerRef.afterOpen.subscribe(() => {});

    this.drawerRef.afterClose.subscribe(() => {});
  }

  paymentDone(value: any) {
    this.cart.forEach((element: any) => {
      this.api
        .postEmail(
          'customersuccess@leadspotting.com',
          'roy@leadspotting.com',
          'ReadyList platform - Full list was Downloaded',

          '<div><h3>' +
            element.originReadyList.name +
            '</h3><p><b>Description:</b><br>' +
            element.originReadyList.description +
            '</p><p><b>Price:</b><br>' +
            element.originReadyList.price +
            '</p><p><b>Count:</b><br>' +
            element.originReadyList.roundCount +
            '</p></div>'
        )
        .subscribe((res) => {});
      let type =
        element.type == 'opportunities'
          ? 'opportunity'
          : element.type == 'leads'
          ? 'emails'
          : element.type == 'companies'
          ? 'companies'
          : '';
      this.api
        .UpdatesDownloads2(element.originReadyList.id, type)
        .subscribe((res) => {
          console.log('saved');
          console.log(res);
          this.xml2js.parseString(res, (err: any, result: any) => {
            console.log(result.LSResponse._, 'resultttt');
            if (result.LSResponse._ == '1') {
              let num = Number(element.originReadyList.downloads) + 1;

              element.originReadyList.downloads = num;
              // let doc = document.getElementById(
              //   'Down' + this.list.originReadyList.id
              // );
              // if (doc) {
              //   let num = Number(doc?.innerText) + 1;
              //   doc.setAttribute('nzValue', num.toString());
              // }
            }
          });
        });

      if (element.type == 'opportunities') {
        this.getFullListOpp(element.readyListPosts, element.name);
      } else {
        this.getFullList(element);
      }
    });
    this.cart.forEach((element: any) => {
      this.api
        .SavePurchasedLists(
          element.originReadyList.id,
          element.originReadyList.count,
          element.originReadyList.price,
          '1'
        )
        .subscribe((res) => {});
    });
  }
  getFullListOpp(arr: any, element: any) {
    this.convertArrayToCSVPosts(arr, element.name);
  }

  convertArrayToCSVPosts(data: any, name: any) {
    const csvRows = [];

    // Get the headers from the first object in the array
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // Iterate over each object and create a CSV row
    for (const item of data) {
      const values = headers.map((header) => {
        const escapedValue = item[header].replace(/"/g, '\\"'); // Escape double quotes
        return `"${escapedValue}"`;
      });
      csvRows.push(values.join(','));
    }

    // Join all rows with newline character
    const csvContent = csvRows.join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = name + '.csv';
    downloadLink.click();
  }

  getFullList(element: any) {
    let csv;
    if (!('campaignId' in element)) {
      this.api
        .getReadyFullList2(
          element.originReadyList.locationId,
          element.originReadyList.industryId,
          element.originReadyList.count
        )
        .subscribe((res) => {
          let json = JSON.parse(res);
          // console.log(json);

          for (let i = 0; i < json.length; i++) {
            for (const key in json[i]) {
              if (json[i].hasOwnProperty(key)) {
                json[i][key] = json[i][key]
                  ? json[i][key].toString().replaceAll(',', '')
                  : '';
              }
            }
          }

          csv = this.createCSV(json, 'company');
          this.downloadCSV(csv, 'company', element.name);
        });
    } else {
      this.api.getReadyFullListEmails(element.campaignId).subscribe((res) => {
        let arr: any[] = [];
        let json = JSON.parse(res);

        json[0].contacts.forEach((el: any) => {
          let obj = {
            // campaignId: element.campaignId,
            company: el.company,
            // creationTime: element.creationTime,
            domain: el.domain,
            emails: '',
            // id: element.id,
            linkedinId: el.linkedinId,
            location: el.location ? el.location.replaceAll(',', '') : '',
            name: el.name.replaceAll(',', ''),
            phones: '',
            position: el.position.replaceAll(',', ''),
            // scanned: element.scanned,
            url: el.url,
          };
          let emails = '';
          try {
            el.emails.forEach((email: any) => {
              emails += email.email + '-' + email.isValid;
            });
          } catch {}
          let phones = '';
          try {
            el.phones.forEach((phone: any) => {
              phones += phone;
            });
          } catch {}
          obj.emails = emails;
          obj.phones = phones;
          arr.push(obj);
        });

        csv = this.createCSV(arr, 'email');
        this.downloadCSV(csv, 'email', element.name);
      });
    }
  }

  createCSV(data: any[], type: any) {
    if (type == 'company') {
      // const header = Object.keys(data[0]).join(',');
      // const data2 = data
      //   .map((item) => Object.values(item).join(','))
      //   .join('\n');
      // const csv = `${header}\n${data2}`;
      // return csv;

      const headersToKeep = [
        'name',
        'domain',
        'yearFounded',
        'industry',
        'locality',
        'sizeRange',
        'country',
        'linkedinPage',
        'currentEmployeeEstimate',
        'totalEmployeeEstimate',
        'description',
        'emails',
        'phones',
      ];
      const dataFiltered = data.map(
        ({ id, searchDate, industriesIds, ...rest }) => rest
      );
      const header = headersToKeep.join(',');
      const data2 = dataFiltered
        .map((item) => Object.values(item).join(','))
        .join('\n');
      const csv = `${header}\n${data2}`;
      return csv;
    } else {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent +=
        'company,domain,emails,linkedinId,location,name,phones,position,url\r\n';
      // csvContent +=
      //   'campaignId,company,creationTime,domain,emails,id,linkedinId,location,name,phones,position,scanned,url\r\n';
      data.forEach(function (rowArray) {
        let row =
          // rowArray.campaignId +
          // ',' +
          rowArray.company +
          ',' +
          // rowArray.creationTime +
          // ',' +
          (rowArray.domain.length > 0 ? rowArray.domain : 'null') +
          ',' +
          (rowArray.emails.length > 0 ? rowArray.emails : 'null') +
          ',' +
          // rowArray.id +
          // ',' +
          rowArray.linkedinId +
          ',' +
          rowArray.location +
          ',' +
          rowArray.name +
          ',' +
          (rowArray.phones.length > 0 ? rowArray.phones : 'null') +
          ',' +
          rowArray.position +
          ',' +
          // rowArray.scanned +
          // ',' +
          rowArray.url +
          '\r\n';
        csvContent += row;
      });
      var encodedUri = encodeURI(csvContent);
      return encodedUri;
    }
  }

  downloadCSV(encodedUri: string, type: any, name: string) {
    setTimeout(() => {
      if (type == 'company') {
        const a = document.createElement('a');
        const file = new Blob([encodedUri], { type: 'text/csv' });
        a.href = URL.createObjectURL(file);
        a.download = name;
        // a.download = 'test';
        a.click();
      } else {
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        // link.setAttribute('download', 'my_data.csv');
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
      }
    }, 1500);
  }

  getTotalCartPrice() {
    let total = 0;
    for (let i = 0; i < this.cart.length; i++) {
      total += parseInt(this.cart[i].originReadyList.price);
    }
    return total;
    // this.cart.forEach(element: FinalListt => {
    //   total += parseInt(element.originReadyList.price);

    // });
  }
  removeItemFromCart(item: any) {
    let index = this.cart.indexOf(item);
    if (index != -1) {
      this.cart.splice(index, 1);
      this.drawerRef.close(this.value);
      setTimeout(() => {
        this.openTemplate();
      }, 300);
    }
  }

  showModalAbout(): void {
    this.isVisibleAbout = true;
  }

  handleOkAbout(): void {
    console.log('Button ok clicked!');
    this.isVisibleAbout = false;
  }

  handleCancelAbout(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAbout = false;
  }

  showModalContactUs(): void {
    this.isVisibleContactUs = true;
  }

  showModalRegister(): void {
    this.register_isVisible = true;
    this.login_isVisible = false;
    this.isVisibleResetPassword = false;
    this.isVisibleAccount = false;
  }

  showModalLogin(): void {
    this.register_isVisible = false;
    this.login_isVisible = true;
    this.isVisibleResetPassword = false;
    this.isVisibleAccount = false;
  }

  showModalResetPassword(): void {
    this.register_isVisible = false;
    this.login_isVisible = false;
    this.isVisibleResetPassword = true;
    this.isVisibleAccount = false;
  }

  showModalAccount(): void {
    this.register_isVisible = false;
    this.login_isVisible = false;
    this.isVisibleResetPassword = false;
    this.api.getMyCompany(this.userService.getUserId()).subscribe((res:any) => {
      this.xml2js.parseString(res, (err: any, result: any) => {
        this.company = result.LSResponse.BsiCompany[0];
      })
    });
    this.isVisibleAccount = true;
  }

  isConfirmLoading = false;
  isConfirmResetPassword = false;
  handleOkContactUs(): void {
    console.log('Button ok clicked!');
    // this.isVisibleContactUs = true;
  }

  handleCancelContactUs(): void {
    console.log('Button cancel clicked!');
    this.isVisibleContactUs = false;
    this.register_success = false;
    this.registrationError = false;
    this.validateForm.reset();
  }

  handleOkBookADemo(): void {
    console.log('Button ok clicked!');
    this.isVisibleBookADemo = false;
  }

  handleCancelBookADemo(): void {
    this.isVisibleBookADemo = false;
  }

  handleCancelVideoTutorial(): void {
    this.isVisibleVideoTutorial = false;
  }

  bookADemo() {
    //   const script1 = document.createElement('script');
    //   script1.src = 'https://assets.calendly.com/assets/external/widget.js';
    //   script1.type = 'text/javascript';
    //   const script2 = document.createElement('script');
    //   script2.innerHTML = `
    //   Calendly.initInlineWidget({
    //     url: "https://calendly.com/roy-business-schedule/15min?hide_event_type_details=1&background_color=eaf1f9",
    //     parentElement: document.getElementById("cal"), style: {
    //   minWidth: "320px",
    //   height: "700px",
    // },
    //   });
    // `;
    //   document.head.appendChild(script1);
    //   document.body.appendChild(script2);
  }

  handleCancelLoginDialog(): void {
    this.login_isVisible = false;
  }

  handleCancelResetPasswordDialog(): void {
    this.isVisibleResetPassword = false;
  }

  handleCancelAccountDialog(): void {
    this.isVisibleAccount = false;
  }

  toggleRegisterPasswordVisible(){
    this.register_passwordVisible = !this.register_passwordVisible;
  }

  toggleRegisterVreifyPasswordVisible(){
    this.register_verifyPasswordVisible = !this.register_verifyPasswordVisible;
  }

  toggleLoginPasswordVisible(){
    this.login_passwordVisible = !this.login_passwordVisible;
  }

  hasErrors(control:string){
    const formControl = this.register_formGroup.get(control);
    if(!formControl?.dirty)
      return false;
    const kvp = formControl?.errors;
    return kvp != null && kvp && Object.keys(kvp).length > 0;
  }

  getErrorMessage(control:string){
    const e = this.register_formGroup.get(control)?.errors;
    if(e && Object.keys(e).length > 0){
      const firstKey = Object.keys(e)[0];
      // @ts-ignore
      return this.ERROR_CODES[control][firstKey] || e[firstKey];
    }
  }

  logout() {
    this.userService.logOut();
    this.isLoggedIn = false;
  }
}
