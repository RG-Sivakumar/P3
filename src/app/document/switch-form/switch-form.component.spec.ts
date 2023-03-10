import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwitchFormComponent } from './switch-form.component';

describe('SwitchFormComponent', () => {
  let component: SwitchFormComponent;
  let fixture: ComponentFixture<SwitchFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
