const mapping: Record<string, string> = {
  companies: 'company',
  'minecraft-servers': 'minecraft_server',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
