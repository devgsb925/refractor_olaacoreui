import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './api/login.service';
import { ToastService } from '../toast/toast-service';
import { NavigationViewModel } from '../app-ui-layout/navigation/view-model/navigation-view-model';

import { AuthenticateService } from '../security/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  login_form: FormGroup;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private toast: ToastService,
    private router: Router,
    public vmNavigation: NavigationViewModel,
    private vmAuthenticate: AuthenticateService
  ) {
    this.isLoginForm();
  }

  ngOnInit(): void {
    localStorage.clear();

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  isLoginForm() {
    this.login_form = this.fb.group({
      Username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(128),
        ],
      ],
      Password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
        ],
      ],
    });
  }


  login() {
    const model = {
      username: this.login_form.value.Username,
      password: this.login_form.value.Password
    };
    this.toast.doToast();

    this.subscription = this.loginService.login(model).subscribe(
      (res) => {
        if(res.authToken.length > 0){

          localStorage.setItem('auth-token', res.authToken);

          this.vmAuthenticate.activeUserPermissions = res.permissions;

          localStorage.setItem('permissions', JSON.stringify(res.permissions));
          localStorage.setItem('roles', JSON.stringify(res.roles));

        }
      },
      (err) => {
        console.log(err);
      },
      () => {

        this.loginService.pages().subscribe(
          (res) => {
            this.vmAuthenticate.pages = res;
            localStorage.setItem('menu-pages', JSON.stringify(res));

          }, (err) => {
            console.log(err);
          }, () => {
            this.loginService.roles().subscribe(
              (res) => {
                this.vmAuthenticate.roles = res;
                localStorage.setItem('menu-roles', JSON.stringify(res));
              }, (err) => {
                console.log(err);
              }, () => {

                this.toast.closeToast();
                this.router.navigateByUrl('/dashboard');
              }
            );
          }
        );

      }
    );
  }

}
