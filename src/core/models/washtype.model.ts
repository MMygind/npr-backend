import { LocationModel } from './location.model';

export interface WashTypeModel {
  id?: number;
  name: string;
  price: number;
  location: LocationModel;
}
