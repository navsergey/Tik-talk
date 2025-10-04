import {Component, inject, input} from '@angular/core';
import {Profile} from '../../data/interfaces/profile.interface';
import {ProfileService} from '../../data/services/profile';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.scss'
})
export class ProfileHeader {
  profileService = inject(ProfileService)
  profile = input<Profile>()
}
