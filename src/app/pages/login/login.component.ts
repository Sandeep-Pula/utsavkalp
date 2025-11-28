import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    error = '';

    onSubmit() {
        if (this.loginForm.valid) {
            // Mock authentication
            const { username, password } = this.loginForm.value;

            if (username === 'admin' && password === 'admin') {
                this.router.navigate(['/admin']);
            } else {
                this.error = 'Invalid credentials. Try admin/admin';
            }
        }
    }
}
