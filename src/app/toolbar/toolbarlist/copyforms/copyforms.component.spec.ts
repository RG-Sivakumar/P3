import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CopyformsComponent } from './copyforms.component';

describe('CopyformsComponent', () => {
  let component: CopyformsComponent;
  let fixture: ComponentFixture<CopyformsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
