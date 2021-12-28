import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
    ngOnInit(): void {

    }
    constructor(public authService: AuthService, private router: Router) {
    }


    logout(): void {
        let username = this.authService.getUsuario().nombre;
        this.authService.logout();
        swal.fire('Exito', `Hola ${username} ha cerrado sesión`, 'success');
        this.router.navigate(['/usuarios']);

    }
}