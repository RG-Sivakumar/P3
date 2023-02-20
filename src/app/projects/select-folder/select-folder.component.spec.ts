import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectFolderComponent } from './select-folder.component';

describe('SelectFolderComponent', () => {
  let component: SelectFolderComponent;
  let fixture: ComponentFixture<SelectFolderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
