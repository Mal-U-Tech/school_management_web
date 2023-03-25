import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmDeptDeleteComponent } from './dialog-confirm-dept-delete.component';

describe('DialogConfirmDeptDeleteComponent', () => {
  let component: DialogConfirmDeptDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmDeptDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmDeptDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmDeptDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
