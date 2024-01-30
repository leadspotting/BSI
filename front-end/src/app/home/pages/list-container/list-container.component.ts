import {ActivatedRoute, Params, Router} from '@angular/router';
import { CompanyListModel } from './../../../shared/Models/FinalList-Model';
import {
  ReadyListServer2,
  ReadyList2,
  EmailListServer2,
  EmailList2,
} from './../../../shared/Models/ReadyList-Model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Country } from 'src/app/shared/Models/Country-Model';
import { FinalList } from 'src/app/shared/Models/FinalList-Model';
import { Industry } from 'src/app/shared/Models/Industry-Model';
import { Region } from 'src/app/shared/Models/Region-Model';
import { State } from 'src/app/shared/Models/State-Model';
import { BackEndService } from 'src/app/shared/services/back-end-service';
import {UserServiceService} from "../../../shared/services/user.service.service";
@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss'],
})
export class ListContainerComponent implements OnInit {
  constructor(
    private api: BackEndService,
    private activatedRoute: ActivatedRoute,
    private userService: UserServiceService
  ) {}
  @Output() addToCartEvent = new EventEmitter<any>();
  @Output() cartDrawerEvent = new EventEmitter<any>();

  xml2js = require('xml2js');
  readyLists: ReadyList2[] = [];
  emailLists: EmailList2[] = [];

  crmConfig: any;
  listOfIndustryOption: Array<{ value: string; label: string }> = [];
  listOfIndustryOptionBackup: Array<{ value: string; label: string }> = [];
  selectedIndustryValue: string[] = [];
  industryPhrases = [];
  industries = [];
  selectedLocationValue = [];
  listOfLocationOption: Array<{ value: string; label: string }> = [];
  listOfLocationOptionBackup: Array<{ value: string; label: string }> = [];
  currentPage = 1;
  currentPageSize = 9;
  totalLists = 0;
  originalList: CompanyListModel[] = [];
  filteredList: CompanyListModel[] = [];
  options: any[] = [];
  firstTime = true;
  loadingFinalListss = false;
  selectedCompany: any;
  isVisibleCompanyDetailsModal: boolean = false;
  isVisibleUnauthorizedAccessModal: boolean = false;
  ngOnInit(): void {
    // this.callAndLog();

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const { postId } = params;

      if (postId) {
        this.callAndLog(postId);
      } else {
        this.callAndLog();
      }
    });

    setTimeout(() => {
      this.firstTime = false;
    }, 5000);
  }

  changeFirstTime(event: boolean) {
    this.firstTime = event;
  }

  async callAndLog(postId: string | null = null) {
    this.loadingFinalListss = true;
    await this.getCRMConfig(postId).then((res) => {
      // setTimeout(() => {
      // this.getReadyLists().then((res) => {});
      // }, 1100);
    });
  }

  async getCRMConfig(postId: string | null = null) {
    return this.api.getCrmConfig().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let crmConfig = result.LSResponse.CRMConfigs[0];
        this.crmConfig = crmConfig;
        this.getLocations(crmConfig, postId);
        this.getIndustries(crmConfig);
        this.getIndustryPhrases();
      });
    });
  }

  async getReadyLists(postId: string | null = null) {
    let final: any;
    this.api.getCompaniesList(this.userService.getUserId()).subscribe((res) => {

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('lists', result);

        this.originalList = result.LSResponse.BsiCompany;
        this.currentPage = 1;
        this._paginate(this.originalList);
        this.loadingFinalListss = false;
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
    setTimeout(() => {
      this.listOfIndustryOptionBackup = this.listOfIndustryOption;
    }, 1000);
  }

  getIndustryPhrases() {
    this.api.getIndustryPhrases().subscribe((res) => {
      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let industryPhrases = result.LSResponse.IndustryPhrases;
        this.industryPhrases = industryPhrases;
      });
    });
  }

  getLocations(model: any, postId: string | null = null) {
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
    setTimeout(() => {
      this.listOfLocationOptionBackup = this.listOfLocationOption;

      this.getReadyLists(postId);
      // this.getReadyListEmail();
    }, 1000);
  }

  CompaniesFromOversea = true;
  CompaniesFromIsrael = true;
  companiesFromOverseaClicked() {
    this.CompaniesFromOversea = !this.CompaniesFromOversea;
    this.filter();
  }
  companiesFromIsraelClicked() {
    this.CompaniesFromIsrael = !this.CompaniesFromIsrael;
    this.filter();
  }

  getCountryNameFromId(countryId: any){
    if(Array.isArray(countryId))
      countryId = countryId[0];
    let r = this.listOfLocationOptionBackup.filter(x => x.value.split(",")[0] == countryId)?.[0]?.label;
    if(r){
      r = r.substring(0, r.lastIndexOf(","));
    }
    return r;
  }

  parseLocationIdToListName(locationId: any) {
    let test: any = [];

    // let locations = locationId.split(',');
    let countries: Country[] = this.crmConfig.countries[0].countries;
    let regions: Region[] = this.crmConfig.regions[0].regions;
    let states: State[] = this.crmConfig.states[0].states;
    if (locationId.includes('239')) {
      let stateIdPad = this.padStart(locationId % 100, 2);
      locationId = Math.floor(locationId / 100);

      let countryIdPad = this.padStart(locationId % 1000, 3);
      locationId = Math.floor(locationId / 1000);

      let regionIdPad = this.padStart(locationId, 2);

      let location = {
        country: { id: '', name: '' },
        region: { id: '', name: '' },
        state: { id: '', name: '' },
      };

      let regionn = regions.find(({ id: [id] }) => id === regionIdPad);
      regionn ? (location.region.id = regionn.id[0]) : '';
      regionn ? (location.region.name = regionn.name[0]) : '';
      let countriyy = countries.find((c: any) => {
        if (c.id[0] === countryIdPad) {
          return c;
        }
      });
      countriyy ? (location.country.id = countriyy.id[0]) : '';
      countriyy ? (location.country.name = countriyy.name[0]) : '';

      let statee = states
        .map(({ id: [id], name: [name] }) => ({
          id: [this.padStart(id, 2)],
          name: [name],
        }))
        .find((s: any) => {
          if (s.id[0] === stateIdPad) {
            return s;
          }
        });

      statee ? (location.state.id = statee.id[0]) : '';
      statee ? (location.state.name = statee.name[0]) : '';

      let name =
        location.country.name +
        ' ' +
        location.state.name +
        ' ' +
        location.region.name;

      test = {
        regionId: location.region.id,
        id: location.country.id,
        name: name,
      };
      // console.log('usa', test);

      return test;
    } else {
      let locations = this.getMiddleDigits(locationId);

      let result = countries.filter((country) => locations == country.id[0]);
      // let test = [];
      test = result.map(({ id: [id], name: [name], regionId: [regionId] }) => ({
        regionId: regionId,
        id: id,
        name: name,
      }));
      // console.log('no usa', test[0]);
      return test[0];
    }

    // console.log(regionn, countriyy, statee);

    // return test;
  }

  padStart(number: any, digits: any) {
    return (
      Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number
    );
  }

  getMiddleDigits(number: any) {
    // const numString = number.toString();
    const numLength = number.length;
    const startIndex = Math.floor((numLength - 3) / 2);
    const endIndex = startIndex + 3;
    const middleDigits = number.slice(startIndex, endIndex);
    return middleDigits.replace(/0/g, '');
  }

  getNumberOfLeads(leads: string) {
    let arr = [1, 10, 50, 200, 500, 1000, 5000, 10000, 15000, 20000];
    let closest = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (
        Math.abs(parseInt(leads) - closest) > Math.abs(parseInt(leads) - arr[i])
      ) {
        closest = arr[i];
      }
    }
    return closest;
  }

  roundDownToNearestTen(num: number) {
    let numString = num.toString();
    let firstNum = numString.substring(0, numString.length - 1);
    let zeros = '0'.repeat(1);
    return parseInt(firstNum + zeros);
  }

  onPageIndexChange(event: any) {
    this.currentPage = event;
    this._paginate(this.originalList)
  }
  onPageSizeChange(event: any) {
    this.currentPageSize = event;
    this._paginate(this.originalList);
  }

  getList(currentPage: any, currentPageSize: any, arr: CompanyListModel[]) {
    let list: CompanyListModel[];
    list = arr.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize);
    return list;
  }

  _paginate(list:CompanyListModel[]){
    this.totalLists = list.length;
    this.currentPage = Math.max(1, Math.min(Math.ceil(this.totalLists/this.currentPageSize), this.currentPage));
    this.filteredList = this.getList(
      this.currentPage,
      this.currentPageSize,
      list
    );
  }
  inputValue: string = '';
  // options: Array<{ value: string; category: string; count: number }> = [];
  empty: boolean = false;
  /*
  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (value != '') {
      let list: CompanyListModel[];
      list = this.backUpListss2.filter((list) => {
        return list.name
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      this.backUpListss = list;
      this.currentPage = 1;

      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
      this.currentPage;
      this.options = this.finalListss;

      if (this.finalListss.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    } else {
      this.currentPage = 1;
      this.empty = false;

      this.finalListss = this.getList(
        1,
        this.currentPageSize,
        this.backUpListss2
      );
      this.totalLists = this.finalListss.length - this.currentPageSize;

      this.options = this.backUpListss;
      this.backUpListss = this.backUpListss2;
    }
  }
  */

  onOptionClicked(e: string) {
    if (e != '') {
      let list: CompanyListModel[];
      list = this.originalList.filter((company) => {
        return company.name[0].toLowerCase() == e[0].toLowerCase();
      });
      this.filteredList = list;
      this.currentPage = 1;

      this.filteredList = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
      if (this.filteredList.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    } else {
      this.empty = false;

      this.currentPage = 1;
      this.filteredList = this.getList(
        1,
        this.currentPageSize,
        this.originalList
      );
      this.totalLists = this.filteredList.length;
    }
  }

  /*
  onSearchClicked() {
    let searchInput = this.inputValue;
    if (searchInput != '' && searchInput) {
      let list: CompanyListModel[];
      list = this.backUpListss.filter((list) => {
        return list.name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      this.backUpListss = list;
      this.currentPage = 1;

      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
    } else {
      this.currentPage = 1;
      this.finalListss = this.getList(
        1,
        this.currentPageSize,
        this.backUpListss2
      );
      this.totalLists = this.backUpListss2.length;

      this.backUpListss = this.backUpListss2;
    }
  }
   */

  /*
  uniqueArr(array: any) {
    return array.filter((obj: any, pos: any, arr: any) => {
      return arr.map((mapObj: any) => mapObj.name).indexOf(obj.name) === pos;
    });
  }
   */

  filter() {
    this.filteredList = this.originalList;
    this.listOfLocationOption = this.listOfLocationOptionBackup;
    this.listOfIndustryOption = this.listOfIndustryOptionBackup;
    let list: any[] = [];
    if (
      this.selectedIndustryValue?.length > 0 ||
      this.selectedLocationValue?.length > 0 ||
      this.inputValue.length > 0 ||
      this.CompaniesFromOversea === false ||
      this.CompaniesFromIsrael === false
    ) {
      const filterInputValue: any = this.inputValue ? (Array.isArray(this.inputValue) ? this.inputValue[0]?.toLowerCase()
        : this.inputValue?.toLowerCase()) : null;
      list = this.originalList.filter(
        (item: any) => {
          const c = this.getCountryNameFromId(item.countryId);
          return ((filterInputValue?.length > 0
            ? item.benefits[0]
              .toLowerCase()
              .includes(filterInputValue)
            : true) ||
            (filterInputValue?.length > 0
              ? item.description[0]
                .toLowerCase()
                .includes(filterInputValue)
              : true)
              ||
            (filterInputValue?.length > 0
              ? item.lookingFor[0]
                .toLowerCase()
                .includes(filterInputValue)
              : true) ||
            (filterInputValue?.length > 0
              ? item.name[0]
                .toLowerCase()
                .includes(filterInputValue)
              : true)) &&
          (this.selectedIndustryValue.length > 0
            ? this.selectedIndustryValue.some((name: string) => {
              // return item.originReadyList.industryId == name;
              return item.industryId?.[0]
                ?.split(',')
                ?.some((i: any) => {
                  return i == name;
                });
            })
            : true) &&
          (this.selectedLocationValue.length > 0
            ? this.selectedLocationValue.some((name: string) => {
              return (
                item.countryId[0] == name.split(',')[0]
              );
            })
            : true) &&
          (!(!this.CompaniesFromOversea && !this.CompaniesFromIsrael)) &&
          (!this.CompaniesFromOversea && this.CompaniesFromIsrael
            ? this.getCountryNameFromId(item.countryId) == "Israel"
            : true) &&
          (this.CompaniesFromOversea && !this.CompaniesFromIsrael
            ? this.getCountryNameFromId(item.countryId) != "Israel"
            : true);
        }
      );
      let loc: Array<{ value: string; label: string }> = this.listOfLocationOptionBackup;

      let filteredLocations = loc.filter((location) => {
        for (let company of list) {
          if (company.countryId[0] == location.value.split(',')[0]) {
            return true;
          }
        }
        return false;
      });
      if (filteredLocations.length > 0) {
        this.listOfLocationOption = filteredLocations;
      }
      let ind: Array<{ value: string; label: string }> =
        this.listOfIndustryOptionBackup;
      let filteredIndustries = ind.filter((Industry) => {
        for (let list1 of list) {
          if (list1.industryId == Industry.value) {
            return true;
          }
        }
        return false;
      });
      if (filteredIndustries.length > 0) {
        this.listOfIndustryOption = filteredIndustries;
      }
      this._paginate(list);
    } else {
      this.currentPage = 1;
      this._paginate(this.originalList);
    }
    this.options = this.filteredList;
    this.empty = this.filteredList.length == 0;
  }
  addToCart(listItem: any) {
    this.addToCartEvent.emit(listItem);
  }
  drawerCart(boolean: any) {
    this.cartDrawerEvent.emit(boolean);
  }

  toJson(x: any){
    return JSON.stringify(x);
  }

  showCompanyDetails($event:any, company: any) {
    if (!this.userService.isUserLoggedIn()) {
      this.isVisibleUnauthorizedAccessModal = true;
      $event.stopPropagation();
    } else {
      this.selectedCompany = company;
      this.isVisibleCompanyDetailsModal = true;
    }
  }

  handleCancelCompanyDetailsModal(){
    this.selectedCompany = null;
    this.isVisibleCompanyDetailsModal = false;
  }

  isAuthorized(): boolean{
    return this.userService.isUserLoggedIn();
  }
  preventUnauthorized($event:any | null = null){
    if(!this.userService.isUserLoggedIn()){
      this.isVisibleUnauthorizedAccessModal = true;
      $event?.stopPropagation();
      return true;
    }
    return false;
  }

  handleCancelUnauthorizedAccessModal(){
    this.isVisibleUnauthorizedAccessModal = false;
  }
}
export interface OppPost {
  id: number;
  label: string; // price: Array<string>;
  readyListPosts: Array<OppPostOne>;
}
export interface OppPostOne {
  postId: string;
  headline: string;
  content: string;
  mediaurl: string;
  url: string;
}
