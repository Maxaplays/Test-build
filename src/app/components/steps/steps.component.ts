import { Component, OnInit, Input } from '@angular/core';
import { FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {

    datosbasicos: boolean = true;
    credito: boolean = true;
    solicitudcredito: boolean = true;
    requisitos: boolean = true;
    politicas: boolean = true;
    generacion: boolean = true;
    controlcalidad: boolean = true;
    resumen: boolean = true;

  constructor(private fabricaService: FabricaService) { }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        // console.log('Saludos desde el pasos component del estado ' + data.Estado);
        this.acoplarPantalla(data.Estado);
      });
  }
acoplarPantalla(lblEstadoSolicitud: string) {
    // console.log('Bloqueo de controles de ' + lblEstadoSolicitud);
    if (lblEstadoSolicitud === 'Ingresando' || lblEstadoSolicitud === 'Retornada') {
          this.datosbasicos = false;
          this.credito = false;
    }
    if (lblEstadoSolicitud === 'Documental' || lblEstadoSolicitud === 'Cancelada' ||
        lblEstadoSolicitud === 'Aprobada' || lblEstadoSolicitud === 'Autorizada' ||
        lblEstadoSolicitud === 'Re-Documental' || lblEstadoSolicitud === 'RechazadaCC' ||
        lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Caducada' ||
        lblEstadoSolicitud === 'Perfil No Aprobado' || lblEstadoSolicitud === 'Retornada' ||
        lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'Rechazada' ||
        lblEstadoSolicitud === 'Autorización Caducada') {
          this.datosbasicos = false;
          this.credito = false;
                    if (lblEstadoSolicitud === 'Aprobada') {
                      // console.log('Bloqueado 1' + lblEstadoSolicitud);  
                      // btnSolicitarAnulacion.Visible = false;
                        // BtnEntregarCarpeta.Visible = true;
                        // btnSolicitarAnalisis.Visible = false;
                        // btnMedioAprobacion.Visible = false;
                    } else {
                        if (lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Rechazada' ||
                         lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'RechazadaCC' ||
                          lblEstadoSolicitud === 'Caducada' || lblEstadoSolicitud === 'Autorización Caducada') {
                            // this.pestaniasIngreso.controls['selectTabs'].setValue('Políticas');
                            // console.log('Bloqueado 2' + lblEstadoSolicitud);
                            // btnSolicitarAnulacion.Visible = false;
                            // BtnEntregarCarpeta.Visible = false;
                            // ASPxButton1.Visible = false;
                            // ASPxActualizarSOL.Visible = false;
                            // btnTelefonos.Visible = false;
                            // ASPxActualizarSOLGarante.Visible = false;
                            // btnTelefonosGarante.Visible = false;
                            // btnActualizarDirecciones.Visible = false;
                            // btnConyuge.Visible = false;
                            // btnActualizarReferencias.Visible = false;
                            // ASPxUploadControl1.Visible = false;
                            // ASPxUploadControl2.Visible = false;
                            // ASPxUploadControl3.Visible = false;
                            // btnGenerarReportesDinamicos.Visible = false;
                            // btnRefrescar.Visible = false;
                            // BtnGuardar.Visible = false;
                            // btnSolicitarAnalisis.Visible = false;
                            // btnMedioAprobacion.Visible = false;
                        } else {
                            if (lblEstadoSolicitud === 'Cancelada') {
                              // console.log('Bloqueado 3' + lblEstadoSolicitud);
                                // btnSolicitarAnulacion.Visible = false;
                                // BtnEntregarCarpeta.Visible = false;
                                // btnSolicitarAnalisis.Visible = false;
                                // btnMedioAprobacion.Visible = false;
                            } else {
                              // console.log('Bloqueado 4' + lblEstadoSolicitud);
                                // btnSolicitarAnulacion.Visible = true;
                                // BtnEntregarCarpeta.Visible = false;
                                // btnSolicitarAnalisis.Visible = false;
                            }
                        }
                    }
                } else {
                  // console.log('Bloqueado 5' + lblEstadoSolicitud);
                    // pageControlCliente.TabPages[7].Enabled = false;
                }
  }
}

