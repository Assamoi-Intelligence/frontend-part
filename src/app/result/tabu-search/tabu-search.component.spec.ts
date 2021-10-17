import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabuSearchComponent } from './tabu-search.component';

describe('TabuSearchComponent', () => {
  let component: TabuSearchComponent;
  let fixture: ComponentFixture<TabuSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabuSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabuSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
