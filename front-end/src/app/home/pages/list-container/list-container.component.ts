import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/shared/services/back-end-service';
@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss'],
})
export class ListContainerComponent implements OnInit {
  constructor(private api: BackEndService) {}

  xml2js = require('xml2js');
  readyLists: ReadyList[] = [];
  crmConfig: any;
  listOfIndustryOption: Array<{ value: string; label: string }> = [];
  selectedIndustryValue = null;
  industryPhrases = [];
  industries = [];
  selectedLocationValue = null;
  listOfLocationOption: Array<{ value: string; label: string }> = [];
  finalLists: FinalList[] = [];
  currentPage = 1;
  currentPageSize = 10;
  totalPages = -1;
  async callAndLog() {
    await this.getCRMConfig().then((res) => {
      this.getReadyLists();
    });
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
        console.log('CRMCONFIG', crmConfig);
        this.crmConfig = crmConfig;
        this.getLocations(crmConfig);
        this.getIndustries(crmConfig);
      });
    });
  }

  getReadyLists() {
    let final: any;

    this.api.getReadyLists().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let readyLists: ReadyListServer[] = result.LSResponse.ReadyList;
        // console.log('readyLists', readyLists);
        //  = readyLists;
        this.readyLists = readyLists.map(
          ({
            creationTime: [creationTime],
            id: [id],
            industryId: [industryId],
            jobCategoryId: [jobCategoryId],
            leads: [leads],
            locationId: [locationId],
          }) => ({
            creationTime: creationTime,
            id: id,
            industryId: industryId,
            jobCategoryId: jobCategoryId,
            leads: leads,
            locationId: locationId,
            // let newArr = industries.map(({ id: [id], name: [name] }) => ({
            //   value: id,
            //   label: name,
            // }));

            // let region = regions.find(({ id: [id] }) => id === regionId);
            // if (region === undefined) return { id, name };
            // return Object.assign({}, { id, name: `${name}, ${region.name[0]}` });
          })
        );
        console.log('ready Lists', this.readyLists);

        final = this.readyLists.map(
          ({
            creationTime: creationTime,
            id: id,
            industryId: industryId,
            jobCategoryId: jobCategoryId,
            leads: leads,
            locationId: locationId,
          }) => {
            let location = this.parseLocationIdToListName(locationId);
            let namee: any = this.listOfIndustryOption.find(
              ({ value: value }) => value === industryId
            )?.label;
            location.country.name.length > 0
              ? (namee += ', ' + location.country.name)
              : '';
            location.region.name.length > 0
              ? (namee += ', ' + location.region.name)
              : '';
            location.state.name.length > 0
              ? (namee += ', ' + location.state.name)
              : '';

            console.log(namee);

            return Object.assign(
              {},
              {
                name: namee,
                location: location,
                leads: this.getNumberOfLeads(leads),
                originReadyList: {
                  creationTime: creationTime,
                  id: id,
                  industryId: industryId,
                  jobCategoryId: jobCategoryId,
                  leads: leads,
                  locationId: locationId,
                },
              }
            );
          }
        );
        console.log('FinalList', final);
        this.finalLists = final;
        this.totalPages = this.finalLists.length;
        this.finalListss = this.getList(this.currentPage, this.currentPageSize);
      });
    });
  }
  finalListss: FinalList[] = [];

  getList(currentPage: any, currentPageSize: any) {
    return this.finalLists.slice(0, currentPageSize);
  }
  ngOnInit(): void {
    this.callAndLog();

    this.api.getIndustryPhrases().subscribe((res) => {
      // console.log(res);

      this.xml2js.parseString(res, (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        let industryPhrases = result.LSResponse.IndustryPhrases;
        console.log('industryPhrases', industryPhrases);
        this.industryPhrases = industryPhrases;
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
    console.log('listOfIndustryOption', this.listOfIndustryOption);
  }

  getLocations(model: any) {
    let countries: Country[] = model.countries[0].countries;
    let regions: Region[] = model.regions[0].regions;

    let newArr = countries.map(
      ({ id: [id], name: [name], regionId: [regionId] }) => {
        let region = regions.find(({ id: [id] }) => id === regionId);
        if (region === undefined) return { id, name };
        return Object.assign({}, { id, name: `${name}, ${region.name[0]}` });
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
    console.log('finalLocationsArr', finalLocationsArr);
  }

  CompaniesType = true;
  EmailsType = true;
  companiesTypeClicked() {
    this.CompaniesType = !this.CompaniesType;
  }
  emailsTypeClicked() {
    this.EmailsType = !this.EmailsType;
  }

  parseLocationIdToListName(locationId: any) {
    let countries: Country[] = this.crmConfig.countries[0].countries;
    let regions: Region[] = this.crmConfig.regions[0].regions;
    let states: State[] = this.crmConfig.states[0].states;

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

    return location;
  }

  padStart(number: any, digits: any) {
    return (
      Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number
    );
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

  onPageIndexChange(event: any) {}
  onPageSizeChange(event: any) {}
}

export interface ListPost {
  name: string;
  quantity: number;
  description: string;
  img: string;
}

export interface Industry {
  id: Array<string>;
  name: Array<string>;
}

export interface ReadyListServer {
  creationTime: Array<string>;
  id: Array<string>;
  industryId: Array<string>;
  jobCategoryId: Array<string>;
  leads: Array<string>;
  locationId: Array<string>;
}
export interface CrmConfig {
  campaigns: Array<any>;
  countries: Array<any>;
  customerSources: Array<any>;
  defaultTemplates: Array<any>;
  industries: Array<any>;
  linkedinMapping: Array<any>;
  plans: Array<any>;
  positions: Array<any>;
  products: Array<any>;
  regions: Array<any>;
  states: Array<any>;
  statuses: Array<any>;
  tags: Array<any>;
  templates: Array<any>;
  templatesPlaceholders: Array<any>;
}
export interface FinalList {
  name: string;
  location: FinalLocation;
  originReadyList: {
    creationTime: string;
    id: string;
    industryId: string;
    jobCategoryId: string;
    leads: string;
    locationId: string;
  };
}

export interface FinalLocation {
  country: { id: string; name: string };
  region: { id: string; name: string };
  state: { id: string; name: string };
}

export interface ReadyList {
  creationTime: string;
  id: string;
  industryId: string;
  jobCategoryId: string;
  leads: string;
  locationId: string;
}

export interface Country {
  id: Array<string>;
  name: Array<string>;
  regionId: Array<string>;
}

export interface Region {
  id: Array<string>;
  name: Array<string>;
}
export interface Size {
  id: Array<string>;
  name: Array<string>;
}

export interface State {
  id: Array<string>;
  name: Array<string>;
}
