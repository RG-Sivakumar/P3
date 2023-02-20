import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RenameComponent } from './rename.component';

describe('RenameComponent', () => {
  let component: RenameComponent;
  let fixture: ComponentFixture<RenameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
