export class CreateCustomerDto {
    email: string;
    name: string;
    password: string;
    phoneNumber: string;
    companyId: number;
    active: boolean;
  }
  
  export default CreateCustomerDto;