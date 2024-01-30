import {BackEndService} from 'src/app/shared/services/back-end-service';
import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserServiceService} from "../../../shared/services/user.service.service";
import {Industry} from "../../../shared/Models/Industry-Model";
import {Country} from "../../../shared/Models/Country-Model";
import {Region} from "../../../shared/Models/Region-Model";

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
        name: [this.company.name, [Validators.required]],
        logo: [this.company.logo, [Validators.required]],
        description: [this.company.description, [Validators.required]],
        industryId: [this.company.industryId, [Validators.required]],
        countryId: [this.company.countryId, [Validators.required]],
        benefits: [this.company.benefits, [Validators.required]],
        benefitsImageUrl: [this.company.benefitsImage, [Validators.required]],
        lookingFor: [this.company.lookingFor, [Validators.required]],
        youtubeUrl: [this.company.youtubeUrl, [Validators.required]],
        domain: [this.company.url, [Validators.required]],
        companyVisible: [this.company.visible, [Validators.required]]
      });
      this.selectedIndustryId = this.company.industryId[0];
      this.selectedCountryId = this.listOfLocationOption.filter(x => x.value.split(",")[0] == this.company.countryId[0])?.[0]?.value;
      this.companyVisible = this.company.visible[0] === "1";
    }
  }
  @Input() company: any;

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

  xml2js = require('xml2js');

  email = false;
  listOfIndustryOption: Array<{ value: string; label: string }> = [];
  listOfLocationOption: Array<{ value: string; label: string }> = [];
  companyVisible:boolean = true;

  selectedIndustryId:string = "";
  selectedCountryId:string = "";
  ngOnInit(): void {
    this.getCRMConfig();
  }

  validateForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);

      const name = this.validateForm.value.name;
      const description = this.validateForm.value.description;
      const industryId = this.validateForm.value.industryId;
      const countryId = this.validateForm.value.countryId?.split(",")?.[0];
      const benefits = this.validateForm.value.benefits;
      const benefitsImageUrl = this.validateForm.value.benefitsImageUrl;
      const lookingFor = this.validateForm.value.lookingFor;
      const youtubeUrl = this.validateForm.value.youtubeUrl;
      const domain = this.validateForm.value.domain;
      const logo = this.validateForm.value.logo;
      const companyVisible = this.validateForm.value.companyVisible;

      this.api.updateUserInfo(this.userService.getUserId(), description, industryId, countryId, benefits,
        benefitsImageUrl, lookingFor, youtubeUrl, logo, name, domain, companyVisible, this.userService.getUserData().UserInfo[0].CSRFToken[0])
        .subscribe((res) => {
          this.onCancel.emit();
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

  async getCRMConfig() {
    return this.api.getCrmConfig().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let crmConfig = result.LSResponse.CRMConfigs[0];
        this.getLocations(crmConfig);
        this.getIndustries(crmConfig);
        // this.getIndustryPhrases();
      });
    });
  }

  getIndustries(model: any) {
    let industries: Industry[] = model.industries[0].industries;
    let newArr = industries.map(({ id: [id], name: [name] }) => ({
      value: id,
      label: name,
    }));

    this.listOfIndustryOption = newArr.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });
  }
  getLocations(model: any) {
    let countries: Country[] = model.countries[0].countries;
    let regions: Region[] = model.regions[0].regions;

    let newArr = countries.map(
      ({ id: [id], name: [name], regionId: [regionId] }) => {
        let region = regions.find(({ id: [id] }) => id === regionId);
        if (region === undefined) return { id, name };
        return Object.assign(
          {},
          { id: `${id},${regionId}`, name: `${name}, ${region.name[0]}` }
        );
      }
    );

    let finalLocationsArr = newArr.map(({ id, name }) =>
      Object.assign({}, { value: id, label: name })
    );
    this.listOfLocationOption = finalLocationsArr.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });
  }
}
