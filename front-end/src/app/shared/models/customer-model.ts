export interface CustomerModel {
  id: number;
  companyName: string;
  managementData: {
    statusId: number;
    productId: number;
    actionDate: string;
    campaignId: number;
    comment: string;
    tagsIds: number[];
    dealVolume: string;
    probability: string;
  };
  industryId: number;
  countryId: number;
  leadName: string;
  position: string;
  linkedinURL: string;
  email: string;
  phone: string;
  creationTime: string;
  companyWebsite: string;
  logo: string;
}
