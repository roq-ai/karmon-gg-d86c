interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Owner'],
  customerRoles: [],
  tenantRoles: ['Owner', 'Administrator', 'Moderator'],
  tenantName: 'Company',
  applicationName: 'KARMON GG',
  addOns: ['chat', 'notifications', 'file'],
};
