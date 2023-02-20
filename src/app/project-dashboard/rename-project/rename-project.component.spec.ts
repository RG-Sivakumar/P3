import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RenameProjectComponent } from './rename-project.component';

describe('RenameProjectComponent', () => {
  let component: RenameProjectComponent;
  let fixture: ComponentFixture<RenameProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
