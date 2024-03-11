/*export const exportVisitPdf = (ar: any, start: any, end: any) => {
    // @ts-ignore
    window.jsPDF = window.jspdf.jsPDF;
    // @ts-ignore
    var doc = new jsPDF();
    doc.addImage("./public/src/assets/pictures/report.png", "PNG", 10, 10, 30, 10);
    doc.setDrawColor(0, 0, 128);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 128);
    doc.setFontSize(25);
    doc.text(10, 30, `Visitas`);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'italic');
    doc.text(135, 30, `Fecha: Desde ${start} Hasta ${end}`);
    //construimos cabecera del csv
    doc.setFont(undefined, 'bold');
    doc.line(5, 34.8, 205, 34.8);
    doc.setFillColor(210, 210, 210);
    doc.rect(5, 35, 200, 10, 'F');
    doc.text(10, 40, "Nombre");
    doc.text(60, 40, "DNI");
    doc.text(90, 40, "Fecha");
    doc.text(110, 40, "Hora");
    doc.text(130, 40, "Usuario");
    doc.text(180, 40, "Estado");;
    doc.line(5, 45, 205, 45);
    let row = 50;
    let pagina = 1;
    doc.setTextColor(0, 0, 128);
    doc.text(10, 290, `Página ${pagina}`);
    //resto del contenido
    for (let i = 0; i < ar.length; i++) {
        let visit = ar[i];
        let rowName1 = 0;
        let rowName2 = 0;
        // @ts-ignore
        //if (visit.creationDate >= start && visit.creationDate <= end) {
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(10, row, splitText(doc, `${visit?.firstName ?? ''} ${visit?.firstLastName ?? ''} ${visit?.secondLastName ?? ''}`, 10, 5, 60));
            doc.text(60, row, `${visit.dni}`);
            doc.text(90, row, `${visit.creationDate}`);
            doc.text(110, row, `${visit.creationTime}`);
            doc.text(130, row, splitText(doc, `${visit.user?.firstName ?? ''} ${visit.user?.lastName ?? ''}`, 130, 5, 180));
            doc.text(180, row, `${visit.visitState?.name ?? ''}`);

            rowName1 = calculateRow(`${visit?.firstName ?? ''} ${visit?.firstLastName ?? ''} ${visit?.secondLastName ?? ''}`.length,"nombre");
            rowName2 = calculateRow(`${visit.user?.firstName ?? ''} ${visit.user?.lastName ?? ''}`.length,"nombre");
            rowName1 > rowName2 ? row += rowName1 : row += rowName2
            
            doc.setDrawColor(210, 210, 210);
            doc.line(5, row, 205, row);
            if ((row+newDataBlock(ar,i)) > 280) {
                doc.addPage();
                row = 30;
                pagina += 1;
                doc.setFontSize(10);
                doc.setFont(undefined, 'italic');
                doc.text(135, 10, `Fecha: Desde ${start} Hasta ${end}`);
                doc.setFont(undefined, 'bold');
                //construimos cabecera del csv
                doc.setDrawColor(0, 0, 128);
                doc.line(5, 15, 205, 15);
                doc.setFillColor(210, 210, 210);
                doc.rect(5, 15, 200, 10, 'F');
                doc.text(10, 20, "Nombre");
                doc.text(60, 20, "DNI");
                doc.text(90, 20, "Fecha");
                doc.text(110, 20, "Hora");
                doc.text(130, 20, "Usuario");
                doc.text(180, 20, "Estado");
                doc.line(5, 25, 205, 25);
                doc.setTextColor(0, 0, 128);
                doc.text(10, 290, `Página ${pagina}`);
            }else{
                row += 5;
            }
        //}
    }
    // Save the PDF
    var d = new Date();
    var title = "log_Visitas_" + d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear() + `.pdf`;
    doc.save(title);
}*/
import { getFile } from "../endpoints.js";
export const exportVisitPdf = async (ar, start, end) => {
    // @ts-ignore
    window.jsPDF = window.jspdf.jsPDF;
    // @ts-ignore
    var doc = new jsPDF();
    let pagina = 1;
    for (let i = 0; i < ar.length; i++) {
        let visit = ar[i];
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
        doc.addImage("./public/src/assets/pictures/pcr.png", "PNG", 172, 15, 30, 10);
        doc.setDrawColor(209, 209, 209);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
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
        //let pagina = 1;
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
        doc.text(42, row, `${visit?.type == 'Guardia' ? visit?.visitState?.name == 'Emergente' ? `${visit?.ingressDate} ${visit?.ingressTime}` : `${visit?.egressDate} ${visit?.egressTime}` : visit?.visitState?.name == 'Pendiente' ? `${visit?.creationDate} ${visit?.creationTime}` : visit?.visitState?.name == 'En Curso' ? `${visit?.ingressDate} ${visit?.ingressTime}` : `${visit?.egressDate} ${visit?.egressTime}`}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F'); //49
        doc.text(params.iniText, row += params.espIniText, "Vigilante / Encargado");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(56, row, `${visit.type == "Guardia" ? visit?.manager?.name ?? '' : visit?.authorizer ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F'); //49
        doc.text(params.iniText, row += params.espIniText, "Usuario");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(34, row, `${visit.user?.username ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
        doc.text(params.iniText, row += params.espIniText, "Estado");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(33, row, `${visit?.type == 'Guardia' ? visit?.visitState?.name == 'Emergente' ? 'Ingreso' : 'Salida' : visit?.visitState?.name ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
        doc.text(params.iniText, row += params.espIniText, "Empleado");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(38, row, `${visit?.firstName ?? ''} ${visit?.firstLastName ?? ''} ${visit?.secondLastName ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
        doc.text(params.iniText, row += params.espIniText, "Cédula");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(33, row, `${visit?.dni ?? ''}`);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(244, 244, 244);
        doc.setFillColor(244, 244, 244);
        doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
        doc.text(params.iniText, row += params.espIniText, "Tipo");
        doc.setFont(undefined, 'normal');
        doc.setTextColor(87, 80, 73);
        doc.text(28, row, `${visit?.type ?? ''}`);
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
        var paragraph = doc.splitTextToSize(visit?.reason?.split("\n").join(". ").trim() ?? '', (pdfInMM - lMargin - rMargin));
        doc.text(lMargin, row += 5, paragraph);
        let arrImg = [];
        for (let i = 1; i <= 8; i++) {
            if (i == 1 && visit.image != undefined) {
                arrImg.push(visit.image);
            }
            else if (i == 2 && visit.image2 != undefined) {
                arrImg.push(visit.image2);
            }
            else if (i == 3 && visit.image3 != undefined) {
                arrImg.push(visit.image3);
            }
            else if (i == 4 && visit.image4 != undefined) {
                arrImg.push(visit.image4);
            }
            else if (i == 5 && visit.image5 != undefined) {
                arrImg.push(visit.image5);
            }
            else if (i == 6 && visit.image6 != undefined) {
                arrImg.push(visit.image6);
            }
            else if (i == 7 && visit.image7 != undefined) {
                arrImg.push(visit.image7);
            }
            else if (i == 8 && visit.image8 != undefined) {
                arrImg.push(visit.image8);
            }
        }
        row += 12;
        let column = params.iniText;
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
                column = params.iniText;
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
    var title = "VISITA_" + `${ar?.dni?.trim() ?? ''}` + "_" + d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "_" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds() + `.pdf`;
    doc.save(title);
};
export const exportVisitCsv = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let visit = ar[i];
        // @ts-ignore
        //if(visit.creationDate >= start && visit.creationDate <= end){
        let obj = {
            "Nombre": `${visit.firstName} ${visit.firstLastName} ${visit.secondLastName}`,
            "DNI": `${visit.dni}`,
            "Fecha Creación": `${visit.creationDate}`,
            "Hora Creación": `${visit.creationTime}`,
            "Usuario": `${visit.user?.firstName ?? ''} ${visit.user?.lastName ?? ''}`,
            "Tipo": `${verifyUserType(visit.user.userType)}`,
            "Departamento": `${visit.department?.name ?? ''}`,
            "Estado": `${visit?.type == 'Guardia' ? visit?.visitState?.name == 'Emergente' ? 'Ingreso' : 'Salida' : visit?.visitState?.name ?? ''}`,
            "Verificado": `${visit.verifiedDocument ? 'Si' : 'No'}`,
            "Favorita": `${visit.favorite ? 'Si' : 'No'}`,
            "Teléfono": `${visit?.phoneNumber ?? ''}`,
            "Encargado / Autorizado": `${visit.type == "Guardia" ? visit?.manager?.name ?? '' : visit?.authorizer ?? ''}`,
            "Fecha Ingreso": `${visit.ingressDate}`,
            "Hora Ingreso": `${visit.ingressTime}`,
            "Emitido Ingreso": `${visit.ingressIssuedId?.firstName ?? ''} ${visit.ingressIssuedId?.lastName ?? ''}`,
            "Fecha Salida": `${visit?.egressDate ?? ''}`,
            "Hora Salida": `${visit?.egressTime ?? ''}`,
            "Emitido Salida": `${visit.egressIssuedId?.firstName ?? ''} ${visit.egressIssuedId?.lastName ?? ''}`,
            "Asunto": `${visit.reason.split("\n").join("(salto)")}`,
        };
        rows.push(obj);
        //}
    }
    generateFile(rows, "VISITAS", "csv");
};
export const exportVisitXls = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let visit = ar[i];
        // @ts-ignore
        //if(visit.creationDate >= start && visit.creationDate <= end){
        let obj = {
            "Nombre": `${visit.firstName} ${visit.firstLastName} ${visit.secondLastName}`,
            "DNI": `${visit.dni}`,
            "Fecha Creación": `${visit.creationDate}`,
            "Hora Creación": `${visit.creationTime}`,
            "Usuario": `${visit.user?.firstName ?? ''} ${visit.user?.lastName ?? ''}`,
            "Tipo": `${verifyUserType(visit.user.userType)}`,
            "Departamento": `${visit.department?.name ?? ''}`,
            "Estado": `${visit?.type == 'Guardia' ? visit?.visitState?.name == 'Emergente' ? 'Ingreso' : 'Salida' : visit?.visitState?.name ?? ''}`,
            "Verificado": `${visit.verifiedDocument ? 'Si' : 'No'}`,
            "Favorita": `${visit.favorite ? 'Si' : 'No'}`,
            "Teléfono": `${visit?.phoneNumber ?? ''}`,
            "Encargado / Autorizado": `${visit.type == "Guardia" ? visit?.manager?.name ?? '' : visit?.authorizer ?? ''}`,
            "Fecha Ingreso": `${visit.ingressDate}`,
            "Hora Ingreso": `${visit.ingressTime}`,
            "Emitido Ingreso": `${visit.ingressIssuedId?.firstName ?? ''} ${visit.ingressIssuedId?.lastName ?? ''}`,
            "Fecha Salida": `${visit?.egressDate ?? ''}`,
            "Hora Salida": `${visit?.egressTime ?? ''}`,
            "Emitido Salida": `${visit.egressIssuedId?.firstName ?? ''} ${visit.egressIssuedId?.lastName ?? ''}`,
            "Asunto": `${visit.reason.split("\n").join("(salto)")}`,
        };
        rows.push(obj);
        //}
    }
    generateFile(rows, "VISITAS", "xls");
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
const verifyUserType = (userType) => {
    if (userType == 'CUSTOMER') {
        return 'Cliente';
    }
    else if (userType == 'GUARD') {
        return 'Guardia';
    }
    else if (userType == 'EMPLOYEE') {
        return 'Empleado';
    }
    else if (userType == 'CONTRACTOR') {
        return 'Contratista';
    }
    else {
        return userType;
    }
};
const calculateRow = (length, mode) => {
    let row = 0;
    let limit = 0; // limite de lineas
    if (mode == "parrafo") {
        limit = 47;
    }
    else if (mode == "nombre") {
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
        let rowName1 = calculateRow(`${array[index + 1]?.firstName ?? ''} ${array[index + 1]?.firstLastName ?? ''} ${array[index + 1]?.secondLastName ?? ''}`.length, "nombre");
        let rowName2 = calculateRow(`${array[index + 1]?.user?.firstName ?? ''} ${array[index + 1]?.user?.lastName ?? ''}`.length, "nombre");
        rowName1 > rowName2 ? row += rowName1 : row += rowName2;
    }
    return row;
};
const splitText = (doc, field, lMargin, rMargin, pdfInMM) => {
    return doc.splitTextToSize(field, (pdfInMM - lMargin - rMargin));
};
