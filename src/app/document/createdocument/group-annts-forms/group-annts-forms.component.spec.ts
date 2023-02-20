import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAnntsFormsComponent } from './group-annts-forms.component';

describe('GroupAnntsFormsComponent', () => {
  let component: GroupAnntsFormsComponent;
  let fixture: ComponentFixture<GroupAnntsFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAnntsFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAnntsFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
