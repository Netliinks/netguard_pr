// @filename: Blacklist.ts
import { deleteEntity, getEntitiesData, getEntityData, registerEntity, setPassword, setUserRole, updateEntity, getUserInfo, getFilterEntityData, getFilterEntityCount } from "../../../endpoints.js";
import { drawTagsIntoTables, inputObserver, inputSelect, CloseDialog, filterDataByHeaderType, pageNumbers, fillBtnPagination } from "../../../tools.js";
import { Config } from "../../../Configs.js";
import { tableLayout } from "./Layout.js";
import { tableLayoutTemplate } from "./Templates.js";
import { exportBlackListCsv, exportBlackListPdf, exportBlackListXls } from "../../../exportFiles/blacklist.js";
const tableRows = Config.tableRows;
const currentPage = Config.currentPage;
let currentUserInfo; 
const customerId = localStorage.getItem('customer_id');
let infoPage = {
    count: 0,
    offset: Config.offset,
    currentPage: currentPage,
    search: ""
};
let dataPage;
const getSchedules = async () => {
    const currentUser = await getUserInfo();
    const user = await getEntityData('User', `${currentUser.attributes.id}`);
    currentUserInfo = user;
    /*const schedules = await getEntitiesData('Schedule');
    const FCustomer = schedules.filter((data) => `${data.customer?.id}` === `${customerId}`);
    return FCustomer;*/
    let raw = JSON.stringify({
        "filter": {
            "conditions": [
                {
                    "property": "customer.id",
                    "operator": "=",
                    "value": `${customerId}`
                }
            ],
        },
        sort: "-createdDate",
        limit: Config.tableRows,
        offset: infoPage.offset,
        fetchPlan: 'full',
    });
    if (infoPage.search != "") {
        raw = JSON.stringify({
            "filter": {
                "conditions": [
                    {
                        "group": "OR",
                        "conditions": [
                            {
                                "property": "name",
                                "operator": "contains",
                                "value": `${infoPage.search.toLowerCase()}`
                            }
                        ]
                    },
                    {
                        "property": "customer.id",
                        "operator": "=",
                        "value": `${customerId}`
                    }
                ]
            },
            sort: "-createdDate",
            limit: Config.tableRows,
            offset: infoPage.offset,
            fetchPlan: 'full',
        });
    }
    infoPage.count = await getFilterEntityCount("Schedule", raw);
    dataPage = await getFilterEntityData("Schedule", raw);
    return dataPage;
};
export class Schedules {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.entityDialogContainer = document.getElementById('entity-editor-container');
        this.content = document.getElementById('datatable-container');
        this.searchEntity = async (tableBody /*, data*/) => {
            const search = document.getElementById('search');
            const btnSearch = document.getElementById('btnSearch');
            search.value = infoPage.search;
            await search.addEventListener('keyup', () => {
                /*const arrayData = data.filter((schedules) => `${schedules.name}
                 ${schedules.ingressTime}
                 ${schedules.egressTime}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase()));
                let filteredResult = arrayData.length;
                let result = arrayData;
                if (filteredResult >= tableRows)
                    filteredResult = tableRows;
                this.load(tableBody, currentPage, result);*/
            });
            btnSearch.addEventListener('click', async () => {
                new Schedules().render(Config.offset, Config.currentPage, search.value.toLowerCase().trim());
            });
        };
    }
    async render(offset, actualPage, search) {
        infoPage.offset = offset;
        infoPage.currentPage = actualPage;
        infoPage.search = search;
        this.content.innerHTML = '';
        this.content.innerHTML = tableLayout;
        const tableBody = document.getElementById('datatable-body');
        tableBody.innerHTML = '.Cargando...';
        let data = await getSchedules();
        tableBody.innerHTML = tableLayoutTemplate.repeat(tableRows);
        this.load(tableBody, currentPage, data);
        this.searchEntity(tableBody /*, data*/);
        new filterDataByHeaderType().filter();
        this.pagination(data, tableRows, infoPage.currentPage);
    }
    load(table, currentPage, data) {
        table.innerHTML = '';
        currentPage--;
        let start = tableRows * currentPage;
        let end = start + tableRows;
        let paginatedItems = data.slice(start, end);
        if (data.length === 0) {
            let mensaje = 'No existen datos';
            if(customerId == null){mensaje = 'Seleccione una empresa';}
            let row = document.createElement('tr');
            row.innerHTML = `
        <td>${mensaje}</td>
        <td></td>
        <td></td>
      `;
            table.appendChild(row);
        }
        else {
            for (let i = 0; i < paginatedItems.length; i++) {
                let schedules = paginatedItems[i];
                let row = document.createElement('tr');
                row.innerHTML += `
          <td>${schedules.name}</dt>
          <td>${schedules.ingressTime}</dt>
          <td>${schedules.toleranceIngressStart} - ${schedules.toleranceIngressEnd}</dt>
          <td>${schedules.egressTime}</dt>
          <td>${schedules.toleranceEgressStart} - ${schedules.toleranceEgressEnd}</dt>
          <td class="entity_options">
            <button class="button" id="edit-entity" data-entityId="${schedules.id}">
              <i class="fa-solid fa-pen"></i>
            </button>

            <button class="button" id="remove-entity" data-entityId="${schedules.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </dt>
        `;
                table.appendChild(row);
                drawTagsIntoTables();
            }
        }
        this.register();
        //this.import();
        //this.export();
        this.edit(this.entityDialogContainer, data);
        this.remove();
    }
    register() {
        // register entity
        const openEditor = document.getElementById('new-entity');
        openEditor.addEventListener('click', () => {
            renderInterface('User');
        });
        const renderInterface = async (entities) => {
            this.entityDialogContainer.innerHTML = '';
            this.entityDialogContainer.style.display = 'flex';
            this.entityDialogContainer.innerHTML = `
        <div class="entity_editor" id="entity-editor">
          <div class="entity_editor_header">
            <div class="user_info">
              <div class="avatar"><i class="fa-regular fa-clock"></i></div>
              <h1 class="entity_editor_title">Registrar <br><small>Horario</small></h1>
            </div>

            <button class="btn btn_close_editor" id="close"><i class="fa-solid fa-x"></i></button>
          </div>

          <!-- EDITOR BODY -->
          <div class="entity_editor_body">
            <div class="material_input">
              <input type="text" id="entity-name" autocomplete="none">
              <label for="entity-name">Nombre</label>
            </div>

            <div class="material_input">
                <input type="time"
                    id="entity-time-start"
                    autocomplete="none"
                    class="input_filled">
                <label for="entity-time-start">Hora Inicio</label>
            </div>

            <div class="form_group">
                <div class="form_input">
                    <label class="form_label" for="ingress-start-time">Tolerancia Inicio:</label>
                    <input type="time" class="input_time input_time-start" id="ingress-start-time" name="start-time">
                </div>

                <div class="form_input">
                    <label class="form_label" for="ingress-end-time">Tolerancia Fin:</label>
                    <input type="time" class="input_time input_time-end" id="ingress-end-time" name="end-time">
                </div>
            </div>
            <br>
            <br>
            <div class="material_input">
                <input type="time"
                    id="entity-time-end"
                    autocomplete="none"
                    class="input_filled">
                <label for="entity-time-end">Hora Fin</label>
            </div>

            <div class="form_group">
                <div class="form_input">
                    <label class="form_label" for="egress-start-time">Tolerancia Inicio:</label>
                    <input type="time" class="input_time input_time-start" id="egress-start-time" name="start-time">
                </div>

                <div class="form_input">
                    <label class="form_label" for="egress-end-time">Tolerancia Fin:</label>
                    <input type="time" class="input_time input_time-end" id="egress-end-time" name="end-time">
                </div>
            </div>

          </div>
          <!-- END EDITOR BODY -->

          <div class="entity_editor_footer">
            <button class="btn btn_primary btn_widder" id="register-entity">Guardar</button>
          </div>
        </div>
      `;
            // @ts-ignore
            inputObserver();
            this.close();
            const registerButton = document.getElementById('register-entity');
            registerButton.addEventListener('click', async () => {
                let _values;
                _values = {
                    name: document.getElementById('entity-name'),
                    ingressTime: document.getElementById('entity-time-start'),
                    toleranceIngressStart: document.getElementById('ingress-start-time'),
                    toleranceIngressEnd: document.getElementById('ingress-end-time'),
                    egressTime: document.getElementById('entity-time-end'),
                    toleranceEgressStart: document.getElementById('egress-start-time'),
                    toleranceEgressEnd: document.getElementById('egress-end-time'),
                };
                const schedulesRaw = JSON.stringify({
                    "name": `${_values.name.value}`,
                    "ingressTime": `${_values.ingressTime.value}`,
                    "toleranceIngressStart": `${_values.toleranceIngressStart.value}`,
                    "toleranceIngressEnd": `${_values.toleranceIngressEnd.value}`,
                    "egressTime": `${_values.egressTime.value}`,
                    "toleranceEgressStart": `${_values.toleranceEgressStart.value}`,
                    "toleranceEgressEnd": `${_values.toleranceEgressEnd.value}`,
                    "customer": {
                        "id": `${customerId}`
                    },
                    "business": {
                        "id": `${currentUserInfo.business.id}`
                    },
                });
                if (_values.name.value === '' || _values.name.value === undefined) {
                    alert("¡Nombre vacío!");
                }
                else if (_values.ingressTime.value === '' || _values.ingressTime.value === undefined) {
                    alert("Hora Ingreso vacío!");
                }
                else if (_values.egressTime.value === '' || _values.egressTime.value === undefined) {
                    alert("Hora Salida vacía!");
                }
                else {
                    reg(schedulesRaw);
                }
            });
        };
        const reg = async (raw) => {
            registerEntity(raw, 'Schedule')
                .then((res) => {
                setTimeout(async () => {
                    //let data = await getSchedules();
                    const tableBody = document.getElementById('datatable-body');
                    const container = document.getElementById('entity-editor-container');
                    new CloseDialog().x(container);
                    new Schedules().render(Config.offset, Config.currentPage, infoPage.search);
                }, 1000);
            });
        };
    }
    edit(container, data) {
        // Edit entity
        const edit = document.querySelectorAll('#edit-entity');
        edit.forEach((edit) => {
            const entityId = edit.dataset.entityid;
            edit.addEventListener('click', () => {
                RInterface('Schedule', entityId);
            });
        });
        const RInterface = async (entities, entityID) => {
            const data = await getEntityData(entities, entityID);
            this.entityDialogContainer.innerHTML = '';
            this.entityDialogContainer.style.display = 'flex';
            this.entityDialogContainer.innerHTML = `
                <div class="entity_editor" id="entity-editor">
                <div class="entity_editor_header">
                    <div class="user_info">
                    <div class="avatar"><i class="fa-regular fa-clock"></i></div>
                    <h1 class="entity_editor_title">Editar <br><small>Horario</small></h1>
                    </div>

                    <button class="btn btn_close_editor" id="close"><i class="fa-solid fa-x"></i></button>
                </div>

                <!-- EDITOR BODY -->
                <div class="entity_editor_body">
                    <div class="material_input">
                        <input type="text" id="entity-name" autocomplete="none" class="input_filled" value="${data.name}">
                        <label for="entity-name">Nombre</label>
                    </div>
        
                    <div class="material_input">
                        <input type="time"
                            id="entity-time-start"
                            autocomplete="none" class="input_filled" value="${data?.ingressTime ?? ''}">
                        <label for="entity-time-start">Hora Inicio</label>
                    </div>
        
                    <div class="form_group">
                        <div class="form_input">
                            <label class="form_label" for="ingress-start-time">Tolerancia Inicio:</label>
                            <input type="time" class="input_time input_time-start" id="ingress-start-time" name="ingress-start-time" value="${data?.toleranceIngressStart ?? ''}">
                        </div>
        
                        <div class="form_input">
                            <label class="form_label" for="ingress-end-time">Tolerancia Fin:</label>
                            <input type="time" class="input_time input_time-end" id="ingress-end-time" name="ingress-end-time" value="${data?.toleranceIngressEnd ?? ''}">
                        </div>
                    </div>
                    <br>
                    <br>
                    <div class="material_input">
                        <input type="time"
                            id="entity-time-end"
                            autocomplete="none" class="input_filled" value="${data?.egressTime ?? ''}">
                        <label for="entity-time-end">Hora Fin</label>
                    </div>
        
                    <div class="form_group">
                        <div class="form_input">
                            <label class="form_label" for="egress-start-time">Tolerancia Inicio:</label>
                            <input type="time" class="input_time input_time-start" id="egress-start-time" name="egress-start-time" value="${data?.toleranceEgressStart ?? ''}">
                        </div>
        
                        <div class="form_input">
                            <label class="form_label" for="egress-end-time">Tolerancia Fin:</label>
                            <input type="time" class="input_time input_time-end" id="egress-end-time" name="egress-end-time" value="${data?.toleranceEgressEnd ?? ''}">
                        </div>
                    </div>

                </div>
                <!-- END EDITOR BODY -->

                <div class="entity_editor_footer">
                    <button class="btn btn_primary btn_widder" id="update-changes">Guardar</button>
                </div>
                </div>
            `;

            inputObserver();

            this.close();
            updateSchedule(entityID);
        };
        const updateSchedule = async (scheduleId) => {
            let updateButton;
            updateButton = document.getElementById('update-changes');
            const _values = {
                name: document.getElementById('entity-name'),
                ingressTime: document.getElementById('entity-time-start'),
                toleranceIngressStart: document.getElementById('ingress-start-time'),
                toleranceIngressEnd: document.getElementById('ingress-end-time'),
                egressTime: document.getElementById('entity-time-end'),
                toleranceEgressStart: document.getElementById('egress-start-time'),
                toleranceEgressEnd: document.getElementById('egress-end-time'),
            };
            updateButton.addEventListener('click', () => {
                let scheduleRaw = JSON.stringify({
                    "name": `${_values.name.value}`,
                    "ingressTime": `${_values.ingressTime.value}`,
                    "toleranceIngressStart": `${_values.toleranceIngressStart.value}`,
                    "toleranceIngressEnd": `${_values.toleranceIngressEnd.value}`,
                    "egressTime": `${_values.egressTime.value}`,
                    "toleranceEgressStart": `${_values.toleranceEgressStart.value}`,
                    "toleranceEgressEnd": `${_values.toleranceEgressEnd.value}`,
                });
                update(scheduleRaw);
            });
            /**
             * Update entity and execute functions to finish defying user
             * @param raw
             */
            const update = (raw) => {
                updateEntity('Schedule', scheduleId, raw)
                    .then((res) => {
                    setTimeout(async () => {
                        let tableBody;
                        let container;
                        let data;
                        tableBody = document.getElementById('datatable-body');
                        container = document.getElementById('entity-editor-container');
                        //data = await getSchedules();
                        new CloseDialog().x(container);
                        new Schedules().render(infoPage.offset, infoPage.currentPage, infoPage.search);
                    }, 100);
                });
            };
        };
    }
    remove() {
        const remove = document.querySelectorAll('#remove-entity');
        remove.forEach((remove) => {
            const entityId = remove.dataset.entityid;
            remove.addEventListener('click', () => {
                this.dialogContainer.style.display = 'block';
                this.dialogContainer.innerHTML = `
          <div class="dialog_content" id="dialog-content">
            <div class="dialog dialog_danger">
              <div class="dialog_container">
                <div class="dialog_header">
                  <h2>¿Deseas eliminar este horario?</h2>
                </div>

                <div class="dialog_message">
                  <p>Esta acción no se puede revertir</p>
                </div>

                <div class="dialog_footer">
                  <button class="btn btn_primary" id="cancel">Cancelar</button>
                  <button class="btn btn_danger" id="delete">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        `;
                // delete button
                // cancel button
                // dialog content
                const deleteButton = document.getElementById('delete');
                const cancelButton = document.getElementById('cancel');
                const dialogContent = document.getElementById('dialog-content');
                deleteButton.onclick = () => {
                    deleteEntity('Schedule', entityId)
                    .then((res) => {
                        setTimeout(async () => {
                            //let data = await getSchedules();
                            const tableBody = document.getElementById('datatable-body');
                            new CloseDialog().x(dialogContent);
                            new Schedules().render(infoPage.offset, infoPage.currentPage, infoPage.search);
                        }, 1000);
                    });
                };
                cancelButton.onclick = () => {
                    new CloseDialog().x(dialogContent);
                    //this.render();
                };
            });
        });
    }
    /*
    import = () => {
        const _importContractors = document.getElementById('import-entities');
        _importContractors.addEventListener('click', () => {
            this.entityDialogContainer.innerHTML = '';
            this.entityDialogContainer.style.display = 'flex';
            this.entityDialogContainer.innerHTML = `
                    <div class="entity_editor id="entity-editor">
                        <div class="entity_editor_header">
                            <div class="user_info">
                                <div class="avatar">
                                    <i class="fa-regular fa-up-from-line"></i>
                                </div>
                                <h1 class="entity_editor_title">Importar <br> <small>Persona</small></h1>
                            </div>
                            <button class="btn btn_close_editor" id="close"><i class="fa-solid fa-x"></i></button>
                        </div>
                        <!--EDITOR BODY -->
                        <div class="entity_editor_body padding_t_8_important">
                            <div class="sidebar_section">
                                <div class="file_template">
                                    <i class="fa-solid fa-file-csv"></i>
                                    <div class="description">
                                        <p class="filename">Plantilla de Lista Negra</p>
                                        <a href="./public/src/templates/NetguardBlackList.csv" download="./public/src/templates/NetguardContractors.csv" rel="noopener" target="_self" class="filelink">Descargar</a>
                                    </div>
                                </div>
                            </div>
                            <div class="sidebar_section">
                                <input type="file" id="file-handler">
                            </div>
                        </div>
                        <div class="entity_editor_footer">
                            <button class="btn btn_primary btn_widder" id="button-import">Importar<button>
                        </div>
                    </div>
                `;
            this.close();
            const _fileHandler = document.getElementById('file-handler');
            _fileHandler.addEventListener('change', () => {
                readFile(_fileHandler.files[0]);
            });
            async function readFile(file) {
                const fileReader = new FileReader();
                fileReader.readAsText(file);
                fileReader.addEventListener('load', (e) => {
                    let result = e.srcElement.result;
                    let resultSplit = result.split('\r');
                    let rawFile;
                    let stageUsers = [];
                    for (let i = 1; i < resultSplit.length; i++) {
                        let blackListData = resultSplit[i].split(';');
                        rawFile = JSON.stringify({
                            "firstName": `${blackListData[0]?.replace(/\n/g, '')}`,
                            "firstLastName": `${blackListData[1]?.replace(/\n/g, '')}`,
                            "secondLastName": `${blackListData[2]?.replace(/\n/g, '')}`,
                            "dni": `${blackListData[3]?.replace(/\n/g, '')}`,
                        });
                        stageUsers.push(rawFile);
                    }
                    const _import = document.getElementById('button-import');
                    _import.addEventListener('click', () => {
                        stageUsers.forEach((user) => {
                            registerEntity(user, 'BlacklistedUser')
                                .then((res) => {
                                setTimeout(async () => {
                                    let data = await getUsers();
                                    const tableBody = document.getElementById('datatable-body');
                                    const container = document.getElementById('entity-editor-container');
                                    new CloseDialog().x(container);
                                    new Blacklist().load(tableBody, currentPage, data);
                                }, 1000);
                            });
                        });
                    });
                });
            }
        });
    }*/
    /*export = () => {
        const exportUsers = document.getElementById('export-entities');
        exportUsers.addEventListener('click', async () => {
            this.dialogContainer.style.display = 'block';
                this.dialogContainer.innerHTML = `
                <div class="dialog_content" id="dialog-content">
                    <div class="dialog">
                        <div class="dialog_container padding_8">
                            <div class="dialog_header">
                                <h2>Seleccione un tipo</h2>
                            </div>

                            <div class="dialog_message padding_8">
                                <div class="form_group">
                                    <label for="exportCsv">
                                        <input type="radio" id="exportCsv" name="exportOption" value="csv" /> CSV
                                    </label>

                                    <label for="exportXls">
                                        <input type="radio" id="exportXls" name="exportOption" value="xls" checked /> XLS
                                    </label>

                                    <label for="exportPdf">
                                        <input type="radio" id="exportPdf" name="exportOption" value="pdf" /> PDF
                                    </label>
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
                inputObserver();
                const _closeButton = document.getElementById('cancel');
                const exportButton = document.getElementById('export-data');
                const _dialog = document.getElementById('dialog-content');
                exportButton.addEventListener('click', async () => {
                    const _values = {
                        exportOption: document.getElementsByName('exportOption')
                    };
                    const users = await getUsers();
                    for (let i = 0; i < _values.exportOption.length; i++) {
                        let ele = _values.exportOption[i];
                        if (ele.type = "radio") {
                            if (ele.checked) {
                                if (ele.value == "xls") {
                                    // @ts-ignore
                                    exportBlackListXls(users);
                                }
                                else if (ele.value == "csv") {
                                    // @ts-ignore
                                    exportBlackListCsv(users);
                                }
                                else if (ele.value == "pdf") {
                                    // @ts-ignore
                                    exportBlackListPdf(users);
                                }
                            }
                        }
                    }
                });
                _closeButton.onclick = () => {
                    new CloseDialog().x(_dialog);
                };
        });
    };*/
    pagination(items, limitRows, currentPage) {
        const tableBody = document.getElementById('datatable-body');
        const paginationWrapper = document.getElementById('pagination-container');
        paginationWrapper.innerHTML = '';
        let pageCount;
        pageCount = Math.ceil(infoPage.count / limitRows);
        let button;
        if (pageCount <= Config.maxLimitPage) {
            for (let i = 1; i < pageCount + 1; i++) {
                button = setupButtons(i /*, items, currentPage, tableBody, limitRows*/);
                paginationWrapper.appendChild(button);
            }
            fillBtnPagination(currentPage, Config.colorPagination);
        }
        else {
            pagesOptions(items, currentPage);
        }
        function setupButtons(page /*, items, currentPage, tableBody, limitRows*/) {
            const button = document.createElement('button');
            button.classList.add('pagination_button');
            button.setAttribute("name", "pagination-button");
            button.setAttribute("id", "btnPag" + page);
            button.innerText = page;
            button.addEventListener('click', () => {
                infoPage.offset = Config.tableRows * (page - 1);
                currentPage = page;
                new Schedules().render(infoPage.offset, currentPage, infoPage.search);
            });
            return button;
        }
        function pagesOptions(items, currentPage) {
            paginationWrapper.innerHTML = '';
            let pages = pageNumbers(items, Config.maxLimitPage, currentPage);
            const prevButton = document.createElement('button');
            prevButton.classList.add('pagination_button');
            prevButton.innerText = "<<";
            paginationWrapper.appendChild(prevButton);
            const nextButton = document.createElement('button');
            nextButton.classList.add('pagination_button');
            nextButton.innerText = ">>";
            for (let i = 0; i < pages.length; i++) {
                if (pages[i] > 0 && pages[i] <= pageCount) {
                    button = setupButtons(pages[i]);
                    paginationWrapper.appendChild(button);
                }
            }
            paginationWrapper.appendChild(nextButton);
            fillBtnPagination(currentPage, Config.colorPagination);
            setupButtonsEvents(prevButton, nextButton);
        }
        function setupButtonsEvents(prevButton, nextButton) {
            prevButton.addEventListener('click', () => {
                new Schedules().render(Config.offset, Config.currentPage, infoPage.search);
            });
            nextButton.addEventListener('click', () => {
                infoPage.offset = Config.tableRows * (pageCount - 1);
                new Schedules().render(infoPage.offset, pageCount, infoPage.search);
            });
        }
    }
    close() {
        const closeButton = document.getElementById('close');
        const editor = document.getElementById('entity-editor-container');
        closeButton.addEventListener('click', () => {
            new CloseDialog().x(editor);
        });
    }
}
