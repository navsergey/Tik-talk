import {Component, effect, inject, ViewChild} from '@angular/core';
import {ProfileHeader} from '../../common-ui/profile-header/profile-header';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileService} from '../../data/services/profile';
import {firstValueFrom} from 'rxjs';
import {AvatarUpload} from './avatar-upload/avatar-upload';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeader,
    ReactiveFormsModule,
    AvatarUpload
  ],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss'
})
export class SettingsPage {
  fb = inject(FormBuilder)
  profileService = inject(ProfileService)
  @ViewChild(AvatarUpload) avatarUploader!: AvatarUpload


  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: [''],
  })

  constructor() {
    effect(() => {
      //@ts-ignore
      // Заполняем форму данными профиля. Значение stack преобразуем в строку
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack) //Перезапись значения поля
      })
    });
  }


  onSave(){
    // Валидируем форму
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity()

    if (this.form.invalid) return  // Если есть ошибки — не отправляем

    // Сначала отправляем аватар, если он выбран
    if (this.avatarUploader.avatar){
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar))
    }
    //@ts-ignore
    // Затем отправляем остальные поля профиля
    firstValueFrom(this.profileService.patchProfile({
      ...this.form.value, // оператор ... “раскладывает” свойства объекта this.form.value firstName, lastName, username?, description, stack?
      stack: this.splitStack(this.form.value.stack)
    }))
  }

  //Превращает значение stack из формы обратно в массив для бэкенда
  splitStack(stack: string | null | string[] | undefined): string[] {
    if(!stack) return []
    if (Array.isArray(stack)) return stack

    return stack.split(',')
  }
  //Превращает stack в строку для формы
  mergeStack(stack: string | null | string[] | undefined){
    if(!stack) return ''
    if (Array.isArray(stack)) return stack.join(',')

    return stack
  }


}
