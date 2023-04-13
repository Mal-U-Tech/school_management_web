import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmSubTeacherDeleteComponent } from './dialog-confirm-sub-teacher-delete.component';

describe('DialogConfirmSubTeacherDeleteComponent', () => {
  let component: DialogConfirmSubTeacherDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmSubTeacherDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmSubTeacherDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmSubTeacherDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
