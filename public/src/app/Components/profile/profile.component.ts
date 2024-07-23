import { Component, Input } from '@angular/core';
import { ThemeService } from '../../Services/theme.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @Input() username: string = '';
  @Input() room: string = '';
  constructor(public themeService: ThemeService) {}

}
