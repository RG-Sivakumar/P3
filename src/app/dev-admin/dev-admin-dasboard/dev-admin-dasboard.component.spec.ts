import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DevAdminDasboardComponent } from './dev-admin-dasboard.component';

describe('DevAdminDasboardComponent', () => {
  let component: DevAdminDasboardComponent;
  let fixture: ComponentFixture<DevAdminDasboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DevAdminDasboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevAdminDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
