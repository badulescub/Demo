import { Component, Pipe, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AzureService, AzureAuthenticationUser } from '../../services/mobile.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loginFailed = false;
    currentUser: any;


    private azureServiceClient: any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private azureService: AzureService
    ) {
        this.buildForm();
    }

    ngOnInit() {
        this.currentUser = this.azureService.isLoggedOn();
    }

    buildForm(): void {
        this.loginForm = this.formBuilder.group({
            'userName': [null, Validators.required],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
            'rememberMe': false
        });

        this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    }

    onValueChanged(data: any): void {
        this.loginFailed = false;
    }

    logout(): void {
        this.azureService.logout().then(() => {
            this.currentUser = null;
            this.router.navigate(['', 'home']);
        });
    }

    loginWithFacebook(): void {

        this.azureService.login('facebook', null).then(() => {
            this.router.navigate(['', 'home']);
        });
    }

    loginWithGoogle(): void {

        this.azureService.login('google', null).then(() => {
            this.router.navigate(['', 'home']);
        });
    }

    loginWithTwitter(): void {

        this.azureService.login('twitter', null).then(() => {
            this.router.navigate(['', 'home']);
        });
    }

    loginWithUserName(value: any): void {

        if (this.loginForm.invalid) return;

        let user = new AzureAuthenticationUser();
        user.userName = value.userName;
        user.password = value.password;

        this.azureService.login('custom', user)
            .then(() => {
                this.router.navigate(['', 'home']);
            })
            .catch((reason) => {
                console.log(reason);
                this.loginFailed = true;
            });
    }
}
