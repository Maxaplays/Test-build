import { RouterModule, Routes } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { MenutopComponent } from './components/menutop/menutop.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarLoginComponent } from './components/sidebar-login/sidebar-login.component';
import { ContentLoginComponent } from './components/content-login/content-login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContentDashboardComponent } from './components/content-dashboard/content-dashboard.component';
import { FabricaComponent } from './components/fabrica/fabrica.component';
import { ContentFabricaComponent } from './components/content-fabrica/content-fabrica.component';
import { FabricaStep2Component } from './components/fabrica-step2/fabrica-step2.component';
import { ContentFabricaCreditoComponent } from './components/content-fabrica-credito/content-fabrica-credito.component';
import { FabricaStep3Component } from './components/fabrica-step3/fabrica-step3.component';
import { ContentFabricaSolicitudCreditoComponent } from './components/content-fabrica-solicitud-credito/content-fabrica-solicitud-credito.component';
import { ContentFabricaRequisitosComponent } from './components/content-fabrica-requisitos/content-fabrica-requisitos.component';
import { FabricaStep4Component } from './components/fabrica-step4/fabrica-step4.component';
import { FabricaStep5Component } from './components/fabrica-step5/fabrica-step5.component';
import { ContentFabricaPoliticasComponent } from './components/content-fabrica-politicas/content-fabrica-politicas.component';
import { FabricaStep6Component } from './components/fabrica-step6/fabrica-step6.component';
import { ContentFabricaGeneracionComponent } from './components/content-fabrica-generacion/content-fabrica-generacion.component';
import { ContentConfiguracionRespuestasComponent } from './components/content-configuracion-respuestas/content-configuracion-respuestas.component';
import { ContentRespuestasComponent } from './components/content-respuestas/content-respuestas.component';
import { FabricaStep7Component } from './components/fabrica-step7/fabrica-step7.component';
import { ContentFabricaControlDeCalidadComponent } from './components/content-fabrica-control-de-calidad/content-fabrica-control-de-calidad.component';
import { GestionarPlantillasComponent } from './components/gestionar-plantillas/gestionar-plantillas.component';
import { ContentGestionarPlantillasComponent } from './components/content-gestionar-plantillas/content-gestionar-plantillas.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { EditarCuentaComponent } from './components/editar-cuenta/editar-cuenta.component';
import { ConsultaGeneralComponent } from './components/consulta-general/consulta-general.component';
import { ContentConsultaGeneralComponent } from './components/content-consulta-general/content-consulta-general.component';
import { VerificacionesComponent } from './components/verificaciones/verificaciones.component';
import { ContentVerificacionesComponent } from './components/content-verificaciones/content-verificaciones.component';
import { ExcepcionesComponent } from './components/excepciones/excepciones.component';
import { ContentExcepcionesComponent } from './components/content-excepciones/content-excepciones.component';
import { ControlDeCalidadComponent } from './components/control-de-calidad/control-de-calidad.component';
import { ContentControlDeCalidadComponent } from './components/content-control-de-calidad/content-control-de-calidad.component';
import { StepsComponent } from './components/steps/steps.component';
import { ModalHistorialComponent } from './components/modal-historial/modal-historial.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from './services/producto/producto.service';
import { TipoContactoService } from './services/tipoContacto/tipo-contacto.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core';
import { LoadingComponent } from './components/loading/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DomseguroPipe } from './pipes/domseguro.pipe';
import { CanActivateGuardGuard } from './guards/can-activate-guard.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExportService } from './services/exportar/export.service';
import { ContentFabricaResumenComponent } from './components/content-fabrica-resumen/content-fabrica-resumen.component';
import { FabricaStep8Component } from './components/fabrica-step8/fabrica-step8.component';
import { BuilderComponent } from './components/builder/builder.component';
import { ContentFabricaCreditoMinComponent } from './components/content-fabrica-credito-min/content-fabrica-credito-min.component';
import { FabricaStep2minComponent } from './components/fabrica-step2min/fabrica-step2min.component';
import { ContentFabricaMinComponent } from './components/content-fabrica-min/content-fabrica-min.component';
import { FabricaMinComponent } from './components/fabrica-min/fabrica-min.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule, GestureConfig, MatDialogModule, MatSnackBarModule } from '@angular/material';
import 'hammerjs';
import { MyDialogComponent } from './components/editar-cuenta/my-dialog/my-dialog.component';
import { MatSelectModule } from '@angular/material';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';
import { ContentEnvioDocumentosComponent } from './components/content-envio-documentos/content-envio-documentos.component';
import { EnvioDocumentosComponent } from './components/envio-documentos/envio-documentos.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'inicio', component: DashboardComponent },
  // { path: 'configuracion/respuestas', component: ContentConfiguracionRespuestasComponent },
  // { path: 'configuracion/respuestas/gestionar-plantillas', component: GestionarPlantillasComponent },
  { path: 'cuenta/editar', component: CuentaComponent },
  { path: 'fabrica/nueva-solicitud', component: FabricaComponent },
  // { path: 'fabrica/nueva-solicitud/credito', component: FabricaStep2Component },
  { path: 'fabrica/nueva-solicitud/solicitud-credito', component: FabricaStep3Component },
  { path: 'fabrica/nueva-solicitud/requisitos', component: FabricaStep4Component },
  { path: 'fabrica/nueva-solicitud/requisitos/:idCre', component: FabricaStep4Component },
  { path: 'fabrica/nueva-solicitud/politicas', component: FabricaStep5Component },
  { path: 'fabrica/nueva-solicitud/politicas/:idCre', component: FabricaStep5Component },
  { path: 'fabrica/nueva-solicitud/generacion', component: FabricaStep6Component },
  { path: 'fabrica/nueva-solicitud/generacion/:idCre', component: FabricaStep6Component },
  { path: 'fabrica/nueva-solicitud/control-de-calidad', component: FabricaStep7Component },
  { path: 'fabrica/nueva-solicitud/control-de-calidad/:idCre', component: FabricaStep7Component },
  { path: 'fabrica/nueva-solicitud/resumen', component: FabricaStep8Component },
  { path: 'fabrica/nueva-solicitud/resumen/:idCre', component: FabricaStep8Component },
  // { path: 'analisis/verificaciones', component: VerificacionesComponent },
  // { path: 'analisis/excepciones', component: ExcepcionesComponent },
  // { path: 'analisis/control-de-calidad', component: ControlDeCalidadComponent },
  { path: 'fabrica/consulta-general', component: ConsultaGeneralComponent },
  { path: 'fabrica/nueva-solicitud/solicitud-credito/:idCre', component: FabricaStep3Component },
  // { path: 'fabrica/nueva-solicitud/credito/:idCre', component: FabricaStep2Component },
  { path: 'fabrica/nueva-solicitud/creditoMin', component: FabricaStep2minComponent },
  { path: 'fabrica/nueva-solicitud/creditoMin/:idCre', component: FabricaStep2minComponent },
  { path: 'fabrica/nueva-solicitud-Min', component: FabricaMinComponent },
  { path: 'builder', component: BuilderComponent },
  {path: 'fabrica/envio-documentos', component: EnvioDocumentosComponent},
];



@NgModule({
  declarations: [
    AppComponent,
    MenutopComponent,
    SidebarComponent,
    SidebarLoginComponent,
    ContentLoginComponent,
    HomeComponent,
    DashboardComponent,
    ContentDashboardComponent,
    FabricaComponent,
    ContentFabricaComponent,
    FabricaStep2Component,
    ContentFabricaCreditoComponent,
    FabricaStep3Component,
    ContentFabricaSolicitudCreditoComponent,
    ContentFabricaRequisitosComponent,
    FabricaStep4Component,
    FabricaStep5Component,
    ContentFabricaPoliticasComponent,
    FabricaStep6Component,
    ContentFabricaGeneracionComponent,
    ContentConfiguracionRespuestasComponent,
    ContentRespuestasComponent,
    FabricaStep7Component,
    ContentFabricaControlDeCalidadComponent,
    GestionarPlantillasComponent,
    ContentGestionarPlantillasComponent,
    CuentaComponent,
    EditarCuentaComponent,
    ConsultaGeneralComponent,
    ContentConsultaGeneralComponent,
    VerificacionesComponent,
    ContentVerificacionesComponent,
    ExcepcionesComponent,
    ContentExcepcionesComponent,
    ControlDeCalidadComponent,
    ContentControlDeCalidadComponent,
    StepsComponent,
    ModalHistorialComponent,
    LoadingComponent,
    DomseguroPipe,
    FabricaStep8Component,
    ContentFabricaResumenComponent,
    BuilderComponent,
    ContentFabricaCreditoMinComponent,
    FabricaStep2minComponent,
    ContentFabricaMinComponent,
    FabricaMinComponent,
    MyDialogComponent,
    ContentEnvioDocumentosComponent,
    EnvioDocumentosComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatSlideToggleModule,
    NgxPaginationModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    CountdownModule
  ],
  entryComponents:[MyDialogComponent],
  exports: [],
  providers: [ExportService,
    {provide: MAT_DATE_LOCALE, useValue: 'es-EC'},
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
    {provide: CountdownGlobalConfig},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
