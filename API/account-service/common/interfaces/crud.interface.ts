export interface CRUD {
  create: (resource: any) => Promise<any>;
  readById: (id: string) => Promise<any>;
  patchById: (id: string, resource: any) => Promise<string>;
}