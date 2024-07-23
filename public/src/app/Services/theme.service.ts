
import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme: boolean = false;

  constructor(private overlayContainer: OverlayContainer) { }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }

  isDark(): boolean {
    return this.isDarkTheme;
  }
  setTheme(theme: boolean) {
    this.isDarkTheme = theme;
    this.toggleTheme()
  }
}
