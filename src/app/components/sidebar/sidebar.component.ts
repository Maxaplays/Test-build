import { Component, OnInit } from '@angular/core';
import $ from "jquery";
import { CheckRolesService } from 'src/app/services/checkRoles/check-roles.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  checkRoles = []
  status: boolean = false;
  anio;
  constructor(private checkRolesService: CheckRolesService) {
    this.anio = new Date().getFullYear();
  }

  ngOnInit() {
    this.checkRoles = this.checkRolesService.rolesArray()
    $('#mobile-toggle-menu').on('click', function(){
      $('app-sidebar').toggleClass('show')
    })
    $('#min-max-sidebar').on('click', function(){
      $('.sidebar').toggleClass('min-sidebar');
      $('app-sidebar').toggleClass('min-app-sidebar');
    })
    $('.has-childs').click(function(){
      if($(this).parent().hasClass('active')) {
        $(this).parent().removeClass('active')
      }
      else {
        $(this).parent().addClass('active')
      }
    })
    $('#selectTabs').on('change', function (e) {
      var stringTab = $(this).val().toString();
      document.getElementById(stringTab).click()
    });
    $('#selectSteps').on('change', function (e) {
      var stringStep = $(this).val().toString();
      document.getElementById(stringStep).click()
    });

  }

}

