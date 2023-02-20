import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoreinformationComponent } from './moreinformation.component';

describe('MoreinformationComponent', () => {
  let component: MoreinformationComponent;
  let fixture: ComponentFixture<MoreinformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreinformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
