import { CompanyModel } from './company.model';
import { WashTypeModel } from './washtype.model';

export interface LocationModel {
  id?: number;
  company: CompanyModel;
  name: string;
  address: string;
  postalCode: number;
  city: string;
  latitude?: number;
  longitude?: number;
  washTypes: WashTypeModel[];
}
