//
//  Layout.ts
//
//  Generated by Poll Castillo on 09/03/2023.
//
export const UIContentLayout = `
    <div class="datatable" id="datatable">
        <div class="datatable_header">
            <div class="datatable_title"><h1 id="view-title"></h1></div>

            <div class="datatable_tools" id="datatable-tools">
                <input type="search" class="search_input" placeholder="Buscar" id="search">

                <button class="datatable_button import_user" id="export-entities">Exportar</button>
            </div>
        </div>

        <table class="datatable_content">
        <thead><tr>
            <th><span data-type="name">
            Nombre <i class="fa-regular fa-filter"></i>
            </span></th>

            <th><span data-type="CI">
            CI <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=100><span data-type="start">
            Inicio <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=120><span data-type="end">
            Fin <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=110><span data-type="state">
            Estado <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=120><span data-type="details">
            Detalles
            </span></th>

        </tr></thead>
        <tbody id="datatable-body" class="datatable_body">

        </tbody>
        </table>

        </div>

        <div class="datatable_footer">
        <div class="datatable_pagination" id="pagination-container"></div>
        </div>`;
export const UIRightSidebar = `
<div class="entity_editor" id="entity-editor">
<div class="entity_editor_header">
  <div class="user_info">
    <div class="avatar"><i class="fa-regular fa-user"></i></div>
    <h1 class="entity_editor_title">Detalles de <br><small>Asistencia</small></h1>
  </div>

  <button class="btn btn_close_editor" id="close"><i class="fa-solid fa-x"></i></button>
</div>

<!-- EDITOR BODY -->
<div class="entity_editor_body">
    <div class="tag"><i class="label active_label"><i class="fa-solid fa-circle-dot"></i> Estado:</i> <span class="tag_gray" id="marking-status"></span></div>
  <br><br>

    <div class="input_detail">
        <label for="marking-name"><i class="fa-solid fa-user"></i></label>
        <input type="text" id="marking-name" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-dni"><i class="fa-solid fa-address-card"></i></label>
        <input type="text" id="marking-dni" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-type"><i class="fa-solid fa-object-group"></i></label>
        <input type="text" id="marking-type" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-department"><i class="fa-solid fa-building"></i></label>
        <input type="text" id="marking-department" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-contractor"><i class="fa-solid fa-briefcase"></i></label>
        <input type="text" id="marking-contractor" class="input_filled" readonly>
    </div>
    <br>
    <!-- Start marking -->
    <h3>Ingreso</h3>
    <br>
    <div class="input_detail">
        <label for="marking-start-date"><i class="fa-solid fa-calendar"></i></label>
        <input type="date" id="marking-start-date" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-start-time"><i class="fa-solid fa-clock"></i></label>
        <input type="time" id="marking-start-time" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-start-guard-id"><i class="fa-solid fa-user-police"></i></label>
        <input type="text" id="marking-start-guard-id" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-start-guard-name"><i class="fa-solid fa-user-police"></i></label>
        <input type="text" id="marking-start-guard-name" class="input_filled" readonly>
    </div>
    <br>
    <!-- End marking -->
    <h3>Salida</h3>
    <br>
    <div class="input_detail">
        <label for="marking-end-date"><i class="fa-solid fa-calendar"></i></label>
        <input type="date" id="marking-end-date" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-end-time"><i class="fa-solid fa-clock"></i></label>
        <input type="time" id="marking-end-time" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-end-guard-id"><i class="fa-solid fa-user-police"></i></label>
        <input type="text" id="marking-end-guard-id" class="input_filled" readonly>
    </div>
    <br>
    <div class="input_detail">
        <label for="marking-end-guard-name"><i class="fa-solid fa-user-police"></i></label>
        <input type="text" id="marking-end-guard-name" class="input_filled" readonly>
    </div>
    <br>
</div>
</div>
`;
