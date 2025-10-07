import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileService} from '../../../data/services/profile';
import {debounceTime, startWith, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-filters',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile-filters.html',
  styleUrl: './profile-filters.scss'
})
export class ProfileFilters {
  fb = inject(FormBuilder)
  profileService = inject(ProfileService)

  searchForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    stack: ['', Validators.required],
  })

  constructor() {
    // Подписка на изменения формы. startWith({}) делает первый вызов сразу,
    // ещё до ввода пользователя. Можно использовать startWith(this.searchForm.value)
    // чтобы отправить начальные значения формы (обычно пустые строки).
    // debounceTime(300) — снижает частоту запросов при быстром вводе.
    // switchMap — отменяет предыдущий запрос, если пришло новое значение.
    // Важно: сервис должен корректно обрабатывать пустые параметры;
    // при необходимости очищайте их перед вызовом (удаляйте пустые строки)
    
    // valueChanges — Observable формы: "эмитит" (отправляет в поток) новый объект значений
    // при каждом изменении полей или программном setValue/patchValue.
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap(formValue => {
          return this.profileService.filterProfiles(formValue);
        }),
        takeUntilDestroyed()
      )
      .subscribe()
  }

}
