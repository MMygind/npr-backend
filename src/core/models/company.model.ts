import { LocationModel } from './location.model';

export interface CompanyModel {
  id: number;
  name: string;
  creationDate: Date;
  phoneNumber: string;
  email: string;
  locations: LocationModel[];
}
