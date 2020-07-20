import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocuemnte.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable()

export class ExportService {

  //let fechaHasta: Date = this.addDays(new Date(), 0);

  constructor() { }

  exportToExcel(json:any[], excelFileName:string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: {'data': worksheet},
      SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook,{bookType:'xlsx',type:'array'});
    //Llamar metodo
    this.saveAsExcel(excelBuffer, excelFileName);
  }

  private saveAsExcel(buffer:any, fileName: string) {
    let fechaHasta: Date = new Date();
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + fechaHasta + EXCEL_EXT);
  }
}
