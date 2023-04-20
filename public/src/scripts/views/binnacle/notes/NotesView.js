//
//  NotesView.ts
//
//  Generated by Poll Castillo on 09/03/2023.
//
import { Config } from "../../../Configs.js";
import { getEntityData, getEntitiesData, getFile, getUserInfo, getFilterEntityData } from "../../../endpoints.js";
import { CloseDialog, renderRightSidebar, filterDataByHeaderType, inputObserver, generateCsv } from "../../../tools.js";
import { UIContentLayout, UIRightSidebar } from "./Layout.js";
import { UITableSkeletonTemplate } from "./Template.js";
// Local configs
const tableRows = Config.tableRows;
let currentPage = Config.currentPage;
const pageName = 'Notas';
const customerId = localStorage.getItem('customer_id');
const GetNotes = async () => {
    const notesRaw = await getEntitiesData('Note');
    const notes = notesRaw.filter((data) => data.customer?.id === `${customerId}`);
    return notes;
};
export class Notes {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.siebarDialogContainer = document.getElementById('entity-editor-container');
        this.appContainer = document.getElementById('datatable-container');
        this.render = async () => {
            let notesArray = await GetNotes();
            this.appContainer.innerHTML = '';
            this.appContainer.innerHTML = UIContentLayout;
            // Getting interface elements
            const viewTitle = document.getElementById('view-title');
            const tableBody = document.getElementById('datatable-body');
            // Changing interface element content
            viewTitle.innerText = pageName;
            tableBody.innerHTML = UITableSkeletonTemplate.repeat(tableRows);
            // Exec functions
            this.load(tableBody, currentPage, notesArray);
            this.searchNotes(tableBody, notesArray);
            new filterDataByHeaderType().filter();
            this.pagination(notesArray, tableRows, currentPage);
            this.export();
            // Rendering icons
        };
        this.load = (tableBody, currentPage, notes) => {
            tableBody.innerHTML = ''; // clean table
            // configuring max table row size
            currentPage--;
            let start = tableRows * currentPage;
            let end = start + tableRows;
            let paginatedItems = notes.slice(start, end);
            // Show message if page is empty
            if (notes.length === 0) {
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
                    let note = paginatedItems[i]; // getting note items
                    let row = document.createElement('TR');
                    const noteCreationDateAndTime = note.creationDate.split('T');
                    const noteCreationDate = noteCreationDateAndTime[0];
                    row.innerHTML += `
                    <td>${note.title}</td>
                    <td>${note.content}</td>
                    <td id="table-date">${noteCreationDate}</td>
                    <td>
                        <button class="button" id="entity-details" data-entityId="${note.id}">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </td>
                `;
                    tableBody.appendChild(row);
                    this.previewNote(note.id);
                    
                    // TODO: Corret this fixer
                    // fixDate()
                }
            }
        };
        this.searchNotes = async (tableBody, notes) => {
            const search = document.getElementById('search');
            await search.addEventListener('keyup', () => {
                const arrayNotes = notes.filter((note) => `${note.title}
                ${note.content}
                ${note.creationDate}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase()));
                let filteredNotes = arrayNotes.length;
                let result = arrayNotes;
                if (filteredNotes >= Config.tableRows)
                    filteredNotes = Config.tableRows;
                this.load(tableBody, currentPage, result);
                this.pagination(result, tableRows, currentPage);
                // Rendering icons
            });
        };
        this.previewNote = async (noteID) => {
            const openPreview = document.querySelectorAll('#entity-details');
            openPreview.forEach((preview) => {
                let currentNoteId = preview.dataset.entityid;
                preview.addEventListener('click', () => {
                    previewBox(currentNoteId);
                });
            });
            const previewBox = async (noteId) => {
                const note = await getEntityData('Note', noteId);
                renderRightSidebar(UIRightSidebar);
                const sidebarContainer = document.getElementById('entity-editor-container');
                const closeSidebar = document.getElementById('close');
                closeSidebar.addEventListener('click', () => {
                    new CloseDialog().x(sidebarContainer);
                });
                // Note details
                const _details = {
                    picture: document.getElementById('note-picture-placeholder'),
                    title: document.getElementById('note-title'),
                    content: document.getElementById('note-content'),
                    author: document.getElementById('note-author'),
                    authorId: document.getElementById('note-author-id'),
                    date: document.getElementById('creation-date'),
                    time: document.getElementById('creation-time')
                };
                const image = await getFile(note.attachment);
                const noteCreationDateAndTime = note.creationDate.split('T');
                const noteCreationTime = noteCreationDateAndTime[1];
                const noteCreationDate = noteCreationDateAndTime[0];
                _details.title.innerText = note.title;
                _details.content.innerText = note.content;
                _details.author.value = `${note.user.firstName} ${note.user.lastName}`;
                _details.authorId.value = note.createdBy;
                _details.date.value = noteCreationDate;
                _details.time.value = noteCreationTime;
                if (note.attachment !== undefined) {
                    _details.picture.innerHTML = `
                    <img id="note-picture" width="100%" class="note_picture margin_b_8" src="${image}">
                `;
                }
            };
        };
        this.closeRightSidebar = () => {
            const closeButton = document.getElementById('close');
            const editor = document.getElementById('entity-editor-container');
            closeButton.addEventListener('click', () => {
                new CloseDialog().x(editor);
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
                        //console.log(_values.start.value)
                        //console.log(_values.end.value)
                        //const headers = ['Título', 'Contenido', 'Autor', 'Fecha', 'Hora']
                        const notes = await GetNotes();
                        for(let i=0; i < notes.length; i++){
                            let note = notes[i]
                            let noteCreationDateAndTime = note.creationDate.split('T');
                            let noteCreationDate = noteCreationDateAndTime[0];
                            let noteCreationTime = noteCreationDateAndTime[1];
                            if(noteCreationDate >= _values.start.value && noteCreationDate <= _values.end.value){
                                let obj = {
                                    "Título": `${note.title.split("\n").join("(salto)")}`,
                                    "Fecha": `${noteCreationDate}`,
                                    "Hora": `${noteCreationTime}`,
                                    "Usuario": `${note.user.firstName} ${note.user.lastName}`,
                                    "Contenido": `${note.content.split("\n").join("(salto)")}`
                                  }
                                  rows.push(obj);
                            }
                            
                        }
                        generateCsv(rows, "Notas");
                        
                        
                    });
                    _closeButton.onclick = () => {
                        new CloseDialog().x(_dialog);
                    };
                    /*const getFilteredNote = async(_values) =>{
                        const notes = await getEntitiesData('Note');
                        const FCustomer = notes.filter(async (data) => {
                            let userCustomer = await getEntityData('User', `${data.user.id}`);
                            userCustomer.customer.id === `${currentUserInfo.customer.id}`
                        });
                        //console.log(`_values.start.value ${_values.start.value}`)
                            const Fdesde = FCustomer.filter((data) => {
                            let noteCreationDateAndTime = data.creationDate.split('T');
                            let noteCreationDate = noteCreationDateAndTime[0];
                            //console.log(`noteCreationDate ${noteCreationDate}`)
                            noteCreationDate >= _values.start.value
                        });/*
                        console.log(`Fdesde ${Fdesde}`)
                        const Fhasta = Fdesde.filter((data) => {
                            let noteCreationDateAndTime = data.creationDate.split('T');
                            let noteCreationDate = noteCreationDateAndTime[0];
                            noteCreationDate <= `${_values.end.value}`
                        });
                        //console.log(Fdesde)
                        return FCustomer;
                    }*/
                        
                    
                });
        };
        this.close = () => {
            const closeButton = document.getElementById('close');
            const editor = document.getElementById('entity-editor-container');
            closeButton.addEventListener('click', () => {
                new CloseDialog().x(editor);
            }, false);
        }
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
                new Notes().load(tableBody, page, items);
            });
            return button;
        }
    };
    
}
