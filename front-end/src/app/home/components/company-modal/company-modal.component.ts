import {DomSanitizer} from '@angular/platform-browser';
import {BackEndService} from 'src/app/shared/services/back-end-service';
import {Component, Input, OnInit,} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {Country} from "../../../shared/Models/Country-Model";
import {Region} from "../../../shared/Models/Region-Model";
import {Industry} from "../../../shared/Models/Industry-Model";
import {UserServiceService} from "../../../shared/services/user.service.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
// @ts-ignore - no typescript in this module, therefore the ts-ignore annotation.
import {findFlagUrlByCountryName} from 'country-flags-svg';

@Component({
  selector: 'company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.scss'],
})
export class CompanyModalComponent implements OnInit {
  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    private api: BackEndService,
    private  _sanitizer: DomSanitizer,
    private userService: UserServiceService,
    private fb: UntypedFormBuilder
  ) {}

  validateForm!: UntypedFormGroup;

  // @Input() company: any;
  private _company:any;
  get company(): any {
    return this._company;
  }

  @Input() set company(value: any) {
    this._company = value;
    this.company_youtubeUrl = null;
    if (value) {
      this.validateForm = this.fb.group({
        message: ["", [Validators.required]]
      });
      if(value.url) {
        let url = value.url[0];
        if(url?.indexOf("://") < 0
          && url.indexOf("http") < 0)
          url = `https://${url}`;
        this.company_url = url;
      } else {
        this.company_url = null;
      }

      if (value.youtubeUrl) {
        let url = value.youtubeUrl;
        if (Array.isArray(url)) {
          url = url[0];
        }
        try {
          url = new URL(url);
          const hostname = url.hostname.toLowerCase();
          const v = url.searchParams.get("v");

          if ((hostname.indexOf("www.youtube.") == 0
              || hostname.indexOf("youtube.") == 0
              || hostname.indexOf("www.youtu.be") == 0
              || hostname.indexOf("youtu.be") == 0)
            && v != null) {
            url = `https://${hostname}/embed/${v}`
          }
          this.company_youtubeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
        } catch (e) {
          this.company_youtubeUrl = null;
        }
      }
    }
  }
  showSpinnerSample = false;
  showSpinner = false;
  xml2js = require('xml2js');
  firstTime:boolean = false;
  showMessageForIntroduction: boolean = false;
  messageSendSuccessfully: boolean = false;

  listOfIndustryOption: Array<{ value: string; label: string }> = [];
  listOfLocationOption: Array<{ value: string; label: string }> = [];

  industryName: string = "";
  countryName: string = "";
  company_youtubeUrl:any;
  company_url:any;

  email = false;
  ngOnInit(): void {
    this.getCRMConfig();

    const $this = this;
    this.returnPhotoURL().then(function(value){
      const imgBenefitsImage = document.getElementById("imgBenefitsImage");
      if(imgBenefitsImage == null)
        return;
      if (value) {
        imgBenefitsImage.style.backgroundImage = "url('" + value + "')";
        imgBenefitsImage.style.height = `${$this.benefitsImageHeight}px`;
      } else {
        imgBenefitsImage.style.display = 'none';
      }
    });
  }

  isVisiblePaymentSuccess = false;

  isVisible = false;
  showModal(): void {
    this.isVisible = true;
    this.showSpinner = true;
    this.showMessageForIntroduction = true;

  }

  isVisibleSample = false;
  benefitsImageHeight: any;

  openCompanyDetails($event: any){
    this.firstTime = !this.firstTime;
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
    this.countryName = this.listOfLocationOption.filter(x => x.value.split(",")[0] == this.company.countryId[0])?.[0]?.label;
    if(this.countryName){
      this.countryName = this.countryName.substring(0, this.countryName.lastIndexOf(","));
    }
  }

  getFlagUrl(countryName: string) {
    const flagUrl = findFlagUrlByCountryName(countryName);
    return flagUrl ? flagUrl : null;
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

    this.industryName = this.listOfIndustryOption.filter(x => x.value == this.company.industryId[0])?.[0]?.label;
  }


  returnPhotoURL(){
    const $this = this;
    return new Promise(function(resolve, reject){
      var img = new Image();
      //if the user does not have a photoURL let's try and get one from gravatar
      if ($this.company.benefitsImage) {
        img.addEventListener('load', function() {
          $this.benefitsImageHeight = (422 * img.height / img.width);
          resolve ($this.company.benefitsImage);
        }, false);
        img.addEventListener('error', function() {
          resolve (null);
        }, false);
        img.src = $this.company.benefitsImage;
      }
    });
  }

  submitForm() {
    const message = this.validateForm.value.message;

    this.api.makeIntroduction(this.userService.getUserId(), this.company.id, message)
      .subscribe((res) => {
        this.showMessageForIntroduction = false;
        this.messageSendSuccessfully = true;
        setTimeout(() => {
          this.messageSendSuccessfully = false
        }, 3000);
      });
  }

  cancel() {

    this.showMessageForIntroduction = false;
  }

  openCompanyUrl() {
    window.open(this.company_url, "_blank");
  }
}
