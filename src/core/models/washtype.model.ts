import { CompanyModel } from './company.model';

export interface WashTypeModel {
  id?: number;
  name: string;
  price: number;
  company: CompanyModel;
}
