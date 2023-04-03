import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmTeacherDeleteComponent } from './dialog-confirm-teacher-delete.component';

describe('DialogConfirmTeacherDeleteComponent', () => {
  let component: DialogConfirmTeacherDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmTeacherDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmTeacherDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmTeacherDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
