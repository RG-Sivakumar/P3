// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  icon: any;
  class: string;
  extralink: boolean;
  label: string;
  labelClass: string;
  submenu: RouteInfo[];
  check:boolean;
  width:string;
  height:string;
}
