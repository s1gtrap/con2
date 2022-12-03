export type Permissions = (keyof PermissionsGranted)[];

export type PermissionsGranted = {
  localStorage: true,
  camera: boolean,
  geolocation: boolean,
} | {
  localStorage: false,
  camera: false,
  geolocation: false,
};

export function isGranted(permissions: Permissions, granted: PermissionsGranted): boolean {
  return permissions.every(p => granted[p]);
}

export function missing(permissions: Permissions, granted: PermissionsGranted): Permissions {
  return permissions.filter(p => !granted[p]);
}