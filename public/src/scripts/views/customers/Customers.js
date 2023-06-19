// @filename: Customers.ts
import { deleteEntity, getEntitiesData, registerEntity, getUserInfo, getEntityData, updateEntity } from "../../endpoints.js";
import { inputObserver, inputSelect, CloseDialog, filterDataByHeaderType } from "../../tools.js";
import { Config } from "../../Configs.js";
import { tableLayout } from "./Layout.js";
import { tableLayoutTemplate } from "./Template.js";
const tableRows = Config.tableRows;
const currentPage = Config.currentPage;

const currentBusiness = async() => {
  const currentUser = await getUserInfo();
  const userid = await getEntityData('User', `${currentUser.attributes.id}`);
  return userid;
}

const getCustomers = async () => {
    const currentUser = await currentBusiness();
    const customer = await getEntitiesData('Customer');
    const FCustomer = customer.filter((data) => data.business.id === `${currentUser.business.id}`);
    return FCustomer;
};
export class Customers {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.entityDialogContainer = document.getElementById('entity-editor-container');
        this.content = document.getElementById('datatable-container');
        this.searchEntity = async (tableBody, data) => {
            const search = document.getElementById('search');
            await search.addEventListener('keyup', () => {
                const arrayData = data.filter((data) => `${data.name}
                 ${data.ruc}`
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
        let data = await getCustomers();
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
            let row = document.createElement('tr');
            row.innerHTML = `
        <td>los datos no coinciden con su búsqueda</td>
        <td></td>
        <td></td>
      `;
            table.appendChild(row);
        }
        else {
            for (let i = 0; i < paginatedItems.length; i++) {
                let customer = paginatedItems[i];
                let row = document.createElement('tr');
                row.innerHTML += `
          <td>${customer.name}</dt>
          <td>${customer.ruc}</dt>
          <td class="tag"><span>${customer.state.name}</span></td>
          <td class="entity_options">
              <button class="button" id="edit-entity" data-entityId="${customer.id}">
                <i class="fa-solid fa-pen"></i>
              </button>
          </dt>
        `;
                table.appendChild(row);
            }
        }
        this.register();
        this.edit(this.entityDialogContainer, data);
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
              new Customers().load(tableBody, page, items);
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
              <div class="avatar"><i class="fa-solid fa-briefcase"></i></div>
              <h1 class="entity_editor_title">Registrar <br><small>Empresa</small></h1>
            </div>

            <button class="btn btn_close_editor" id="close"><i class="fa-regular fa-x"></i></button>
          </div>

          <!-- EDITOR BODY -->
          <div class="entity_editor_body">
            <div class="material_input">
              <input type="text" id="entity-name" autocomplete="none">
              <label for="entity-name">Nombre</label>
            </div>

            <div class="material_input">
              <input type="text"
                id="entity-ruc"
                maxlength="13" autocomplete="none">
              <label for="entity-ruc">RUC</label>
            </div>

            <div class="material_input_select">
              <label for="entity-state">Estado</label>
              <input type="text" id="entity-state" class="input_select" readonly placeholder="cargando..." autocomplete="none">
              <div id="input-options" class="input_options">
              </div>
            </div>

            <div class="input_checkbox">
                <label><input type="checkbox" class="checkbox" id="entity-marcation" checked> Permitir Marcación</label>
            </div>

            <div class="input_checkbox">
                <label><input type="checkbox" class="checkbox" id="entity-vehicular"> Permitir Vehicular</label>
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
            inputSelect('State', 'entity-state');
            this.close();
            const registerButton = document.getElementById('register-entity');
            registerButton.addEventListener('click', async() => {
                const businessData = await currentBusiness();
                const inputsCollection = {
                    name: document.getElementById('entity-name'),
                    ruc: document.getElementById('entity-ruc'),
                    state: document.getElementById('entity-state'),
                    marcation: document.getElementById('entity-marcation'),
                    vehicular: document.getElementById('entity-vehicular')
                };
                const raw = JSON.stringify({
                    "name": `${inputsCollection.name.value}`,
                    "business": {
                        "id": `${businessData.business.id}`},
                    "ruc": `${inputsCollection.ruc.value}`,
                    "state": {
                      "id": `${inputsCollection.state.dataset.optionid}`},
                    "firebaseId":`${inputsCollection.name.value}`,
                    "associate":`${businessData.business.name}`,
                    "permitMarcation": `${inputsCollection.marcation.checked ? true : false}`,
                    "permitVehicular": `${inputsCollection.vehicular.checked ? true : false}`,
                });
                registerEntity(raw, 'Customer');
                setTimeout(() => {
                    const container = document.getElementById('entity-editor-container');
                    new CloseDialog().x(container);
                    new Customers().render();
                }, 1000);
            });
        };
        const reg = async (raw) => {
        };
    }
    edit(container, data) {
        // Edit entity
        const edit = document.querySelectorAll('#edit-entity');
        edit.forEach((edit) => {
            const entityId = edit.dataset.entityid;
            edit.addEventListener('click', () => {
                RInterface('Customer', entityId);
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
                id="entity-ruc"
                class="input_filled"
                maxlength="10"
                value="${data?.ruc ?? ''}">
              <label for="entity-ruc">RUC</label>
            </div>

            <div class="material_input_select">
              <label for="entity-state">Estado</label>
              <input type="text" id="entity-state" class="input_select" readonly placeholder="cargando...">
              <div id="input-options" class="input_options">
              </div>
            </div>

            <div class="input_checkbox">
                <label><input type="checkbox" class="checkbox" id="entity-marcation"> Permitir Marcación</label>
            </div>

            <div class="input_checkbox">
                <label><input type="checkbox" class="checkbox" id="entity-vehicular"> Permitir Vehicular</label>
            </div>

          </div>
          <!-- END EDITOR BODY -->

          <div class="entity_editor_footer">
            <button class="btn btn_primary btn_widder" id="update-changes">Guardar</button>
          </div>
        </div>
      `;
            const checkboxMarcation = document.getElementById('entity-marcation');
            if (data.permitMarcation === true) {
              checkboxMarcation?.setAttribute('checked', 'true');
            }

            const checkboxVehicular = document.getElementById('entity-vehicular');
            if (data.permitVehicular === true) {
              checkboxVehicular?.setAttribute('checked', 'true');
            }
            inputObserver();
            inputSelect('State', 'entity-state', data.state.name);
            this.close();
            UUpdate(entityID);
        };
        const UUpdate = async (entityId) => {
            const updateButton = document.getElementById('update-changes');
            const $value = {
              // @ts-ignore
              ruc: document.getElementById('entity-ruc'),
              // @ts-ignore
              status: document.getElementById('entity-state'),
              // @ts-ignore
              marcation: document.getElementById('entity-marcation'),
              // @ts-ignore
              vehicular: document.getElementById('entity-vehicular')
          };
            updateButton.addEventListener('click', () => {
              let raw = JSON.stringify({
                  // @ts-ignore
                  "ruc": `${$value.ruc.value}`,
                  "state": {
                      "id": `${$value.status?.dataset.optionid}`
                  },
                  "permitMarcation": `${$value.marcation.checked ? true : false}`,
                  "permitVehicular": `${$value.vehicular.checked ? true : false}`,
              });
              update(raw);
            });
            const update = (raw) => {
              updateEntity('Customer', entityId, raw)
                  .then((res) => {
                  setTimeout(async () => {
                      let tableBody;
                      let container;
                      let data;
                      data = await getCustomers();
                      new CloseDialog()
                          .x(container =
                          document.getElementById('entity-editor-container'));
                      new Customers().load(tableBody
                          = document.getElementById('datatable-body'), currentPage, data);
                  }, 100);
              });
          };
        };
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

