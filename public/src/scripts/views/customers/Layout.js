//
//  Layout.ts
//
//  Generated by Poll Castillo on 13/03/2023.
//
export const tableLayout = `
  <div class="datatable" id="datatable">
    <div class="datatable_header">
      <div class="datatable_title" id="datatable-title"><h1>Empresas</h1></div>
      <div class="datatable_tools" id="datatable-tools">
        <input type="search"
        class="search_input"
        placeholder="Buscar"
        id="search">

        <button
          class="datatable_button add_user"
          id="new-entity">
          <i class="fa-solid fa-add"></i>
        </button>
      </div>
    </div>

    <table class="datatable_content">
      <thead><tr>
        <th><span data-type="name">
          Nombre <i class="fa-regular fa-filter"></i>
        </span></th>

        <th><span data-type="ruc">
          RUC <i class="fa-regular fa-filter"></i>
        </span></th>

        <th class="thead_centered"><span data-type="status">
          Estado <i class="fa-regular fa-filter"></i>
        </span></th>

        <th class="header_filled"></th>

      </tr></thead>
      <tbody id="datatable-body" class="datatable_body">

      </tbody>
    </table>

    </div>

    <div class="datatable_footer">
      <div class="datatable_pagination" id="pagination-container"></div>
    </div>`;
export const UIContact = `
  <div class="dialog_content" id="dialog-content">
  <div class="dialog">
      <div class="dialog_container padding_8">
          <div class="dialog_header">
              <h2>Actualizar Contacto</h2>
          </div>

          <div class="dialog_message padding_8">
            <div class="material_input">
              <input type="text"
                id="entity-contact-name"
                class="input_filled">
              <label for="entity-contact-name">Nombre Contacto</label>
            </div>

            <div class="material_input">
              <input type="text"
                id="entity-contact-phone"
                class="input_filled"
                maxlength="10">
              <label for="entity-contact-phone">Teléfono Contacto</label>
            </div>
          </div>

          <div class="dialog_footer">
              <button class="btn btn_primary" id="cancel">Cancelar</button>
              <button class="btn btn_danger" id="update-contact">Actualizar</button>
          </div>
      </div>
  </div>
  </div>
`;
