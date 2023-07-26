// @filename: Schedules.ts
import { deleteEntity, getEntitiesData, registerEntity, updateEntity, getEntityData } from "../../../endpoints.js";
import { inputObserver, inputSelect, CloseDialog, filterDataByHeaderType } from "../../../tools.js";
import { Config } from "../../../Configs.js";
import { tableLayout } from "./Layout.js";
import { tableLayoutTemplate } from "./Template.js";
const tableRows = Config.tableRows;
const currentPage = Config.currentPage;
const customerId = localStorage.getItem('customer_id');
const getSchedules= async () => {
    //nombre de la entidad
    const schedule = await getEntitiesData('Schedule');
    const FCustomer = schedule.filter((data) => `${data.customer?.id}` === `${customerId}`);
    return FCustomer;
};
export class Schedules {
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
        let data = await getSchedules();
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
                let schedule = paginatedItems[i];
                let row = document.createElement('tr');
                row.innerHTML += `
          <td>${schedule.name}</dt>
          <td>${schedule.cords}</dt>
          <td>${schedule.distance}</dt>
          <td class="entity_options">
          <button class="button" id="edit-entity" data-entityId="${schedule.id}">
            <i class="fa-solid fa-pen"></i>
          </button>
            <button class="button" id="remove-entity" data-entityId="${schedule.id}">
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
              new Schedules().load(tableBody, page, items);
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
              <h1 class="entity_editor_title">Registrar <br><small>Horario</small></h1>
            </div>

            <button class="btn btn_close_editor" id="close"><i class="fa-regular fa-x"></i></button>
          </div>

          <!-- EDITOR BODY -->
          <div class="entity_editor_body">
            <div class="material_input">
              <input type="text" id="entity-name" autocomplete="none">
              <label for="entity-name">Horario</label>
            </div>
            <div class="form_group">
                <div class="form_input">
                    <label class="form_label" for="start-time">Entrada:</label>
                    <input type="time" class="input_time input_time-start" id="start-time" name="start-time">
                </div>

                <div class="form_input">
                    <label class="form_label" for="end-time">Salida:</label>
                    <input type="time" class="input_time input_time-end" id="end-time" name="end-time">
                </div>
            </div>
            <br>
            <br> 
            <br> 
            <label>Tolerancia Tiempo Entrada</label>
            <br> 
            <br> 
            <br> 
            <div class="form_group">
            
              <div class="form_input">
                  <label class="form_label" for="start-time">Entrada:</label>
                  <input type="time" class="input_time input_time-start" id="start-time" name="start-time">
              </div>

              <div class="form_input">
                  <label class="form_label" for="end-time">Salida:</label>
                  <input type="time" class="input_time input_time-end" id="end-time" name="end-time">
              </div>
            </div>
            <br>
            <br> 
            <br> 
            <label>Tolerancia Tiempo Salida</label>
            <br> 
            <br> 
            <br> 
            <div class="form_group">
            
              <div class="form_input">
                  <label class="form_label" for="start-time">Entrada:</label>
                  <input type="time" class="input_time input_time-start" id="start-time" name="start-time">
              </div>

              <div class="form_input">
                  <label class="form_label" for="end-time">Salida:</label>
                  <input type="time" class="input_time input_time-end" id="end-time" name="end-time">
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
            registerButton.addEventListener('click', () => {
                const inputsCollection = {
                    name: document.getElementById('entity-name'),
                    cords: document.getElementById('entity-cords'),
                    distance: document.getElementById('entity-distance'),
                  
                };
                const raw = JSON.stringify({
                    "name": `${inputsCollection.name.value}`,
                    "cords": `${inputsCollection.cords.value}`,
                    "distance": `${inputsCollection.distance.value}`,                   
                    "customer": {
                        "id": `${customerId}`
                    }
                });
                registerEntity(raw, 'Schedule');
                setTimeout(() => {
                    const container = document.getElementById('entity-editor-container');
                    new CloseDialog().x(container);
                    new Schedules().render();
                }, 1000);
            });
        };
        const reg = async (raw) => {
        };
    }
    edit(container, data) {
     
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
            <div class="avatar"><i class="fa-regular fa-briefcase"></i></div>
            <h1 class="entity_editor_title">Editar <br><small>${data.name}</small></h1>
          </div>

          <button class="btn btn_close_editor" id="close"><i class="fa-solid fa-x"></i></button>
        </div>

        <!-- EDITOR BODY -->
        <div class="entity_editor_body">
          <div class="material_input">
            <input type="text"
              id="entity-name"
              class="input_filled"
              maxlength="30"
              value="${data?.name ?? ''}">
            <label for="entity-name">Horario</label>
          </div>
          <div class="material_input">
            <input type="text"
              id="entity-cords"
              class="input_filled"
              maxlength="40"
              value="${data?.cords ?? ''}">
            <label for="entity-cords">Coordenadas</label>
          </div>
          <div class="material_input">
            <input type="text"
              id="entity-distance"
              class="input_filled"
              maxlength="4"
              value="${data?.distance ?? ''}">
            <label for="entity-distance">Distancia</label>
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
            cords: document.getElementById('entity-cords'),
            // @ts-ignore
            distance: document.getElementById('entity-distance'),
           
        };
          updateButton.addEventListener('click', () => {
            let raw = JSON.stringify({
                // @ts-ignore
                "name": `${$value.name.value}`,
                // @ts-ignore
                "cords": `${$value.cords.value}`,
                // @ts-ignore
                "distance": `${$value.distance.value}`,
            });
            update(raw);
          });
          const update = (raw) => {
            updateEntity('Schedule', entityId, raw)
                .then((res) => {
                setTimeout(async () => {
                    let tableBody;
                    let container;
                    let data;
                    data = await getSchedules();
                    new CloseDialog()
                        .x(container =
                        document.getElementById('entity-editor-container'));
                    new Schedules().load(tableBody
                        = document.getElementById('datatable-body'), currentPage, data);
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
                this.dialogContainer.style.display = 'flex';
                this.dialogContainer.innerHTML = `
          <div class="dialog_content" id="dialog-content">
            <div class="dialog dialog_danger">
              <div class="dialog_container">
                <div class="dialog_header">
                  <h2>¿Deseas eliminar esta Horario?</h2>
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
                        .then(res => new Schedules().render());
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
