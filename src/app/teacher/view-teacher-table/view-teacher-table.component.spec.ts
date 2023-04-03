import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeacherTableComponent } from './view-teacher-table.component';

describe('ViewTeacherTableComponent', () => {
  let component: ViewTeacherTableComponent;
  let fixture: ComponentFixture<ViewTeacherTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTeacherTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTeacherTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
