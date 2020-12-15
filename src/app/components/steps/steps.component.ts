import { Component, OnInit, Input } from '@angular/core';
import { DatosFabrica, FabricaService } from 'src/app/services/fabricaCredito/fabrica.service';
import { Excepcion } from '../../services/documentos/documentos-visualizacion.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {

    datosbasicos: boolean = false;
    credito: boolean = false;
    solicitudcredito: boolean = false;
    requisitos: boolean = false;
    politicas: boolean = false;
    generacion: boolean = false;
    controlcalidad: boolean = false;
    resumen: boolean = false;
    mensajeServicio: DatosFabrica;

  constructor(private fabricaService: FabricaService) { }

  ngOnInit() {
    this.fabricaService.currentMessage.subscribe(
      data => {
        try {
          this.mensajeServicio= data;
          this.acoplarPantalla(data.Estado);
        }catch(Excepcion) {
          this.mensajeServicio= new DatosFabrica();
          this.mensajeServicio.NumeroCredito='';
        }
      });
  }
acoplarPantalla(lblEstadoSolicitud: string) {
    // console.log('Bloqueo de controles de ' + lblEstadoSolicitud);
    if (lblEstadoSolicitud === 'Ingresando' || lblEstadoSolicitud === 'Retornada') {
          this.datosbasicos = true;
          this.credito = true;
    }
    if (lblEstadoSolicitud === 'Documental' || lblEstadoSolicitud === 'Cancelada' ||
        lblEstadoSolicitud === 'Aprobada' || lblEstadoSolicitud === 'Autorizada' ||
        lblEstadoSolicitud === 'Re-Documental' || lblEstadoSolicitud === 'RechazadaCC' ||
        lblEstadoSolicitud === 'Entregada' || lblEstadoSolicitud === 'Caducada' ||
        lblEstadoSolicitud === 'Perfil No Aprobado' || lblEstadoSolicitud === 'Retornada' ||
        lblEstadoSolicitud === 'RechazadaA' || lblEstadoSolicitud === 'Rechazada' ||
        lblEstadoSolicitud === 'Autorización Caducada' || lblEstadoSolicitud === 'Consultada' ||
        lblEstadoSolicitud === 'Devuelta' || lblEstadoSolicitud === 'Verificando') {
          this.datosbasicos = true;
          this.credito = true;
                    if (lblEstadoSolicitud === 'Aprobada') {
                      this.datosbasicos = true;
                      this.credito = true;
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

