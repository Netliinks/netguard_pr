// @filename: Sporadic.ts
import { deleteEntity, getEntitiesData, registerEntity, updateEntity, getEntityData,setFile,getUserInfo,getFile,postNotificationPush,getFilterEntityData } from "../../../../endpoints.js";
import { inputObserver, inputSelect, CloseDialog, filterDataByHeaderType } from "../../../../tools.js";
import { Config } from "../../../../Configs.js";
import { tableLayout } from "./Layout.js";
import { tableLayoutTemplate } from "./Template.js";
import { exportSporadicCsv, exportSporadicPdf, exportSporadicXls } from "../../../../exportFiles/taskSporadic.js";
const tableRows = Config.tableRows;
const currentPage = Config.currentPage;
const customerId = localStorage.getItem('customer_id');
const getTakSporadic= async () => {
    //nombre de la entidad
    const takSporadic = await getEntitiesData('Task_');
    
    const FCustomer = takSporadic.filter((data) => `${data.customer?.id}` === `${customerId}` &&  `${data.taskType}`==='ESPORADICAS');
    return FCustomer;
};
export class Sporadic {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.entityDialogContainer = document.getElementById('entity-editor-container');
        this.content = document.getElementById('datatable-container');
        this.searchEntity = async (tableBody, data) => {
            const search = document.getElementById('search');
            await search.addEventListener('keyup', () => {
                const arrayData = data.filter((user) => `${user.name}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase()));
                let filteredResult = arrayData.length;
                let result = arrayData;
                if (filteredResult >= tableRows)
                    filteredResult = tableRows;
                this.load(tableBody, currentPage, result);
                this.pagination(result, tableRows, currentPage);
            });
        };
    }
    
    async render() {
        this.content.innerHTML = '';
        this.content.innerHTML = tableLayout;
        const tableBody = document.getElementById('datatable-body');
        tableBody.innerHTML = '.Cargando...';
        let data = await getTakSporadic();
        tableBody.innerHTML = tableLayoutTemplate.repeat(tableRows);
        this.load(tableBody, currentPage, data);
        this.searchEntity(tableBody, data);
        new filterDataByHeaderType().filter();
        this.pagination(data, tableRows, currentPage);
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
                let taskSporadic = paginatedItems[i];
                let row = document.createElement('tr');
                row.innerHTML += `
          <td>${taskSporadic.name}</dt>
          
          <td>${taskSporadic.execDate}</dt>

          <td>${taskSporadic.execTime}</dt>`;  
          
          if(taskSporadic.isRead == false){
            
            row.innerHTML += `<td><i class="fa-solid fa-eye-slash"></i></span></td>`;
          }
          else{
            row.innerHTML += `<td><span><i class="fa-solid fa-eye"></i></span></td>`;
          } 

          row.innerHTML += `
          <td class="entity_options">
          <button class="button" id="edit-entity" data-entityId="${taskSporadic.id}">
          <i class="fa-solid fa-pen"></i>
        </button>
            <button class="button" id="remove-entity" data-entityId="${taskSporadic.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </dt>
        `;
                table.appendChild(row);
            }
        }
        this.register(); 
        this.edit(this.entityDialogContainer, data);
        this.remove();
        this.export();
    }
    
    pagination(items, limitRows, currentPage) {
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
              new Sporadic().load(tableBody, page, items);
          });
          return button;
      }
    }
    register() {
      // register entity
      const openEditor = document.getElementById('new-entity');
      openEditor.addEventListener('click', () => {
          renderInterface();
          
      });
      const renderInterface = async () => {
          this.entityDialogContainer.innerHTML = '';
          this.entityDialogContainer.style.display = 'flex';
          this.entityDialogContainer.innerHTML = `
      <div class="entity_editor" id="entity-editor">
        <div class="entity_editor_header">
          <div class="user_info">
            <div class="avatar"><i class="fa-solid fa-building"></i></div>
            <h1 class="entity_editor_title">Registrar <br><small>Específicas</small></h1>
          </div>

          <button class="btn btn_close_editor" id="close"><i class="fa-regular fa-x"></i></button>
        </div>

        <!-- EDITOR BODY -->
        <div class="entity_editor_body">
          <div class="material_input">
            <input type="text" id="entity-name" autocomplete="none" required>
            <label for="entity-name">Específicas</label>
          </div>
          <div class="form_group">
              <div class="form_input">
                  <label class="form_label" for="execution-date">Fecha de Ejecución:</label>
                  <input type="date" class="input_time input_execution-date" id="execution-date" name="execution-date">
              </div>
              <div class="form_input">
                  <label class="form_label" for="execution-time">Hora de Ejecución:</label>
                  <input type="time" class="input_time input_time-execution" id="execution-time" name="execution-time">
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
          const _fileHandler = document.getElementById('file-handler');
          const registerButton = document.getElementById('register-entity');
          const fecha = new Date();
          const day = fecha.getDate();
          const month = fecha.getMonth() + 1; 
          const year = fecha.getFullYear();

          const dateFormat = year + '-' + month + '-' + day;
          
          const hour = fecha.getHours();
          const minutes  = fecha.getMinutes();
          const seconds = fecha.getSeconds();

          const hourFormat = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

 
          registerButton.addEventListener('click', async(e) => {
              e.preventDefault();
              const name = document.getElementById('entity-name')
              
              const executionDate = document.getElementById('execution-date')
              const executionTime = document.getElementById('execution-time')
              let dateToday = new Date(dateFormat);
              let dateExec = new Date(executionDate.value); 
              let horusInstant = new Date( `${dateFormat}T${hourFormat}`);
              let horusExec = new Date(`${dateFormat}T${executionTime.value}`);
              //console.log(hourFormat)
              //console.log(executionTime.value)
               
              if(name.value.trim() === '' || name.value.trim() === null){
                alert('Nombre del consigna general vacío')
              }
              else if(executionDate.value.trim() === '' || executionDate.value.trim() === null){
                alert('Debe especificar la fecha de la consigna')
              }
              else if(dateToday > dateExec){
                alert('La fecha no puede ser menor a la del día de hoy')
              }

              else if(executionTime.value.trim() === '' || executionTime.value.trim() === null){
                alert('Debe especificar la hora de ejecución de la consigna')
              }
              //COMPARANDO LAS HORAS DEL MISMO DIA
              else if(dateToday.getTime() == dateExec.getTime() && (horusInstant > horusExec)){
                alert('La hora no puede ser menor a la actual')
                
              }
              else{
               
                const inputsCollection = {
                    name: name,
                    executionDate: executionDate,
                    executionTime: executionTime
                    
                  
                };
                let _userInfo = await getUserInfo();
                const customerId = localStorage.getItem('customer_id');
                console.log(inputsCollection.executionDate.value)
                const raw = JSON.stringify({
                    "taskType": `ESPORADICAS`,
                    "name": `${inputsCollection.name.value}`,
                    "execDate": `${inputsCollection.executionDate.value}`,
                    "user":  {
                      "id": `${_userInfo['attributes']['id']}`
                    },   
                    "customer": {
                        "id": `${customerId}`
                    },
                    "execTime":`${inputsCollection.executionTime.value}`,
                    "startTime": `${hourFormat}`,
                    "startDate": `${dateFormat}`,
                    
                });
                

    

                registerEntity(raw, 'Task_');
                const users = await getEntitiesData('User');
                const FUsers = users.filter((data) => `${data.customer?.id}` === `${customerId}` && `${data.userType}` === `GUARD`);
                for(let i =0; i<FUsers.length;i++){
                    if(FUsers[i]['token']!=undefined){
                        const data = {"token":FUsers[i]['token'],"title": "Específica", "body":`${inputsCollection.name.value}` }
                        const envioPush = await postNotificationPush(data);
                        console.log(envioPush)
                    }  
                }
               
                setTimeout(() => {
                    const container = document.getElementById('entity-editor-container');
                    new CloseDialog().x(container);
                    new Sporadic().render();
                }, 1000);
              }
          });
        
          
      };
     
    }
    edit(container, data) {
      // Edit entity
      const edit = document.querySelectorAll('#edit-entity');
      edit.forEach((edit) => {
          const entityId = edit.dataset.entityid;
          edit.addEventListener('click', () => {
              RInterface('Task_', entityId);
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
                  <div class="avatar"><i class="fa-regular fa-user"></i></div>
                  <h1 class="entity_editor_title">Editar <br><small>${data.name} </small></h1>
                  </div>

                  <button class="btn btn_close_editor" id="close"><i class="fa-solid fa-x"></i></button>
              </div>

              <!-- EDITOR BODY -->
              <div class="entity_editor_body">
                  <div class="material_input">
                    <input type="text" id="entity-name" class="input_filled" value="${data.name}" >
                    <label for="entity-name">Nombre</label>
                  </div>
                  <div class="form_group">
                    <div class="form_input">
                        <label class="form_label" for="execution-date">Fecha de Ejecución:</label>
                        <input type="date" class="input_time input_execution-date" id="execution-date" name="execution-date" value="${data.execDate}">
                    </div>
                    <div class="form_input">
                        <label class="form_label" for="execution-time">Hora de Ejecución:</label>
                        <input type="time" class="input_time input_time-execution" id="execution-time" name="execution-time" value="${data.execTime}">
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
          UUpdate(entityID);
      };
      const UUpdate = async (entityId) => {
          const updateButton = document.getElementById('update-changes');
          const $value = {
            // @ts-ignore
            name: document.getElementById('entity-name'),
            // @ts-ignore
            execDate : document.getElementById('execution-date'),
            execTime: document.getElementById('execution-time'),
            // @ts-ignore
           
           
        };
          updateButton.addEventListener('click', (e) => {
            e.preventDefault()
            const name = document.getElementById('entity-name')
            const executionDate= document.getElementById('execution-date')
            const executionTime = document.getElementById('execution-time')
            const fecha = new Date();
            const day = fecha.getDate();
            const month = fecha.getMonth() + 1; 
            const year = fecha.getFullYear();

            const dateFormat = year + '-' + month + '-' + day;
            const hour = fecha.getHours();
            const minutes  = fecha.getMinutes();
            const seconds = fecha.getSeconds();

            const hourFormat = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
             
            let dateToday = new Date(dateFormat);
            let dateExec = new Date(executionDate.value); 
            let horusInstant = new Date( `${dateFormat}T${hourFormat}`);
            let horusExec = new Date(`${dateFormat}T${executionTime.value}`);
            //console.log(hourFormat)
            //console.log(executionTime.value)
             
            if(name.value.trim() === '' || name.value.trim() === null){
              alert('Nombre del consigna general vacío')
            }
            else if(executionDate.value.trim() === '' || executionDate.value.trim() === null){
              alert('Debe especificar la fecha de la consigna')
            }
            else if(dateToday > dateExec){
              alert('La fecha no puede ser menor a la del día de hoy')
            }

            else if(executionTime.value.trim() === '' || executionTime.value.trim() === null){
              alert('Debe especificar la hora de ejecución de la consigna')
            }
            //COMPARANDO LAS HORAS DEL MISMO DIA
            else if(dateToday.getTime() == dateExec.getTime() && (horusInstant > horusExec)){
              alert('La hora no puede ser menor a la actual')
              
            }
         
            else{
              let raw = JSON.stringify({
                  // @ts-ignore
                  "name": `${$value.name.value}`,
                  // @ts-ignore
                  "execDate": `${$value.execDate.value}`,
                  // @ts-ignore
                  "execTime": `${$value.execTime.value}`,
                  
              });
              update(raw);
            }
          });
          const update = (raw) => {
            updateEntity('Task_', entityId, raw)
                .then((res) => {
                setTimeout(async () => {
                    let tableBody;
                    let container;
                    let data;
                    data = await getTakSporadic();
                    new CloseDialog()
                        .x(container =
                        document.getElementById('entity-editor-container'));
                    new Sporadic().load(tableBody
                        = document.getElementById('datatable-body'), currentPage, data);
                }, 100);
            });
        };
        const users = await getEntitiesData('User');
        const FUsers = users.filter((data) => `${data.customer?.id}` === `${customerId}` && `${data.userType}` === `GUARD`);
        for(let i =0; i<FUsers.length;i++){
            if(FUsers[i]['token']!=undefined){
                const data = {"token":FUsers[i]['token'],"title": "Específica", "body":`${$value.name.value}` }
                const envioPush = await postNotificationPush(data);
               
            }  
        }
        //const data = {"title": "Específica", "body":`${$value.name.value}` }
        //const envioPush = await postNotificationPush(data);
      };
    }
    remove() {
        const remove = document.querySelectorAll('#remove-entity');
        remove.forEach((remove) => {
            const entityId = remove.dataset.entityid;
            remove.addEventListener('click', () => {
                this.dialogContainer.style.display = 'flex';
                this.dialogContainer.innerHTML = `
          <div class="dialog_content" id="dialog-content">
            <div class="dialog dialog_danger">
              <div class="dialog_container">
                <div class="dialog_header">
                  <h2>¿Deseas eliminar este Consigna Específica?</h2>
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
                    deleteEntity('Task_', entityId)
                        .then(res => new Sporadic().render());
                    new CloseDialog().x(dialogContent);
                };
                cancelButton.onclick = () => {
                    new CloseDialog().x(dialogContent);
                };
            });
        });
    }
    close() {
        const closeButton = document.getElementById('close');
        const editor = document.getElementById('entity-editor-container');
        closeButton.addEventListener('click', () => {
            console.log('close');
            new CloseDialog().x(editor);
        });
    }
    export = () => {
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
              const _values = {
                  start: document.getElementById('start-date'),
                  end: document.getElementById('end-date'),
                  exportOption: document.getElementsByName('exportOption')
              }
              let rawExport = JSON.stringify({
                  "filter": {
                      "conditions": [
                            {
                              "property": "taskType",
                              "operator": "=",
                              "value": `ESPORADICAS`
                          },
                          {
                              "property": "customer.id",
                              "operator": "=",
                              "value": `${customerId}`
                          },
                          {
                              "property": "execDate",
                              "operator": ">=",
                              "value": `${_values.start.value}`
                          },
                          {
                              "property": "execDate",
                              "operator": "<=",
                              "value": `${_values.end.value}`
                          }
                      ],
                  },
                  sort: "-execDate",
                  fetchPlan: 'full',
              });
              const sporadic = await getFilterEntityData("Task_", rawExport); 
              for (let i = 0; i < _values.exportOption.length; i++) {
                  let ele = _values.exportOption[i];
                  if (ele.type = "radio") {
                      if (ele.checked) {
                          if (ele.value == "xls") {
                              // @ts-ignore
                              exportSporadicXls(sporadic, _values.start.value, _values.end.value);
                          }
                          else if (ele.value == "csv") {
                              // @ts-ignore
                              exportSporadicCsv(sporadic, _values.start.value, _values.end.value);
                          }
                          else if (ele.value == "pdf") {
                              // @ts-ignore
                              exportSporadicPdf(sporadic, _values.start.value, _values.end.value);
                          }
                      }
                  }
              }
          });
          _closeButton.onclick = () => {
              new CloseDialog().x(_dialog);
          };
      });
  };
}
export const setNewPassword = async () => {
    const users = await getEntitiesData('User');
    const FNewUsers = users.filter((data) => data.isSuper === false);
    FNewUsers.forEach((newUser) => {
    });
    console.group('Nuevos usuarios');
    console.log(FNewUsers);
    console.time(FNewUsers);
    console.groupEnd();
};
