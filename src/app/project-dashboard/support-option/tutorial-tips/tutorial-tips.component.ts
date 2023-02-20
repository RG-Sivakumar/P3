import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/projectmanagement/services/login.service';

@Component({
  selector: 'app-tutorial-tips',
  templateUrl: './tutorial-tips.component.html',
  styleUrls: ['./tutorial-tips.component.css']
})
export class TutorialTipsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  projectManagevideolist=[{'name':'Video Title Here'},{'name':'Video Title Here'}];
  projectvideolist=[{'name':'Video Title Here'},{'name':'Video Title Here'}];
  documentvideolist=[{'name':'Video Title Here'},{'name':'Video Title Here'}];

  videolist=[{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'}
                ,{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'},{'name':'Video Title Here'}];

  goBack(){
    this.router.navigateByUrl('projectdashboard/support');
  }

}
