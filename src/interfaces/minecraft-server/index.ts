import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface MinecraftServerInterface {
  id?: string;
  ip_address: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface MinecraftServerGetQueryInterface extends GetQueryInterface {
  id?: string;
  ip_address?: string;
  company_id?: string;
}
