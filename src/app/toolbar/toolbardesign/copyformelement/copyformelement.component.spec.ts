import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CopyformelementComponent } from './copyformelement.component';

describe('CopyformelementComponent', () => {
  let component: CopyformelementComponent;
  let fixture: ComponentFixture<CopyformelementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyformelementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyformelementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
