//import {generateFile } from "../tools";
import { getFile } from "../endpoints.js";
export const exportVisitIndPdf = async (ar) => {
    // @ts-ignore
    window.jsPDF = window.jspdf.jsPDF;
    // @ts-ignore
    var doc = new jsPDF();
    let params = {
        iniMargen: 15,
        finMargen: 205,
        iniSomb: 16,
        finSomb: 188,
        iniText: 18,
        finPag: 290,
        espEntBloq: 7,
        espIniText: 6
    };
    //Cabecera
    doc.addImage("./public/src/assets/pictures/report.png", "PNG", 20, 15, 30, 10);
    doc.setDrawColor(209, 209, 209);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(15);
    doc.line(params.iniMargen, 9.5, params.finMargen, 9.5); //horizontal 1
    doc.line(params.iniMargen, 9.5, params.iniMargen, 30); //vertical 1
    doc.line(params.finMargen, 9.5, params.finMargen, 30); //vertical 2
    doc.line(params.iniMargen, 30, params.finMargen, 30); //horizontal 2
    doc.text(87, 19, `INGRESO Y SALIDA`);
    doc.text(95, 24, `EMPLEADOS`);
    //Fin Cabecera
    let row = 35;
    //Cuerpo
    doc.line(params.iniMargen, row, params.finMargen, row); //horizontal 1
    doc.line(params.iniMargen, row, params.iniMargen, params.finPag - 8); //vertical 1
    doc.line(params.finMargen, row, params.finMargen, params.finPag - 8); //vertical 2
    doc.line(params.iniMargen, params.finPag - 8, params.finMargen, params.finPag - 8); //horizontal 2
    doc.setFontSize(10);
    let pagina = 1;
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 128);
    doc.text(10, params.finPag, `Página ${pagina}`);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += 1, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Fecha / Hora");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(42, row, `${ar.creationDate} ${ar.creationTime}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F'); //49
    doc.text(params.iniText, row += params.espIniText, "Vigilante de turno");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(50, row, `${ar.user?.username ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Estado");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(33, row, `${ar?.type == 'Guardia' ? ar?.visitState?.name == 'Emergente' ? 'Ingreso' : 'Salida' : ar?.visitState?.name ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Empleado");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(38, row, `${ar?.firstName ?? ''} ${ar?.firstLastName ?? ''} ${ar?.secondLastName ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Cédula");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(33, row, `${ar?.dni ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Tipo");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(28, row, `${ar?.type ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 20, 'F');
    doc.text(params.iniText, row += params.espIniText, "Motivo / Observación");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    var lMargin = params.iniText; //left margin in mm
    var rMargin = 1; //right margin in mm
    var pdfInMM = params.finMargen; //210;  // width of A4 in mm
    var paragraph = doc.splitTextToSize(ar?.reason?.split("\n").join(". ").trim() ?? '', (pdfInMM - lMargin - rMargin));
    doc.text(lMargin, row += 5, paragraph);
    let arrImg = [];
    for (let i = 1; i <= 1; i++) {
        if (i == 1 && ar.image != undefined) {
            arrImg.push(ar.image);
        }
    }
    row += 12;
    let column = 90;//params.iniText;
    for (let i = 0; i < arrImg.length; i++) {
        doc.addImage(await getFile(arrImg[i]), "JPEG", column, row, 44, 44);
        column += 47;
        if (column > 192) {
            if ((row + (46)) > (params.finPag - 10)) {
                doc.addPage();
                column = params.iniText;
                row = 9.5;
                doc.setDrawColor(209, 209, 209);
                doc.line(params.iniMargen, row, params.finMargen, row); //horizontal 1
                doc.line(params.iniMargen, row, params.iniMargen, params.finPag - 8); //vertical 1
                doc.line(params.finMargen, row, params.finMargen, params.finPag - 8); //vertical 2
                doc.line(params.iniMargen, params.finPag - 8, params.finMargen, params.finPag - 8); //horizontal 2
                row += 2;
                pagina += 1;
                doc.setFont(undefined, 'bold');
                //doc.setFontSize(10)
                doc.setTextColor(0, 0, 128);
                doc.text(10, params.finPag, `Página ${pagina}`);
            }
            else {
                column = params.iniText;
                row += 46;
            }
        }
    }
    // Save the PDF
    var d = new Date();
    var title = "log_VisitInd_" + d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear() + `.pdf`;
    doc.save(title);
};