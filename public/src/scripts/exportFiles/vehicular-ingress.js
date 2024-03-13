//import {generateFile } from "../tools";
import { getFile } from "../endpoints.js";
export const exportVehiIngressIndPdf = async (ar) => {
    // @ts-ignore
    window.jsPDF = window.jspdf.jsPDF;
    // @ts-ignore
    var doc = new jsPDF();
    let params = {
        iniMargen: 5,
        finMargen: 205,
        iniSomb: 6,
        finSomb: 198,
        iniText: 8,
        finPag: 290,
        espEntBloq: 5,
        espIniText: 4
    };
    //Cabecera
    doc.addImage("./public/src/assets/pictures/report.png", "PNG", 8, 15, 30, 10);
    doc.addImage("./public/src/assets/pictures/pcr.png", "PNG", 172, 15, 30, 10);
    doc.setDrawColor(209, 209, 209);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(15);
    doc.line(params.iniMargen, 9.5, params.finMargen, 9.5); //horizontal 1
    doc.line(params.iniMargen, 9.5, params.iniMargen, 30); //vertical 1
    doc.line(params.finMargen, 9.5, params.finMargen, 30); //vertical 2
    doc.line(params.iniMargen, 30, params.finMargen, 30); //horizontal 2
    doc.text(70, 22, `INGRESO DE CONTENEDOR`);
    //Fin Cabecera
    let row = 32;
    //Cuerpo
    doc.line(params.iniMargen, row, params.finMargen, row); //horizontal 1
    doc.line(params.iniMargen, row, params.iniMargen, params.finPag - 6); //vertical 1
    doc.line(params.finMargen, row, params.finMargen, params.finPag - 6); //vertical 2
    doc.line(params.iniMargen, params.finPag - 6, params.finMargen, params.finPag - 6); //horizontal 2
    doc.setFontSize(10);
    let pagina = 1;
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 128);
    doc.text(10, params.finPag, `Página ${pagina}`);
    //doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += 1, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Fecha / Hora");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(32, row, `${ar.ingressDate} ${ar.ingressTime}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F'); //49
    doc.text(params.iniText, row += params.espIniText, "Vigilante de turno");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(40, row, `${ar.manager?.name ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Número del contenedor");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(50, row, `${ar?.containerNro ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Conductor registrado");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(47, row, `${ar?.driver ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Cédula conductor");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(40, row, `${ar?.dni ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Conductor no registrado");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(52, row, `${ar?.unregisteredDriver ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Placa vehículo");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(35, row, `${ar?.licensePlate ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Nro. guía");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(25, row, `${ar?.noGuide ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Departamento");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(35, row, `${ar?.department?.name ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Tipo");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(18, row, `${ar?.type ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 20, 'F');
    doc.text(params.iniText, row += params.espIniText, "Observación");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    var lMargin = params.iniText; //left margin in mm
    var rMargin = 1; //right margin in mm
    var pdfInMM = params.finMargen; //210;  // width of A4 in mm
    var paragraph = doc.splitTextToSize(ar?.observation?.split("\n").join(". ").trim() ?? '', (pdfInMM - lMargin - rMargin));
    doc.text(lMargin, row += 5, paragraph);
    let arrImg = [];
    for (let i = 1; i <= 12; i++) {
        if (i == 1 && ar.image1 != undefined) {
            arrImg.push(ar.image1);
        }
        else if (i == 2 && ar.image2 != undefined) {
            arrImg.push(ar.image2);
        }
        else if (i == 3 && ar.image3 != undefined) {
            arrImg.push(ar.image3);
        }
        else if (i == 4 && ar.image4 != undefined) {
            arrImg.push(ar.image4);
        }
        else if (i == 5 && ar.image5 != undefined) {
            arrImg.push(ar.image5);
        }
        else if (i == 6 && ar.image6 != undefined) {
            arrImg.push(ar.image6);
        }
        else if (i == 7 && ar.image7 != undefined) {
            arrImg.push(ar.image7);
        }
        else if (i == 8 && ar.image8 != undefined) {
            arrImg.push(ar.image8);
        }
        else if (i == 9 && ar.image9 != undefined) {
            arrImg.push(ar.image9);
        }
        else if (i == 10 && ar.image10 != undefined) {
            arrImg.push(ar.image10);
        }
        else if (i == 11 && ar.image11 != undefined) {
            arrImg.push(ar.image11);
        }
        else if (i == 12 && ar.image12 != undefined) {
            arrImg.push(ar.image12);
        }
    }
    row += 12;
    let column = params.iniText + 6;
    for (let i = 0; i < arrImg.length; i++) {
        doc.addImage(await getFile(arrImg[i]), "JPEG", column, row, 40, 44);
        column += 47;
        if (column > 192) {
            /*if ((row + (46)) > (params.finPag - 10)) {
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
                doc.setFontSize(10)
                doc.setTextColor(0, 0, 128);
                doc.text(10, params.finPag, `Página ${pagina}`);
            }
            else {*/
            column = params.iniText + 6;
            row += 46;
            //}
        }
    }
    // Save the PDF
    var d = new Date();
    var title = "INGRESO_" + `${ar?.licensePlate?.trim() ?? ''}` + "_" + d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "_" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds() + `.pdf`;
    doc.save(title);
};
export const exportVehiIngressPdf = async (ar) => {
    // @ts-ignore
    window.jsPDF = window.jspdf.jsPDF;
    // @ts-ignore
    var doc = new jsPDF();
    let pagina = 1;
    for (let i = 0; i < ar.length; i++) {
        let vehicular = ar[i];
        let params = {
            iniMargen: 5,
            finMargen: 205,
            iniSomb: 6,
            finSomb: 198,
            iniText: 8,
            finPag: 290,
            espEntBloq: 5,
            espIniText: 4
        };
        //Cabecera
        doc.addImage("./public/src/assets/pictures/report.png", "PNG", 8, 15, 30, 10);
        doc.addImage("./public/src/assets/pictures/pcr.png", "PNG", 172, 15, 30, 10);
        doc.setDrawColor(209, 209, 209);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(15);
        doc.line(params.iniMargen, 9.5, params.finMargen, 9.5); //horizontal 1
        doc.line(params.iniMargen, 9.5, params.iniMargen, 30); //vertical 1
        doc.line(params.finMargen, 9.5, params.finMargen, 30); //vertical 2
        doc.line(params.iniMargen, 30, params.finMargen, 30); //horizontal 2
        doc.text(70, 22, `INGRESO DE CONTENEDOR`);
        //Fin Cabecera
        let row = 32;
        //Cuerpo
        doc.line(params.iniMargen, row, params.finMargen, row); //horizontal 1
        doc.line(params.iniMargen, row, params.iniMargen, params.finPag - 6); //vertical 1
        doc.line(params.finMargen, row, params.finMargen, params.finPag - 6); //vertical 2
        doc.line(params.iniMargen, params.finPag - 6, params.finMargen, params.finPag - 6); //horizontal 2
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 128);
        doc.text(10, params.finPag, `Página ${pagina}`);
        //doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += 1, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Fecha / Hora");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(32, row, `${vehicular.ingressDate} ${vehicular.ingressTime}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F'); //49
        doc.text(params.iniText, row += params.espIniText, "Vigilante de turno");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(40, row, `${vehicular.manager?.name ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Número del contenedor");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(50, row, `${vehicular?.containerNro ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Conductor registrado");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(47, row, `${vehicular?.driver ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Cédula conductor");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(40, row, `${vehicular?.dni ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Conductor no registrado");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(52, row, `${vehicular?.unregisteredDriver ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Placa vehículo");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(35, row, `${vehicular?.licensePlate ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Nro. guía");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(25, row, `${vehicular?.noGuide ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Departamento");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(35, row, `${vehicular?.department?.name ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
        doc.text(params.iniText, row += params.espIniText, "Tipo");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(18, row, `${vehicular?.type ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 20, 'F');
        doc.text(params.iniText, row += params.espIniText, "Observación");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        var lMargin = params.iniText; //left margin in mm
        var rMargin = 1; //right margin in mm
        var pdfInMM = params.finMargen; //210;  // width of A4 in mm
        var paragraph = doc.splitTextToSize(vehicular?.observation?.split("\n").join(". ").trim() ?? '', (pdfInMM - lMargin - rMargin));
        doc.text(lMargin, row += 5, paragraph);
        let arrImg = [];
        for (let i = 1; i <= 12; i++) {
            if (i == 1 && vehicular.image1 != undefined) {
                arrImg.push(vehicular.image1);
            }
            else if (i == 2 && vehicular.image2 != undefined) {
                arrImg.push(vehicular.image2);
            }
            else if (i == 3 && vehicular.image3 != undefined) {
                arrImg.push(vehicular.image3);
            }
            else if (i == 4 && vehicular.image4 != undefined) {
                arrImg.push(vehicular.image4);
            }
            else if (i == 5 && vehicular.image5 != undefined) {
                arrImg.push(vehicular.image5);
            }
            else if (i == 6 && vehicular.image6 != undefined) {
                arrImg.push(vehicular.image6);
            }
            else if (i == 7 && vehicular.image7 != undefined) {
                arrImg.push(vehicular.image7);
            }
            else if (i == 8 && vehicular.image8 != undefined) {
                arrImg.push(vehicular.image8);
            }
            else if (i == 9 && vehicular.image9 != undefined) {
                arrImg.push(vehicular.image9);
            }
            else if (i == 10 && vehicular.image10 != undefined) {
                arrImg.push(vehicular.image10);
            }
            else if (i == 11 && vehicular.image11 != undefined) {
                arrImg.push(vehicular.image11);
            }
            else if (i == 12 && vehicular.image12 != undefined) {
                arrImg.push(vehicular.image12);
            }
        }
        row += 12;
        let column = params.iniText + 6;
        for (let i = 0; i < arrImg.length; i++) {
            doc.addImage(await getFile(arrImg[i]), "JPEG", column, row, 40, 44);
            column += 47;
            if (column > 192) {
                /*if ((row + (46)) > (params.finPag - 10)) {
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
                else {*/
                column = params.iniText + 6;
                row += 46;
                //}
            }
        }
        if (ar[i + 1] != undefined) {
            doc.addPage();
            pagina += 1;
        }
    }
    // Save the PDF
    var d = new Date();
    var title = "INGRESO_VEHICULAR_" + d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "_" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds() + `.pdf`;
    doc.save(title);
};
export const exportVehiIngressCsv = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let vehicular = ar[i];
        let obj = {
            "Título": `${vehicular?.vehiMarcType ?? ''}`,
            "Fecha": `${vehicular.ingressDate}`,
            "Hora": `${vehicular.ingressTime}`,
            "Encargado Turno": `${vehicular?.manager?.name ?? ''}`,
            "Nro Contenedor": `${vehicular?.containerNro ?? ''}`,
            "Conductor Registrado": `${vehicular?.driver ?? ''}`,
            "Cédula Conductor": `${vehicular?.dni ?? ''}`,
            "Conductor no Registrado": `${vehicular?.unregisteredDriver ?? ''}`,
            "Placa Vehículo": `${vehicular?.licensePlate ?? ''}`,
            "Nro Guía": `${vehicular?.noGuide ?? ''}`,
            "Departamento": `${vehicular?.department?.name ?? ''}`,
            "Proveedor": `${vehicular?.supplier ?? ''}`,
            "Tipo": `${vehicular?.type ?? ''}`,
            "Usuario": `${vehicular?.ingressIssued?.username ?? ''}`,
            "Observación": `${vehicular?.observation?.split("\n").join("(salto)")}`,
        };
        rows.push(obj);
        //}
    }
    generateFile(rows, "INGRESO_VEHICULAR", "csv");
};
export const exportVehiIngressXls = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let vehicular = ar[i];
        let obj = {
            "Título": `${vehicular?.vehiMarcType ?? ''}`,
            "Fecha": `${vehicular.ingressDate}`,
            "Hora": `${vehicular.ingressTime}`,
            "Encargado Turno": `${vehicular?.manager?.name ?? ''}`,
            "Nro Contenedor": `${vehicular?.containerNro ?? ''}`,
            "Conductor Registrado": `${vehicular?.driver ?? ''}`,
            "Cédula Conductor": `${vehicular?.dni ?? ''}`,
            "Conductor no Registrado": `${vehicular?.unregisteredDriver ?? ''}`,
            "Placa Vehículo": `${vehicular?.licensePlate ?? ''}`,
            "Nro Guía": `${vehicular?.noGuide ?? ''}`,
            "Departamento": `${vehicular?.department?.name ?? ''}`,
            "Proveedor": `${vehicular?.supplier ?? ''}`,
            "Tipo": `${vehicular?.type ?? ''}`,
            "Usuario": `${vehicular?.ingressIssued?.username ?? ''}`,
            "Observación": `${vehicular?.observation?.split("\n").join("(salto)")}`,
        };
        rows.push(obj);
        //}
    }
    generateFile(rows, "INGRESO_VEHICULAR", "xls");
};
const generateFile = (ar, title, extension) => {
    //comprobamos compatibilidad
    if (window.Blob && (window.URL || window.webkitURL)) {
        var contenido = "", d = new Date(), blob, reader, save, clicEvent;
        //creamos contenido del archivo
        for (var i = 0; i < ar.length; i++) {
            //construimos cabecera del csv
            if (i == 0)
                contenido += Object.keys(ar[i]).join(";") + "\n";
            //resto del contenido
            contenido += Object.keys(ar[i]).map(function (key) {
                return ar[i][key];
            }).join(";") + "\n";
        }
        //creamos el blob
        blob = new Blob(["\ufeff", contenido], { type: `text/${extension}` });
        //creamos el reader
        // @ts-ignore
        var reader = new FileReader();
        reader.onload = function (event) {
            //escuchamos su evento load y creamos un enlace en dom
            save = document.createElement('a');
            // @ts-ignore
            save.href = event.target.result;
            save.target = '_blank';
            //aquí le damos nombre al archivo
            save.download = title + "_" + d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "_" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds() + `.${extension}`;
            try {
                //creamos un evento click
                clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
            }
            catch (e) {
                //si llega aquí es que probablemente implemente la forma antigua de crear un enlace
                clicEvent = document.createEvent("MouseEvent");
                // @ts-ignore
                clicEvent.click();
            }
            //disparamos el evento
            save.dispatchEvent(clicEvent);
            //liberamos el objeto window.URL
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        };
        //leemos como url
        reader.readAsDataURL(blob);
    }
    else {
        //el navegador no admite esta opción
        alert("Su navegador no permite esta acción");
    }
};
const calculateRow = (length, mode) => {
    let row = 0;
    let limit = 0; // limite de lineas
    if (mode == "parrafo") {
        limit = 47;
    }
    else if (mode == "titulo") {
        limit = 30;
    }
    let lineCount = Math.ceil(length / limit);
    for (let i = 1; i <= lineCount; i++) {
        if (length <= (limit * i)) { //124 caracteres cada linea aprox en total margen A4
            row += (4 * i);
        }
    }
    return row;
};
const newDataBlock = (array, index) => {
    let row = 0;
    if (array[index + 1] != undefined) {
        row += 5;
        let rowTitle = calculateRow(array[index + 1]?.titulo.length, "titulo");
        let rowDescription = calculateRow(array[index + 1]?.contenido.length, "parrafo");
        rowTitle > rowDescription ? row += rowTitle : row += rowDescription;
        if (array[index + 1]?.imagen != '')
            row += 35;
    }
    return row;
};
