export interface FinalList {
  name: string;
  location: FinalLocation;
  originReadyList: FinaloriginReadyList;
}

export interface FinalListt {
  name: string;
  location: FinalLocation;
  originReadyList: FinaloriginReadyList;
  leads: number;
  //{
  //   creationTime: string;
  //   id: string;
  //   industryId: string;
  //   jobCategoryId: string;
  //   leads: string;
  //   locationId: string;
  // };
}

export interface FinalLocation {
  country: { id: string; name: string };
  region: { id: string; name: string };
  state: { id: string; name: string };
}

export interface FinaloriginReadyList {
  creationTime: string;
  id: string;
  industryId: string;
  jobCategoryId: string;
  leads: string;
  locationId: string;
  type: string;
  mediaUrl: string;
  price: string;
}

export interface FinalList2 {
  id: string;
  location: FinalLocation2;
  originReadyList: FinaloriginReadyList2;
}

export interface CompanyListModel {
  id: string;
  name: string;
  url: string;
  logo: string;
  industryId: string;
  countryId: string;
  lookingFor: string;
  benefits: string;
  description: string;
  benefitsImage: string;
  visible: string;
  youtubeUrl: string;
}
export interface FinalLocation2 {
  id: string;
  regionId: string;
  name: string;
}
export interface FinaloriginReadyList2 {
  count: string;
  creationTime: string;
  description: string;
  id: string;
  industryId: string;
  locationId: string;
  mediaUrl: string;
  name: string;
  price: string;
}
