import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    name: [ 'Test1', [Validators.required, Validators.minLength(2)] ],
    email: [ 'test1@test.com', [Validators.required, Validators.email] ],
    password: [ '123456', [Validators.required, Validators.minLength(6) ] ],
  })

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService ) { }

  ngOnInit(): void {
  }

  register(){
    console.log(this.myForm.value);
    const { name, email, password } = this.myForm.value
    
    this.authService.register(name, email, password)
      .subscribe( res => {
        if ( res === true ) {
          this.router.navigateByUrl('/dashboard');
        }else {
          Swal.fire('Error', res, 'error');
        }
      })

  }
}
