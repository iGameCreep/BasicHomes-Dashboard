import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerHomeListComponent } from './server-home-list.component';

describe('ServerHomeListComponent', () => {
  let component: ServerHomeListComponent;
  let fixture: ComponentFixture<ServerHomeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerHomeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerHomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
