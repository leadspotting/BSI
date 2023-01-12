export interface ReadyListServer {
  creationTime: Array<string>;
  id: Array<string>;
  industryId: Array<string>;
  jobCategoryId: Array<string>;
  leads: Array<string>;
  locationId: Array<string>;
}

export interface ReadyList {
  creationTime: string;
  id: string;
  industryId: string;
  jobCategoryId: string;
  leads: string;
  locationId: string;
}
