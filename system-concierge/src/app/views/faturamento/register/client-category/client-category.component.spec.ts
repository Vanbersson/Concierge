import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCategoryComponent } from './client-category.component';

describe('ClientCategoryComponent', () => {
  let component: ClientCategoryComponent;
  let fixture: ComponentFixture<ClientCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
