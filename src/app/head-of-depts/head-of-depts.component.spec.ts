import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadOfDeptsComponent } from './head-of-depts.component';

describe('HeadOfDeptsComponent', () => {
  let component: HeadOfDeptsComponent;
  let fixture: ComponentFixture<HeadOfDeptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadOfDeptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadOfDeptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
