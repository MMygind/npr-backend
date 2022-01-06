import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithCompany from '../request-with-company.interface';
import Role from '../role.enum';
 
const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithCompany>();
      const user = request.user;
 
      return user?.role.includes(role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;