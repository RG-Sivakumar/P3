import { ChangeDetectorRef, Component } from "@angular/core";
import { Router, NavigationStart, RouterEvent, NavigationEnd, ActivatedRoute, ActivationStart, ActivationEnd, RouterStateSnapshot } from "@angular/router";
import { AuthenticationGuard } from "./authentication.guard";
import { AuthguardServiceService } from "./authguard-service.service";
import { EncryptDecryptService } from "./commonshared/services/encrypt-decrypt.service";
import { DataService } from "./data.service";
import { SearchService } from "./search.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "app";
  // loggedin = this.encrptdecrpt.getItem("loggedIn");
  // rememberMe = this.encrptdecrpt.getItem("rememberMe");
  loggedin = this.encrptdecrpt.getItem("loggedIn");//security;
  rememberMe = this.encrptdecrpt.getItem("rememberMe");//security;
  loginChecking: boolean;
  numberOfTimes: number = 0;
  pageLoaderApp: boolean = false;
  exceptRouter: string[] = [
    "login",
    "NewUser",
    "resetpassword",
    "externalUser",
  ];
  userDocument: string[] = [
    'p3/userguidehome'
  ]
  outSide: boolean = false;
  rUrl: string;
  constructor(private router: Router, routingState: SearchService, private cdRef: ChangeDetectorRef, private route: ActivatedRoute,
    private service: AuthenticationGuard, private Authguardservice: AuthguardServiceService,
     private DataService: DataService,private encrptdecrpt:EncryptDecryptService) {
    this.loggedin = this.encrptdecrpt.getItem("loggedIn");//security;
    this.rememberMe = this.encrptdecrpt.getItem("rememberMe");//security;
    let getrememebr = this.encrptdecrpt.getItem("rememberMe");
    let getcode = this.router.parseUrl(this.router.url).queryParams['code'] || '';
    routingState.loadRouting();
    router.events.subscribe((event: any) => {
      window.scroll(0, 0);
      if (event instanceof NavigationStart) {
        console.log('start');
        if (
          this.loggedin === null &&
          !this.exceptRouter.some((m) => event.url.includes(m)) &&
          this.rememberMe == false
        ) {
          this.router.navigateByUrl("projectmanagement/login");
        }
      }
      if (event instanceof NavigationEnd) {
        console.log('end');
        console.log(this.rememberMe);
        console.log(this.loggedin);
        // if (!this.exceptRouter.some((m) => event.url.includes(m))) {
        //   console.log('a',!!this.encrptdecrpt.getItem("rememberMe"));
        //   this.loginChecking = !!this.encrptdecrpt.getItem("rememberMe");
        //   this.getData(event);
        // }
        let routercheck = this.exceptRouter.some((m) => event.url.includes(m));
        if (routercheck == false) {
          let codeVerficiation = this.route.snapshot.queryParamMap.get("code");
          if (codeVerficiation != "null" && codeVerficiation != null) {
            this.ipadTrigger(codeVerficiation);
          }
          else {
            this.loginChecking = this.encrptdecrpt.getItem("rememberMe");//security;
            this.loginChecking = (this.loginChecking == null || this.loginChecking == undefined) ? false : true; 
            // ipadValidChecking = ipadValidChecking == null ? false : true;
            // let ipadValidChecking = !!this.encrptdecrpt.getItem("ipadValidation");
            let ipadValidChecking = this.encrptdecrpt.getItem("ipadValidation");//security;
            ipadValidChecking = (ipadValidChecking == null || ipadValidChecking == undefined) ? false : true;
            if (this.loginChecking == false && event['url'] != "/p3/userInvalid" && !ipadValidChecking) {
              //this.router.navigateByUrl("projectmanagement/login");
              if (event.url == "/p3/userguidehome") {
                this.rUrl = "/p3/userguidehome";
                // localStorage.setItem("returnUrl", this.rUrl);
                this.encrptdecrpt.setItem("returnUrl",this.rUrl);//security
                this.router.navigate(['projectmanagement/login'], { queryParams: { returnUrl: this.rUrl } });
              }
              else if ((event["url"].includes("/p3/userguide/chapter"))) {
                let getSectionId = this.route.snapshot.queryParamMap.get("id");
                let loginChecking = this.encrptdecrpt.getItem("rememberMe");//security;
                loginChecking = (loginChecking == null || loginChecking == undefined) ? false : true;
                if (getSectionId != null && loginChecking == false) {
                  // localStorage.setItem("returnUrl", event["url"]);
                  this.encrptdecrpt.setItem("returnUrl",event["url"]);//security
                  // this.rUrl = this.encrptdecrpt.getItem("returnUrl");
                  this.rUrl = this.encrptdecrpt.getItem("returnUrl");//security;
                  this.router.navigate(['projectmanagement/login'], { queryParams: { returnUrl: this.rUrl } });
                }
                else {
                  this.router.navigate(['projectmanagement/login']);
                }
              }
              else {
                // this.rUrl = this.encrptdecrpt.getItem("returnUrl");
                this.rUrl = this.encrptdecrpt.getItem("returnUrl");//security;
                this.router.navigate(['projectmanagement/login'], { queryParams: { returnUrl: this.rUrl } });
              }            //this.router.navigateByUrl("/login", { queryParams: { returnUrl: state.url } });
            }
            else {
              console.log('web');
              // this.loginChecking = !!this.encrptdecrpt.getItem("rememberMe");
              this.loginChecking = this.encrptdecrpt.getItem("rememberMe");//security;
              this.loginChecking = (this.loginChecking == null || this.loginChecking == undefined) ? false : true; 
              this.webTrigger(event);
            }
          }
        }
      }
    });
  }
  ngOnInit(): void {
    // if (this.rememberMe == "true") {
    //   this.router.navigateByUrl("projectdashboard/myproject");
    // }
  }

  getData(event) {
    console.log(typeof this.loginChecking, this.loginChecking);
    let codeVerficiation = this.route.snapshot.queryParamMap.get("code");
    console.log(codeVerficiation);

    if (this.loginChecking == true) {
      if ((event["url"].includes("p3/userguidehome") || event["url"].includes("chapter-1") || event["url"].includes("chapter-2")
        || event["url"].includes("chapter-3") || event["url"].includes("chapter-4") || event["url"].includes("chapter-5")
        || event["url"].includes("chapter-6") || event["url"].includes("chapter-7") || event["url"].includes("chapter-8") || event["url"].includes("chapter-9") ||
        event["url"].includes("chapter-10") || event["url"].includes("chapter-11") || event["url"].includes("chapter-12"))) {
        console.log('web home');
        let createTag1 = document.createElement("link");
        createTag1.setAttribute("id", "theme-style");
        createTag1.setAttribute("rel", "stylesheet");
        createTag1.setAttribute("href", "assets/css/theme.css");
        let getElement1 = document.getElementsByTagName("body");
        getElement1[0].classList.remove("mat-typography");
        let headTag = document.getElementsByTagName("head");
        headTag[0].appendChild(createTag1);
        this.cdRef.detectChanges();
      }
      else {
        console.log('no outside');
        let getElement1 = document.getElementsByTagName("body");
        getElement1[0].classList.add("mat-typography");
        let getAlllinkElement = document.querySelectorAll("link");
        if (getAlllinkElement != null) {
          for (let i = 0; i < getAlllinkElement.length; i++) {
            if (getAlllinkElement[i].getAttribute("id") == "theme-style") {
              getAlllinkElement[i].remove();
            }
          }
        }
        this.cdRef.detectChanges();
      }
    }
    else if (codeVerficiation != "null" && codeVerficiation != null) {
      console.log(codeVerficiation);
      this.service.getConfirmation(codeVerficiation).subscribe((res) => {
        if (res['response_code'] == 200) {
          console.log('ipad home', res);
          let createTag1 = document.createElement("link");
          createTag1.setAttribute("id", "theme-style");
          createTag1.setAttribute("rel", "stylesheet");
          createTag1.setAttribute("href", "assets/css/theme.css");
          let getElement1 = document.getElementsByTagName("body");
          getElement1[0].classList.remove("mat-typography");
          let headTag = document.getElementsByTagName("head");
          headTag[0].appendChild(createTag1);
          this.cdRef.detectChanges();
        }
        else {
          console.log('ipad login fail');
          this.router.navigateByUrl("p3/userInvalid");
        }
      });
    }
    else if (this.loginChecking == false) {
      console.log('web login fail');
      this.router.navigateByUrl("projectmanagement/login");
    }
    // else {
    //   console.log('no outside');
    //   let getElement1 = document.getElementsByTagName("body");
    //   getElement1[0].classList.add("mat-typography");
    //   let getAlllinkElement = document.querySelectorAll("link");
    //   if (getAlllinkElement != null) {
    //     for(let i=0;i<getAlllinkElement.length;i++){
    //       if(getAlllinkElement[i].getAttribute("id")=="theme-style"){
    //         getAlllinkElement[i].remove();
    //       }
    //     }
    //   }
    //   this.cdRef.detectChanges();
    // }
  }


  ipadTrigger(codeVerficiation) {
    this.DataService.checkPageLoading.emit(false);
    this.service.getConfirmation(codeVerficiation).subscribe((res) => {
      if (res['response_code'] == 200) {
        console.log('ipad home', res);
        // localStorage.setItem("ipadValidation", "yes");
        this.encrptdecrpt.setItem("ipadValidation","yes");//security
        let createTag1 = document.createElement("link");
        createTag1.setAttribute("id", "theme-style");
        createTag1.setAttribute("rel", "stylesheet");
        createTag1.setAttribute("href", "assets/css/theme.css");
        let getElement1 = document.getElementsByTagName("body");
        getElement1[0].classList.remove("mat-typography");
        let headTag = document.getElementsByTagName("head");
        headTag[0].appendChild(createTag1);
        this.DataService.checkPageLoading.emit(true);
        this.DataService.hideButtonAnotherOne.emit(true);
        this.cdRef.detectChanges();
      }
      else {
        console.log('ipad login fail');
        this.router.navigateByUrl("p3/userInvalid");
      }
    });
  }

  webTrigger(event) {
    this.DataService.checkPageLoading.emit(false);
    if ((event["url"].includes("p3/userguidehome") || event["url"].includes("chapter-1") || event["url"].includes("chapter-2")
      || event["url"].includes("chapter-3") || event["url"].includes("chapter-4") || event["url"].includes("chapter-5")
      || event["url"].includes("chapter-6") || event["url"].includes("chapter-7") || event["url"].includes("chapter-8") || event["url"].includes("chapter-9")
      || event["url"].includes("chapter-10") || event["url"].includes("chapter-11") || event["url"].includes("chapter-12"))) {
      console.log('web home');
      let createTag1 = document.createElement("link");
      createTag1.setAttribute("id", "theme-style");
      createTag1.setAttribute("rel", "stylesheet");
      createTag1.setAttribute("href", "assets/css/theme.css");
      let getElement1 = document.getElementsByTagName("body");
      getElement1[0].classList.remove("mat-typography");
      let headTag = document.getElementsByTagName("head");
      headTag[0].appendChild(createTag1);
      this.DataService.checkPageLoading.emit(true);
      this.cdRef.detectChanges();
    }
    else if ((event["url"].includes("/p3/userguide/chapter"))) {
      let getSectionId = this.route.snapshot.queryParamMap.get("id");
      // let loginChecking = !!this.encrptdecrpt.getItem("rememberMe");
      let loginChecking = this.encrptdecrpt.getItem("rememberMe");//security;
      loginChecking = (loginChecking == null || loginChecking == undefined) ? false : true;
      if (getSectionId != null && loginChecking != false) {
        let createTag1 = document.createElement("link");
        createTag1.setAttribute("id", "theme-style");
        createTag1.setAttribute("rel", "stylesheet");
        createTag1.setAttribute("href", "assets/css/theme.css");
        let getElement1 = document.getElementsByTagName("body");
        getElement1[0].classList.remove("mat-typography");
        let headTag = document.getElementsByTagName("head");
        headTag[0].appendChild(createTag1);
        this.DataService.checkPageLoading.emit(true);
        this.cdRef.detectChanges();
      }
      else if (getSectionId != null && loginChecking == false) {
        this.router.navigate(['projectmanagement/login'], { queryParams: { returnUrl: event["url"] } });
      }
      else {
        this.router.navigate(['projectmanagement/login']);
      }
    }
    else {
      console.log('no outside');
      // let ipadValidChecking = !!this.encrptdecrpt.getItem("ipadValidation");
      let ipadValidChecking = this.encrptdecrpt.getItem("ipadValidation");//security;
      ipadValidChecking = (ipadValidChecking == null || ipadValidChecking == undefined) ? false : true;
      if (ipadValidChecking == true) {
        // localStorage.removeItem("ipadValidation");
        this.encrptdecrpt.removeItem('ipadValidation');//security
      }
      let getElement1 = document.getElementsByTagName("body");
      getElement1[0].classList.add("mat-typography");
      let getAlllinkElement = document.querySelectorAll("link");
      if (getAlllinkElement != null) {
        for (let i = 0; i < getAlllinkElement.length; i++) {
          if (getAlllinkElement[i].getAttribute("id") == "theme-style") {
            getAlllinkElement[i].remove();
          }
        }
      }
      this.cdRef.detectChanges();
    }
  }

}

// &&!this.exceptRouter.some((m) => event.url.includes(m))
