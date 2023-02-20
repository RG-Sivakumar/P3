import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/projectmanagement/services/login.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  whichImage="assets/images/Faq/P3_ArrowDown_Blue.png";
  imgclick1:boolean=false;
  imgclick2:boolean=false;
  imgclick3:boolean=false;
  imgclick4:boolean=false;
  imgclick5:boolean=false;

  constructor(private router:Router) { }
  panelOpenState = false;
  ngOnInit(): void {
  }

  imgfunc(exp){
    switch(exp){
      case 1:
        this.imgclick1=!this.imgclick1;
        break;
      case 2:
        this.imgclick2=!this.imgclick2;
        break;
      case 3:
        this.imgclick3=!this.imgclick3;
        break;
      case 4:
        this.imgclick4=!this.imgclick4;
        break;
      case 5:
        this.imgclick5=!this.imgclick5;
    }
  }

  goBack(){
    this.router.navigateByUrl('projectdashboard/support');
  }

}
