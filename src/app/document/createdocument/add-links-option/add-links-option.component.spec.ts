import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLinksOptionComponent } from './add-links-option.component';

describe('AddLinksOptionComponent', () => {
  let component: AddLinksOptionComponent;
  let fixture: ComponentFixture<AddLinksOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLinksOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLinksOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
