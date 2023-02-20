import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/projectmanagement/services/login.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  constructor(private router:Router,private loginService:LoginService) { }

  ngOnInit(): void {
  }

  projectManagevideolist=[{'name':'Video Title Here'},{'name':'Video Title Here'}];
  projectvideolist=[{'name':'Video Title Here'},{'name':'Video Title Here'}];
  documentvideolist=[{'name':'Video Title Here'},{'name':'Video Title Here'}];

  videolist=[{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'}
                ,{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'}];

  goBack(){
    // this.router.navigateByUrl('projectdashboard/support');
    this.loginService.routeChange.emit('Change Support Page');
  }

}
