import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateformsComponent } from './createforms.component';

describe('CreateformsComponent', () => {
  let component: CreateformsComponent;
  let fixture: ComponentFixture<CreateformsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
