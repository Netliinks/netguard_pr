//
//  AssistControl.ts
//
//  Generated by Poll Castillo on 15/03/2023.
//
import { Config } from "../../../Configs.js";
import { getEntityData, getEntitiesData, getUserInfo, getFilterEntityData } from "../../../endpoints.js";
import { CloseDialog, drawTagsIntoTables, renderRightSidebar, filterDataByHeaderType, inputObserver, generateCsv } from "../../../tools.js";
import { UIContentLayout, UIRightSidebar } from "./Layout.js";
import { UITableSkeletonTemplate } from "./Template.js";
// Local configs
const tableRows = Config.tableRows;
let currentPage = Config.currentPage;
const pageName = 'Ingreso Vehicular';
const customerId = localStorage.getItem('customer_id');
const GetVehiculars = async () => {
    const vehicularRaw = await getEntitiesData('Vehicular');
    const vehicular = vehicularRaw.filter((data) => data.customer?.id === `${customerId}`);
    return vehicular;
};
export class Vehiculars {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.siebarDialogContainer = document.getElementById('entity-editor-container');
        this.appContainer = document.getElementById('datatable-container');
        this.render = async () => {
            let assistControlArray = await GetVehiculars();
            this.appContainer.innerHTML = '';
            this.appContainer.innerHTML = UIContentLayout;
            // Getting interface elements
            const viewTitle = document.getElementById('view-title');
            const tableBody = document.getElementById('datatable-body');
            // Changing interface element content
            viewTitle.innerText = pageName;
            tableBody.innerHTML = UITableSkeletonTemplate.repeat(tableRows);
            // Exec functions
            this.load(tableBody, currentPage, assistControlArray);
            this.searchVisit(tableBody, assistControlArray);
            new filterDataByHeaderType().filter();
            this.pagination(assistControlArray, tableRows, currentPage);
            this.export();
            // Rendering icons
        };
        this.load = (tableBody, currentPage, assistControl) => {
            tableBody.innerHTML = ''; // clean table
            // configuring max table row size
            currentPage--;
            let start = tableRows * currentPage;
            let end = start + tableRows;
            let paginatedItems = assistControl.slice(start, end);
            // Show message if page is empty
            if (assistControl.length === 0) {
                let mensaje = 'No existen datos';
                if(customerId == null){mensaje = 'Seleccione una empresa';}
                let row = document.createElement('TR');
                row.innerHTML = `
            <td>${mensaje}<td>
            <td></td>
            <td></td>
            `;
                tableBody.appendChild(row);
            }
            else {
                for (let i = 0; i < paginatedItems.length; i++) {
                    let vehicular = paginatedItems[i]; // getting visit items
                    let row = document.createElement('TR');
                    row.innerHTML += `
                    <td style="white-space: nowrap">${vehicular.licensePlate}</td>
                    <td>${vehicular.dni}</td>
                    <td>${vehicular.driver}</td>
                    <td id="table-date">${vehicular.ingressDate} ${vehicular.ingressTime}</td>
                    <td id="table-date">${vehicular.egressDate} ${vehicular.egressTime}</td>
                    <td class="tag"><span>${vehicular.visitState.name}</span></td>

                    <td>
                        <button class="button" id="entity-details" data-entityId="${vehicular.id}">
                            <i class="table_icon fa-regular fa-magnifying-glass"></i>
                        </button>
                    </td>
                `;
                    tableBody.appendChild(row);
                    drawTagsIntoTables();
                }
                this.previewAssist();
                this.fixCreatedDate();
            }
        };
        this.pagination = async (items, limitRows, currentPage) => {
            const tableBody = document.getElementById('datatable-body');
            const paginationWrapper = document.getElementById('pagination-container');
            paginationWrapper.innerHTML = '';
            let pageCount;
            pageCount = Math.ceil(items.length / limitRows);
            let button;
            for (let i = 1; i < pageCount + 1; i++) {
                button = setupButtons(i, items, currentPage, tableBody, limitRows);
                paginationWrapper.appendChild(button);
            }
            function setupButtons(page, items, currentPage, tableBody, limitRows) {
                const button = document.createElement('button');
                button.classList.add('pagination_button');
                button.innerText = page;
                button.addEventListener('click', () => {
                    currentPage = page;
                    new Vehiculars().load(tableBody, page, items);
                });
                return button;
            }
        }
        this.searchVisit = async (tableBody, visits) => {
            const search = document.getElementById('search');
            await search.addEventListener('keyup', () => {
                const arrayVisits = visits.filter((vehicular) => `${vehicular.licensePlate}${vehicular.dni}${vehicular.driver}${vehicular.ingressDate}${vehicular.ingressTime}${vehicular.egressDate}${vehicular.egressTime}${vehicular.visitState.name}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase()));
                let filteredVisit = arrayVisits.length;
                let result = arrayVisits;
                if (filteredVisit >= Config.tableRows)
                    filteredVisit = Config.tableRows;
                this.load(tableBody, currentPage, result);
                this.pagination(result, tableRows, currentPage);
            });
        };
        this.previewAssist = async () => {
            const openButtons = document.querySelectorAll('#entity-details');
            openButtons.forEach((openButton) => {
                const entityId = openButton.dataset.entityid;
                openButton.addEventListener('click', () => {
                    renderInterface(entityId);
                });
            });
            const renderInterface = async (entity) => {
                let markingData = await getEntityData('Vehicular', entity);
                console.log(markingData);
                renderRightSidebar(UIRightSidebar);
                const _values = {
                    status: document.getElementById('marking-status'),
                    name: document.getElementById('marking-name'),
                    dni: document.getElementById('marking-dni'),
                    type: document.getElementById('marking-type'),
                    department: document.getElementById('marking-department'),
                    contractor: document.getElementById('marking-contractor'),
                    product: document.getElementById('marking-product'),
                    type: document.getElementById('marking-type'),
                    observation: document.getElementById('marking-observation'),
                    dayManager: document.getElementById('marking-dayManager'),
                    nightManager: document.getElementById('marking-nightManager'),
                    // Start marking
                    startDate: document.getElementById('marking-start-date'),
                    startTime: document.getElementById('marking-start-time'),
                    startGuardID: document.getElementById('marking-start-guard-id'),
                    startGuardName: document.getElementById('marking-start-guard-name'),
                    // End marking
                    endDate: document.getElementById('marking-end-date'),
                    endTime: document.getElementById('marking-end-time'),
                    endGuardID: document.getElementById('marking-end-guard-id'),
                    endGuardName: document.getElementById('marking-end-guard-name')
                };
                _values.status.innerText = markingData.visitState.name;
                _values.name.value = markingData.driver;
                _values.dni.value = markingData.dni;
                _values.type.value = markingData.licensePlate;
                _values.department.value = markingData.noGuide;
                _values.contractor.value = markingData.supplier;
                _values.product.value = markingData.product;
                _values.type.value = markingData.type;
                _values.observation.value = markingData.observation;
                _values.dayManager.value = markingData.dayManager;
                _values.nightManager.value = markingData.nightManager;
                // Start marking
                _values.startDate.value = markingData.ingressDate;
                _values.startTime.value = markingData.ingressTime;
                _values.startGuardID.value = markingData.ingressIssued.username;
                _values.startGuardName.value = markingData.ingressIssued.firstName + ' ' + markingData.ingressIssued.lastName;
                // End marking
                _values.endDate.value = markingData.egressDate ? markingData.egressDate : '';
                _values.endTime.value = markingData.egressTime ? markingData.egressTime : '';
                _values.endGuardID.value = markingData.egressIssued.username ? markingData.egressIssued.username : '';
                _values.endGuardName.value = markingData.egressIssued.firstName ? markingData.egressIssued.firstName : '' + ' ' + markingData.egressIssued.lastName ? markingData.egressIssued.lastName : '';
                drawTagsIntoTables();
                this.closeRightSidebar();
                drawTagsIntoTables();
            };
        };
        this.closeRightSidebar = () => {
            const closeButton = document.getElementById('close');
            const editor = document.getElementById('entity-editor-container');
            closeButton.addEventListener('click', () => {
                new CloseDialog().x(editor);
            });
        };
        this.fixCreatedDate = () => {
            const tableDate = document.querySelectorAll('#table-date');
            tableDate.forEach((date) => {
                const separateDateAndTime = date.innerText.split('T');
                date.innerText = separateDateAndTime[0];
            });
        };
        this.export = () => {
            const exportNotes = document.getElementById('export-entities');
            exportNotes.addEventListener('click', async() => {
                this.dialogContainer.style.display = 'block';
                this.dialogContainer.innerHTML = `
                    <div class="dialog_content" id="dialog-content">
                        <div class="dialog">
                            <div class="dialog_container padding_8">
                                <div class="dialog_header">
                                    <h2>Seleccionar la fecha</h2>
                                </div>

                                <div class="dialog_message padding_8">
                                    <div class="form_group">
                                        <div class="form_input">
                                            <label class="form_label" for="start-date">Desde:</label>
                                            <input type="date" class="input_date input_date-start" id="start-date" name="start-date">
                                        </div>
                        
                                        <div class="form_input">
                                            <label class="form_label" for="end-date">Hasta:</label>
                                            <input type="date" class="input_date input_date-end" id="end-date" name="end-date">
                                        </div>
                                    </div>
                                </div>

                                <div class="dialog_footer">
                                    <button class="btn btn_primary" id="cancel">Cancelar</button>
                                    <button class="btn btn_danger" id="export-data">Exportar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                let fecha = new Date(); //Fecha actual
                let mes = fecha.getMonth()+1; //obteniendo mes
                let dia = fecha.getDate(); //obteniendo dia
                let anio = fecha.getFullYear(); //obteniendo año
                if(dia<10)
                    dia='0'+dia; //agrega cero si el menor de 10
                if(mes<10)
                    mes='0'+mes //agrega cero si el menor de 10

                document.getElementById("start-date").value = anio+"-"+mes+"-"+dia;
                document.getElementById("end-date").value = anio+"-"+mes+"-"+dia;
                inputObserver();
                const _closeButton = document.getElementById('cancel');
                const exportButton = document.getElementById('export-data');
                const _dialog = document.getElementById('dialog-content');
                exportButton.addEventListener('click', async() => {
                    let rows = [];
                    const _values = {
                        start: document.getElementById('start-date'),
                        end: document.getElementById('end-date'),
                    }
                    const vehiculars = await GetVehiculars();
                    for(let i=0; i < vehiculars.length; i++){
                        let vehicular = vehiculars[i]
                        if(vehicular.ingressDate >= _values.start.value && vehicular.ingressDate <= _values.end.value){
                            let obj = {
                                "Placa": `${vehicular.licensePlate.split("\n").join("(salto)")}`,
                                "Conductor": `${vehicular.driver.split("\n").join("(salto)")}`,
                                "DNI": `${vehicular.dni}`,
                                "Fecha Ingreso": `${vehicular.ingressDate}`,
                                "Hora Ingreso": `${vehicular.ingressTime}`,
                                "Emitido Ingreso": `${vehicular.ingressIssued.firstName} ${vehicular.ingressIssued.lastName}`,
                                "Fecha Salida": `${vehicular.egressDate}`,
                                "Hora Salida": `${vehicular.egressTime}`,
                                "Emitido Salida": `${vehicular.egressIssued?.firstName} ${vehicular.egressIssued?.lastName}`,
                                "Producto": `${vehicular.product.split("\n").join("(salto)")}`,
                                "Nro Guía": `${vehicular.nroGuide.split("\n").join("(salto)")}`,
                                "Proveedor": `${vehicular.supplier.split("\n").join("(salto)")}`,
                                "Tipo": `${vehicular.type.split("\n").join("(salto)")}`,
                                "Estado": `${vehicular.visitState.name}`,
                                "Encargado Diurno": `${vehicular.dayManager.split("\n").join("(salto)")}`,
                                "Encargado Nocturno": `${vehicular.nightManager.split("\n").join("(salto)")}`,
                                "Observación": `${vehicular.observation.split("\n").join("(salto)")}`,
                              }
                              rows.push(obj);
                        }
                        
                    }
                    generateCsv(rows, "Ingreso_Vehicular");
                    
                    
                });
                _closeButton.onclick = () => {
                    new CloseDialog().x(_dialog);
                };
            });
        };
    }
}
