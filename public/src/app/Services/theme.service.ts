import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = false;

  toggleTheme(): void {
    this.setTheme(!this.isDarkTheme);
  }

  isDark(): boolean {
    return this.isDarkTheme;
  }

  setTheme(isDark: boolean): void {
    this.isDarkTheme = isDark;
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }
}
