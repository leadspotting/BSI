export interface FinalList {
  name: string;
  location: FinalLocation;
  originReadyList: FinaloriginReadyList;
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
}
