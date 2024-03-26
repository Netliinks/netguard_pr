import { getFile } from "../endpoints.js";
export const exportReportIndPdf = async (ar) => {
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
    let noteCreationDateAndTime = ar.creationDate.split('T');
    let noteCreationDate = noteCreationDateAndTime[0];
    let noteCreationTime = noteCreationDateAndTime[1];
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
    doc.text(95, 22, `REPORTE`);
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
    doc.text(32, row, `${noteCreationDate} ${noteCreationTime}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 7, 'F');
    doc.text(params.iniText, row += params.espIniText, "Usuario");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    doc.text(25, row, `${ar?.user?.firstName ?? ''} ${ar?.user?.lastName ?? ''}`);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 20, 'F');
    doc.text(params.iniText, row += params.espIniText, "Título");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    var lMargin = params.iniText; //left margin in mm
    var rMargin = 1; //right margin in mm
    var pdfInMM = params.finMargen; //210;  // width of A4 in mm
    var paragraph = doc.splitTextToSize(ar?.title?.split("\n").join(". ").replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, '').trim() ?? '', (pdfInMM - lMargin - rMargin));
    doc.text(lMargin, row += 5, paragraph);
    row += 8
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(244, 244, 244);
    doc.setFillColor(244, 244, 244);
    doc.rect(params.iniSomb, row += params.espEntBloq, params.finSomb, 50, 'F');
    doc.text(params.iniText, row += params.espIniText, "Contenido");
    doc.setFont(undefined, 'normal');
    doc.setTextColor(87, 80, 73);
    paragraph = doc.splitTextToSize(ar?.content?.split("\n").join(". ").replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, '').trim() ?? '', (pdfInMM - lMargin - rMargin));
    doc.text(lMargin, row += 5, paragraph);
    row += 32
    let arrImg = [];
    for (let i = 1; i <= 1; i++) {
        if (i == 1 && ar.attachment != undefined) {
            arrImg.push(ar.attachment);
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
    var title = "REPORTE_" + d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "_" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds() + `.pdf`;
    doc.save(title);
};
export const exportReportPdf = (ar, start, end) => {
    // @ts-ignore
    window.jsPDF = window.jspdf.jsPDF;
    // @ts-ignore
    var doc = new jsPDF();
    doc.addImage("./public/src/assets/pictures/report.png", "PNG", 10, 10, 30, 10);
    doc.setDrawColor(0, 0, 128);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 128);
    doc.setFontSize(25);
    doc.text(10, 30, `Reportes`);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'italic');
    doc.text(135, 30, `Fecha: Desde ${start} Hasta ${end}`);
    //construimos cabecera del csv
    doc.setFont(undefined, 'bold');
    doc.line(5, 34.8, 205, 34.8);
    doc.setFillColor(210, 210, 210);
    doc.rect(5, 35, 200, 10, 'F');
    doc.text(10, 40, "Fecha");
    doc.text(30, 40, "Hora");
    doc.text(50, 40, "Usuario");
    doc.text(90, 40, "Título");
    doc.text(140, 40, "Contenido");
    doc.line(5, 45, 205, 45);
    let row = 50;
    let pagina = 1;
    doc.setTextColor(0, 0, 128);
    doc.text(10, 290, `Página ${pagina}`);
    //resto del contenido
    for (let i = 0; i < ar.length; i++) {
        let report = ar[i];
        let rowTitle = 0;
        let rowDescription = 0;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(10, row, `${report.fecha}`);
        doc.text(30, row, `${report.hora}`);
        var lMargin = 50; //left margin in mm
        var rMargin = 5; //right margin in mm
        var pdfInMM = 90; //210;  // width of A4 in mm
        var paragraph = doc.splitTextToSize(report.usuario, (pdfInMM - lMargin - rMargin));
        doc.text(lMargin, row, paragraph);

        lMargin = 90; //left margin in mm
        rMargin = 5; //right margin in mm
        pdfInMM = 140; //210;  // width of A4 in mm
        paragraph = doc.splitTextToSize(report.titulo, (pdfInMM - lMargin - rMargin));
        doc.text(lMargin, row, paragraph);
        rowTitle = calculateRow(report.titulo.length,"titulo");

        lMargin = 140; //left margin in mm
        rMargin = 5; //right margin in mm
        pdfInMM = 210; //210;  // width of A4 in mm
        paragraph = doc.splitTextToSize(report.contenido, (pdfInMM - lMargin - rMargin));
        doc.text(lMargin, row, paragraph);
        rowDescription = calculateRow(report.contenido.length,"parrafo");

        rowTitle > rowDescription ? row += rowTitle : row += rowDescription
        if(report.imagen != ''){
            doc.addImage(`${report.imagen}`, "JPEG", 80, row, 50, 30);
            row+=35
        }
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
            doc.text(10, 20, "Fecha");
            doc.text(30, 20, "Hora");
            doc.text(50, 20, "Usuario");
            doc.text(90, 20, "Título");
            doc.text(140, 20, "Contenido");
            doc.line(5, 25, 205, 25);
            doc.setTextColor(0, 0, 128);
            doc.text(10, 290, `Página ${pagina}`);
        }else{
            row += 5;
        }
    }
    // Save the PDF
    var d = new Date();
    var title = "log_Reportes_" + d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear() + `.pdf`;
    doc.save(title);
};
export const exportReportCsv = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let note = ar[i];
        let noteCreationDateAndTime = note.creationDate.split('T');
        let noteCreationDate = noteCreationDateAndTime[0];
        let noteCreationTime = noteCreationDateAndTime[1];
        // @ts-ignore
        //if (noteCreationDate >= start && noteCreationDate <= end) {
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
export const exportReportXls = (ar, start, end) => {
    let rows = [];
    for (let i = 0; i < ar.length; i++) {
        let note = ar[i];
        let noteCreationDateAndTime = note.creationDate.split('T');
        let noteCreationDate = noteCreationDateAndTime[0];
        let noteCreationTime = noteCreationDateAndTime[1];
        // @ts-ignore
        //if (noteCreationDate >= start && noteCreationDate <= end) {
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
    if(mode=="parrafo"){
        limit = 47;
    }else if(mode=="titulo"){
        limit = 30;
    }
    let lineCount = Math.ceil(length / limit);
    for(let i = 1; i <= lineCount; i++){
        if(length <= (limit * i)){  //124 caracteres cada linea aprox en total margen A4
            row += (4*i);
        }
    }
    return row;
}

const newDataBlock = (array, index) => {
    let row = 0;
    if(array[index+1] != undefined){
        row+=5;
        let rowTitle = calculateRow(array[index+1]?.titulo.length,"titulo");
        let rowDescription = calculateRow(array[index+1]?.contenido.length,"parrafo");
        rowTitle > rowDescription ? row += rowTitle : row += rowDescription;
        if(array[index+1]?.imagen != '')
            row+=35
    }
    return row;
}