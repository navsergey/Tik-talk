import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../sidebar/sidebar';
import {ProfileService} from '../../data/services/profile';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  profileService = inject(ProfileService);

  ngOnInit() {
    this.profileService.getMe().subscribe()
  }
}
