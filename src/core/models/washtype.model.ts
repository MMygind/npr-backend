import { CompanyModel } from './company.model';

export interface WashtypeModel {
  id?: number;
  name: string;
  price: number;
  company: CompanyModel;
}
