import { Component, OnInit } from '@angular/core';
import $ from "jquery";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  status: boolean = false;

  constructor() { 

  }

  ngOnInit() {
    
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

