import { PERMISSIONS } from '../constants/permissions.constant';
import { POLICY } from '../constants/policy.constant';

export interface IPermission {
  id: string;
  name: PERMISSIONS;
  description: string;
  policy: POLICY;

  created_at: Date;
  updated_at: Date;
}
