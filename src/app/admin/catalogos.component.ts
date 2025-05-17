import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-catalogos',
    templateUrl: './catalogos.component.html',
    styleUrls: ['./catalogos.component.css'],
    standalone: false
})
export class CatalogosComponent implements OnInit {

  nombre: String;

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {

  }

}
