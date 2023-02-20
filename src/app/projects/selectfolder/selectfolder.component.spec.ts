import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectfolderComponent } from './selectfolder.component';

describe('SelectfolderComponent', () => {
  let component: SelectfolderComponent;
  let fixture: ComponentFixture<SelectfolderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
