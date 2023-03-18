import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubjectsTableComponent } from './view-subjects-table.component';

describe('ViewSubjectsTableComponent', () => {
  let component: ViewSubjectsTableComponent;
  let fixture: ComponentFixture<ViewSubjectsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubjectsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSubjectsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
