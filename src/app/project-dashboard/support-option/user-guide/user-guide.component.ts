import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/projectmanagement/services/login.service';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.css']
})
export class UserGuideComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  clickarrow() {
    this.router.navigateByUrl("/projectdashboard/support")
  }
}
