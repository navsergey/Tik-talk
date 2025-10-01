import {Component, inject, signal} from '@angular/core';
import {ProfileCard} from '../../common-ui/profile-card/profile-card';
import {Profile} from '../../data/interfaces/profile.interface';
import {ProfileService} from '../../data/services/profile';


@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCard
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  protected readonly title = signal('tik-talk');

  profileService = inject(ProfileService);
  profiles:Profile[] = []

  constructor() {
    this.profileService.getTestAccounts().subscribe( val => { //Callback
      this.profiles = val;
    })
  }
}
