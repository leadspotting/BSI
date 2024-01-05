// export interface ReadyListServer {
//   creationTime: Array<string>;
//   id: Array<string>;
//   industryId: Array<string>;
//   jobCategoryId: Array<string>;
//   leads: Array<string>;
//   locationId: Array<string>;
//   type: Array<string>;
//   mediaUrl: Array<string>;
//   price: Array<string>;
// }
// export interface ReadyList {
//   creationTime: string;
//   id: string;
//   industryId: string;
//   jobCategoryId: string;
//   leads: string;
//   locationId: string;
//   type: string;
//   mediaUrl: string;
//   price: string;
// }

export interface ReadyListServer2 {
  //count: Array<string>;
  creationTime: Array<string>;
  description: Array<string>;
  id: Array<string>;
  industryId: Array<string>;
  locationId: Array<string>;
  mediaUrl: Array<string>;
  name: Array<string>;
  downloads: Array<string>;
  readyListCalculations: Array<readyListCalculationsServer>;
}

export interface ReadyList2 {
  // count: string;
  downloads: string;

  creationTime: string;
  description: string;
  id: string;
  industryId: string;
  locationId: string;
  mediaUrl: string;
  name: string;
  // price: string;
  readyListCalculations: readyListCalculations;
}
export interface EmailListServer2 {
  campaignId: Array<string>;
  clientId: Array<string>;
  downloads: Array<string>;
  // count: Array<string>;

  creationTime: Array<string>;
  description: Array<string>;
  id: Array<string>;
  industryId: Array<string>;
  // jobCategoryId: Array<string>;
  locationId: Array<string>;
  mediaUrl: Array<string>;
  name: Array<string>;
  // price: Array<string>;
  readyListCalculations: Array<readyListCalculationsServer>;
}

export interface EmailList2 {
  campaignId: string;
  clientId: string;
  downloads: string;
  // count: string;
  creationTime: string;
  description: string;
  id: string;
  industryId: string;
  // jobCategoryId: string;
  locationId: string;
  mediaUrl: string;
  name: string;
  readyListCalculations: readyListCalculations;

  // price: string;
}
export interface readyListCalculationsServer {
  count: Array<string>;
  price: Array<string>;
  roundCount: Array<string>;
}

export interface readyListCalculations {
  count: string;
  price: string;
  roundCount: string;
}
