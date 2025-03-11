import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

// Mock component for testing routes
@Component({
  template: ''
})
class MockPeopleComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: MockPeopleComponent }
        ])
      ],
      declarations: [
        AppComponent,
        MockPeopleComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('UK Parliament Person Manager');
  });

  it('should display the UK Parliament logo', () => {
    const logo = fixture.debugElement.query(By.css('.navbar-logo'));
    expect(logo).toBeTruthy();
    expect(logo.attributes['src']).toBe('/assets/logo.svg');
    expect(logo.attributes['alt']).toBe('UK Parliament logo');
  });

  it('should display the application title in navbar', () => {
    const title = fixture.debugElement.query(By.css('.navbar-title'));
    expect(title.nativeElement.textContent).toContain('Person Manager');
  });

  it('should have a responsive toggle button for mobile', () => {
    const button = fixture.debugElement.query(By.css('.navbar-toggler'));
    expect(button).toBeTruthy();
    expect(button.attributes['data-bs-toggle']).toBe('collapse');
    expect(button.attributes['aria-expanded']).toBe('false');
  });

  it('should have navigation link to People page', () => {
    const navLink = fixture.debugElement.query(By.css('.nav-link'));
    expect(navLink).toBeTruthy();
    expect(navLink.attributes['routerLink']).toBe('/');
    expect(navLink.nativeElement.textContent).toContain('People');
  });

  it('should navigate to People page when link is clicked', async () => {
    const navLink = fixture.debugElement.query(By.css('.nav-link'));
    navLink.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(location.path()).toBe('/');
  });

  it('should have proper ARIA labels for accessibility', () => {
    const toggleButton = fixture.debugElement.query(By.css('.navbar-toggler'));
    expect(toggleButton.attributes['aria-label']).toBe('Toggle navigation');
    expect(toggleButton.attributes['aria-controls']).toBe('navbarNav');
  });

  it('should collapse navbar content in mobile view', () => {
    const navbarContent = fixture.debugElement.query(By.css('.navbar-collapse'));
    expect(navbarContent).toBeTruthy();
    expect(navbarContent.classes['collapse']).toBeTrue();
  });

  it('should have proper Bootstrap classes for styling', () => {
    const navbar = fixture.debugElement.query(By.css('.navbar'));
    expect(navbar.classes['navbar-expand-lg']).toBeTrue();
    expect(navbar.classes['navbar-dark']).toBeTrue();
    expect(navbar.classes['parliament-navbar']).toBeTrue();
  });
});
