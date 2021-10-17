import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabuSearchCrossMoveComponent } from './tabu-search-cross-move.component';

describe('TabuSearchCrossMoveComponent', () => {
  let component: TabuSearchCrossMoveComponent;
  let fixture: ComponentFixture<TabuSearchCrossMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabuSearchCrossMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabuSearchCrossMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
