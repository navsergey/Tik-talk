import {Component, inject, Input} from '@angular/core';
import {Profile} from '../../../data/interfaces/profile.interface';
import {ProfileService} from '../../../data/services/profile';

@Component({
  selector: 'app-subscriber-card',
  imports: [],
  templateUrl: './subscriber-card.html',
  styleUrl: './subscriber-card.scss'
})
export class SubscriberCard {
  startUrl = inject(ProfileService)
  @Input() profile!: Profile;
}
