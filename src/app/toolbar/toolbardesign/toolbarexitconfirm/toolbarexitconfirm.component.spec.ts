import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarexitconfirmComponent } from './toolbarexitconfirm.component';

describe('ToolbarexitconfirmComponent', () => {
  let component: ToolbarexitconfirmComponent;
  let fixture: ComponentFixture<ToolbarexitconfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarexitconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarexitconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
