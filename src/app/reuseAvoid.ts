import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
import { UserloginComponent } from './projectmanagement/userlogin/userlogin.component';


export class CustomReuseStrategy implements RouteReuseStrategy {

  handlers: { [key: string]: DetachedRouteHandle } = {};

  calcKey(route: ActivatedRouteSnapshot) {
    let next = route;
    let url = "";
    while (next) {
      if (next.url) {
        url = next.url.join('/');
      }
      next = next.firstChild;
    }
    console.log('url', url);
    return url;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log(route.data.reuse);
    // if(route.data.reuse==true){
        console.log('CustomReuseStrategy:shouldDetach', route);
        return true;
    // }
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    console.log(route.data.reuse);
    if(route.data.reuse==true){
    console.log('CustomReuseStrategy:store', route, handle);
    let url = route.url.join("/") || route.parent.url.join("/");
    
    this.handlers[url] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log(route.data.reuse);
    if(route.data.reuse==true){
    console.log('CustomReuseStrategy:shouldAttach', route);
    let url = route.url.join("/") || route.parent.url.join("/");
    
    return !!route.routeConfig && !!this.handlers[url];
    }
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    console.log(route.data.reuse);
    console.log('CustomReuseStrategy:retrieve', route);
    let url = route.url.join("/") || route.parent.url.join("/");
    
    if (!route.routeConfig) return null;
    if(route.routeConfig.loadChildren) return null;
    return this.handlers[url];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // if(this.route.data.reuse==true){
        console.log(future.component,curr.component);
         if (future.component == UserloginComponent) {
            this.handlers = {};
            return false;
          }
          else{
            console.log('CustomReuseStrategy:shouldReuseRoute', future, curr);
            return future.routeConfig === curr.routeConfig;
          }
    // }
  }
}