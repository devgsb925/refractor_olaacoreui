export interface IPagePermissions {
  basePageId: number,
  menuDisplayName: string,
  menuUrl: string,
  menuIcon: string,
  parentId: number,
  orderIndex: number,
  isViewPaged: number,
  isMenuItem: number,
  menuPosition: number,
  readExecute: boolean;
  writeExecut: boolean;
}
