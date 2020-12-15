import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fabrica-step6',
  templateUrl: './fabrica-step6.component.html',
  styleUrls: ['./fabrica-step6.component.css']
})
export class FabricaStep6Component implements OnInit {
  public idCre: string = 'Defecto';
  private sub: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idCre = params['idCre']; // (+) converts string 'id' to a number
      // console.log('Credito Steps:' + this.idCre);
      // In a real app: dispatch action to load the details here.
    });
  }

}
