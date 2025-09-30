import {Component, Input} from '@angular/core';
import {Profile} from '../../data/interfaces/profile.interface';
import {skip} from 'rxjs';
import {PipesPipe} from '../../helpers/pipes-pipe';

@Component({
  selector: 'app-profile-card',
  imports: [
    PipesPipe
  ],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss'
})
export class ProfileCard {
  @Input() profile!: Profile; // В компонент передаются данные и далее формируется шаблон HTML
  protected readonly skip = skip;
}
