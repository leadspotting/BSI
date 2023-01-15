import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/shared/Models/Country-Model';
import { FinalList } from 'src/app/shared/Models/FinalList-Model';
import { Industry } from 'src/app/shared/Models/Industry-Model';
import {
  ReadyList,
  ReadyListServer,
} from 'src/app/shared/Models/ReadyList-Model';
import { Region } from 'src/app/shared/Models/Region-Model';
import { State } from 'src/app/shared/Models/State-Model';
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
  selectedIndustryValue: string[] = [];
  industryPhrases = [];
  industries = [];
  selectedLocationValue = [];
  listOfLocationOption: Array<{ value: string; label: string }> = [];
  finalLists: FinalList[] = [];
  currentPage = 1;
  currentPageSize = 10;
  totalPages = -1;
  totalLists = 0;
  finalListss: FinalList[] = [];
  backUpListss: FinalList[] = [];
  backUpListss2: FinalList[] = [];
  options: FinalList[] = [];

  ngOnInit(): void {
    this.callAndLog();
  }

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
        this.getIndustryPhrases();
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
        // this.options = final;

        this.totalPages = this.finalLists.length;
        this.finalListss = this.getList(
          this.currentPage,
          this.currentPageSize,
          final
        );
        this.backUpListss = final;
        this.backUpListss2 = final;
        this.totalLists = this.finalLists.length - this.currentPageSize;
        this.options = this.uniqueArr(this.finalListss);
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

  getIndustryPhrases() {
    this.api.getIndustryPhrases().subscribe((res) => {
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

  onPageIndexChange(event: any) {
    console.log(event);
    this.currentPage = event;
    this.finalListss = this.getList(
      this.currentPage,
      this.currentPageSize,
      this.backUpListss
    );
  }
  onPageSizeChange(event: any) {
    console.log(event);
    this.currentPageSize = event;
    this.finalListss = this.getList(
      this.currentPage,
      this.currentPageSize,
      this.backUpListss
    );
    this.totalLists = this.finalLists.length - this.currentPageSize;
  }

  getList(currentPage: any, currentPageSize: any, arr: FinalList[]) {
    let list: FinalList[];
    currentPage == 1
      ? (list = arr.slice(0, currentPageSize))
      : (list = arr.slice(
          currentPage * currentPageSize,
          currentPage * currentPageSize + currentPageSize
        ));
    return list;
  }

  inputValue: string = '';
  // options: Array<{ value: string; category: string; count: number }> = [];
  empty: boolean = false;
  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    console.log(value);
    if (value != '') {
      let list: FinalList[];
      list = this.backUpListss2.filter((list) => {
        return list.name.toLowerCase().includes(value.toLowerCase());
      });
      this.backUpListss = list;
      this.currentPage = 1;

      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
      this.currentPage;
      this.options = this.finalListss;
      console.log(this.finalListss);

      if (this.finalListss.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
      // this.options = this.uniqueArr(this.finalListss);
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

  onOptionClicked(e: string) {
    console.log(e);
    if (e != '') {
      let list: FinalList[];
      list = this.backUpListss.filter((list) => {
        return list.name.toLowerCase() == e.toLowerCase();
      });
      this.backUpListss = list;
      this.currentPage = 1;

      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
      if (this.finalListss.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    } else {
      this.empty = false;

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

  onSearchClicked() {
    let searchInput = this.inputValue;
    if (searchInput != '' && searchInput) {
      let list: FinalList[];
      list = this.backUpListss.filter((list) => {
        return list.name.toLowerCase().includes(searchInput.toLowerCase());
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

  uniqueArr(array: any) {
    return array.filter((obj: any, pos: any, arr: any) => {
      return arr.map((mapObj: any) => mapObj.name).indexOf(obj.name) === pos;
    });
  }

  // industrySelected() {
  //   console.log(this.selectedIndustryValue);
  //   if (this.selectedIndustryValue?.length > 0) {
  //     // this.finalListss = this.backUpListss.filter((list) => {
  //     //   return list.originReadyList.industryId;
  //     // });
  //     let list: FinalList[] = this.backUpListss.filter((item: FinalList) =>
  //       this.selectedIndustryValue.includes(item.originReadyList.industryId)
  //     );
  //     this.currentPage = 1;

  //     this.finalListss = this.getList(1, this.currentPageSize, list);
  //     this.totalLists = list.length - this.currentPageSize;
  //   }
  // }
  filter() {
    console.log(this.selectedLocationValue);
    console.log(this.inputValue);
    console.log(this.selectedIndustryValue);
    this.backUpListss = this.backUpListss2;
    let list: FinalList[] = [];
    if (
      this.selectedIndustryValue?.length > 0 ||
      this.selectedLocationValue?.length > 0 ||
      this.inputValue.length > 0
    ) {
      list = this.backUpListss.filter(
        (item: FinalList) =>
          // this.selectedIndustryValue.length > 0
          //   ? this.selectedIndustryValue.includes(item.originReadyList.industryId)
          //   : true && this.selectedLocationValue.length > 0
          //   ? this.selectedLocationValue.some((name) => item.name.includes(name))
          //   : true && this.inputValue.length > 0
          //   ? item.name.toLowerCase().includes(this.inputValue.toLowerCase())
          //   : true
          (this.inputValue.length > 0
            ? item.name.toLowerCase().includes(this.inputValue.toLowerCase())
            : true) &&
          (this.selectedIndustryValue.length > 0
            ? // ? this.selectedIndustryValue.includes(item.originReadyList.industryId)
              this.selectedIndustryValue.some((name: string) => {
                return item.originReadyList.industryId == name;
              })
            : true) &&
          (this.selectedLocationValue.length > 0
            ? this.selectedLocationValue.some((name: string) => {
                return (
                  item.location.country.id == name.split(',')[0] &&
                  item.location.region.id == name.split(',')[1]
                );
              })
            : true)
      );
      console.log(list);
      this.backUpListss = list;
      this.currentPage = 1;
      this.finalListss = this.getList(1, this.currentPageSize, list);
      this.totalLists = list.length - this.currentPageSize;
      this.options = this.finalListss;
      if (this.finalListss.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    }
    // if (this.selectedIndustryValue.length == 0) {
    //   this.currentPage = 1;
    //   this.empty = false;

    //   this.finalListss = this.getList(
    //     1,
    //     this.currentPageSize,
    //     this.backUpListss2
    //   );
    //   this.totalLists = this.finalListss.length - this.currentPageSize;

    //   this.options = this.backUpListss;
    //   this.backUpListss = this.backUpListss2;
    //   this.filter();
    // }
    // if (this.selectedLocationValue.length == 0) {
    //   this.currentPage = 1;
    //   this.empty = false;

    //   this.finalListss = this.getList(
    //     1,
    //     this.currentPageSize,
    //     this.backUpListss2
    //   );
    //   this.totalLists = this.finalListss.length - this.currentPageSize;

    //   this.options = this.backUpListss;
    //   this.backUpListss = this.backUpListss2;
    //   this.filter();
    // }

    // else {
    //   this.currentPage = 1;
    //   this.empty = false;

    //   this.finalListss = this.getList(
    //     1,
    //     this.currentPageSize,
    //     this.backUpListss2
    //   );
    //   this.totalLists = this.finalListss.length - this.currentPageSize;

    //   this.options = this.backUpListss;
    //   this.backUpListss = this.backUpListss2;
    // }

    // this.backUpListss = list;
    // this.currentPage = 1;
    // this.finalListss = this.getList(1, this.currentPageSize, list);
    // this.totalLists = list.length - this.currentPageSize;
    // this.options = this.finalListss;
    // console.log(this.finalListss);

    // if (this.finalListss.length == 0) {
    //   this.empty = true;
    // } else {
    //   this.empty = false;
    // }
  }
  // private getRandomInt(max: number, min: number = 0): number {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
}
