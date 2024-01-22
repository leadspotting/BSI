import { ReadyListDownload } from './../../../shared/Models/ReadyListDownload-Model';
import { DomSanitizer } from '@angular/platform-browser';
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
import {Country} from "../../../shared/Models/Country-Model";
import {Region} from "../../../shared/Models/Region-Model";
import {Industry} from "../../../shared/Models/Industry-Model";
import {Validators} from "@angular/forms";

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
    private  _sanitizer: DomSanitizer
  ) {}

  // @Input() company: any;
  private _company:any;
  get company(): any {
    return this._company;
  }
  @Input() set company(value: any){
    this._company = value;
    debugger;
    this.company_youtubeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(value.youtubeUrl);
  }
  showSpinnerSample = false;
  showSpinner = false;
  xml2js = require('xml2js');
  firstTime:boolean = false;

  listOfIndustryOption: Array<{ value: string; label: string }> = [];
  listOfLocationOption: Array<{ value: string; label: string }> = [];

  industryName: string = "";
  countryName: string = "";
  company_youtubeUrl:any;

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
    window.alert("I am here");
    // this.isVisible ? this.paypal() : true;
  }

  isVisibleSample = false;
  benefitsImageHeight: any;

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleSample = false;
    this.isVisiblePaymentSuccess = false;
  }

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
}
