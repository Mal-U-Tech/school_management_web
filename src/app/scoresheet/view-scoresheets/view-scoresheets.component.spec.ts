import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScoresheetsComponent } from './view-scoresheets.component';

describe('ViewScoresheetsComponent', () => {
  let component: ViewScoresheetsComponent;
  let fixture: ComponentFixture<ViewScoresheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewScoresheetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewScoresheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
