//import {generateFile } from "../tools";
import { getFile } from "../endpoints.js";
export const exportVehiEgressPdf = async (ar) => {
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
    doc.text(80, 22, `SALIDA DE CONTENEDOR`);
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
    doc.text(42, row, `${ar.egressDate} ${ar.egressTime}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F'); //49
    doc.text(params.iniText, row += params.espIniText, "Vigilante de turno");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(50, row, `${ar.manager?.name ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Número del contenedor");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(60, row, `${ar?.containerNro ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Conductor registrado");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(57, row, `${ar?.driver ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Cédula conductor");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(50, row, `${ar?.dni ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Conductor no registrado");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(62, row, `${ar?.unregisteredDriver ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Placa vehículo");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(45, row, `${ar?.licensePlate ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Nro. guía");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(35, row, `${ar?.noGuide ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 10, 'F');
    doc.text(params.iniText, row += params.espIniText, "Proveedor");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(38, row, `${ar?.supplier ?? ''}`);
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
    doc.text(params.iniText, row += params.espIniText, "Observación");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    var lMargin = params.iniText; //left margin in mm
    var rMargin = 1; //right margin in mm
    var pdfInMM = params.finMargen; //210;  // width of A4 in mm
    var paragraph = doc.splitTextToSize(ar?.observation.split("\n").join(". ").trim() ?? '', (pdfInMM - lMargin - rMargin));
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
    let column = params.iniText;
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
    var title = "log_SalVehicular_" + d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear() + `.pdf`;
    doc.save(title);
};
export const exportVehiEgressCsv = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let note = ar[i];
        let noteCreationDateAndTime = note.creationDate.split('T');
        let noteCreationDate = noteCreationDateAndTime[0];
        let noteCreationTime = noteCreationDateAndTime[1];
        // @ts-ignore
        //if(noteCreationDate >= start && noteCreationDate <= end){
        let obj = {
            "Título": `${note.title.split("\n").join("(salto)")}`,
            "Fecha": `${noteCreationDate}`,
            "Hora": `${noteCreationTime}`,
            "Usuario": `${note.user?.firstName ?? ''} ${note.user?.lastName ?? ''}`,
            "Contenido": `${note.content.split("\n").join("(salto)")}`,
        };
        rows.push(obj);
        //}
    }
    generateFile(rows, "Reportes", "csv");
};
export const exportVehiEgressXls = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let note = ar[i];
        let noteCreationDateAndTime = note.creationDate.split('T');
        let noteCreationDate = noteCreationDateAndTime[0];
        let noteCreationTime = noteCreationDateAndTime[1];
        // @ts-ignore
        //if(noteCreationDate >= start && noteCreationDate <= end){
        let obj = {
            "Título": `${note.title.split("\n").join("(salto)")}`,
            "Fecha": `${noteCreationDate}`,
            "Hora": `${noteCreationTime}`,
            "Usuario": `${note.user?.firstName ?? ''} ${note.user?.lastName ?? ''}`,
            "Contenido": `${note.content.split("\n").join("(salto)")}`,
        };
        rows.push(obj);
        //}
    }
    generateFile(rows, "Reportes", "xls");
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
            save.download = "log_" + title + "_" + d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear() + `.${extension}`;
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
