import {Component, inject, signal} from '@angular/core';
import {ProfileCard} from '../../common-ui/profile-card/profile-card';
import {Profile} from '../../data/interfaces/profile.interface';
import {ProfileService} from '../../data/services/profile';
import {ProfileFilters} from './profile-filters/profile-filters';
import {AsyncPipe} from '@angular/common';


@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCard,
    ProfileFilters,
    AsyncPipe
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  protected readonly title = signal('tik-talk');

  profileService = inject(ProfileService);
  profiles = this.profileService.filteredProfiles

  constructor() {

  }
}
