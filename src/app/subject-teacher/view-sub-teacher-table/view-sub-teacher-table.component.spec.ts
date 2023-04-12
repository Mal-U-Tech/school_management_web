import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubTeacherTableComponent } from './view-sub-teacher-table.component';

describe('ViewSubTeacherTableComponent', () => {
  let component: ViewSubTeacherTableComponent;
  let fixture: ComponentFixture<ViewSubTeacherTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubTeacherTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSubTeacherTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
