import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoogleDriveComponent } from './google-drive.component';

describe('GoogleDriveComponent', () => {
  let component: GoogleDriveComponent;
  let fixture: ComponentFixture<GoogleDriveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleDriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
