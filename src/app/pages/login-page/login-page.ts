import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  authService = inject(AuthService)
  router = inject(Router)

  form = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  })
 onSubmit() { //В компонент приходит информация с формы
    console.log(this.form.value)
    // if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value).subscribe( response => {
        this.router.navigateByUrl('')}
      );

    }
 }
// }
