import { getEntitiesData, getUserInfo } from "./endpoints.js";
//
export const inputObserver = () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener("keyup", (e) => {
            if (input.value == "" || input.value == " ")
                input.classList.remove('input_filled'),
                    input.value = "";
            else
                input.classList.add('input_filled');
        });
    });
};
export const inputSelect = async (entity, selectId, currentStatus) => {
    const data = await getEntitiesData(entity);
    const state = await currentStatus;
    const select = document.querySelector(`#${selectId}`);
    const inputParent = select.parentNode;
    const optionsContent = inputParent.querySelector('#input-options');
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('input_options_container');
    optionsContent.appendChild(optionsContainer);
    for (let i = 0; i < data.length; i++) {
        const inputOption = document.createElement('div');
        select.setAttribute('data-optionid', data[0].id);
        select.setAttribute('value', data[0].name);
        inputOption.classList.add('input_option');
        inputOption.setAttribute('id', data[i].id);
        let nameData = data[i].name;
        if (nameData === 'Enabled') {
            nameData = 'Activo';
        }
        else if (nameData === 'Disabled') {
            nameData = 'Inactivo';
        }
        inputOption.innerHTML = nameData;
        optionsContainer.appendChild(inputOption);
    }
    const options = optionsContainer.querySelectorAll('.input_option');
    if (state === "Enabled") {
        select.value = "Activo";
        select.setAttribute('data-optionid', '60885987-1b61-4247-94c7-dff348347f93');
    }
    else if (state === 'Disabled') {
        select.value = "Inactivo";
        select.setAttribute('data-optionid', '225b5e5d-9bb1-469a-b2d9-ca85d53db47b');
    }
    else {
        select.value = data[0].name;
    }
    select.addEventListener('click', () => {
        inputParent.classList.toggle('select_active');
    });
    options.forEach((option) => {
        option.addEventListener('click', () => {
            select.value = option.innerText;
            select.removeAttribute('data-optionid');
            select.setAttribute('data-optionid', option.getAttribute('id'));
            inputParent.classList.remove('select_active');
        });
    });
};
export class FixStatusElement {
    fix(element) {
        const elementTextValue = element.innerText;
        if (elementTextValue === "Enabled")
            elementTextValue.innerText = 'Activo',
                elementTextValue.toUpperCase();
        else
            elementTextValue.toUpperCase();
    }
}
export class FixStatusInputElement {
    fix(inputId) {
        const inputs = document.querySelectorAll(`#${inputId}`);
        inputs.forEach((input) => {
            if (input.value === 'Enabled')
                input.value = 'Activo'.toUpperCase();
            else if (input.value == 'Disabled')
                input.value = 'Inactivo'.toUpperCase();
        });
    }
}
export const drawTagsIntoTables = () => {
    const tags = document.querySelectorAll('.tag span');
    tags.forEach((tag) => {
        let text = tag.innerText;
        if (text === "Enabled" ||
            text === "enabled" ||
            text === "ENABLED" ||
            text === "Activo" ||
            text === "ACTIVO") {
            tag.innerText = "Activo";
            tag.classList.add("tag_green");
        }
        else if (text === "Disabled" ||
            text === "disabled" ||
            text === "DISABLED" ||
            text === "Inactivo" ||
            text === "INACTIVO") {
            tag.innerText = "Inactivo";
            tag.classList.add("tag_gray");
        }
        else if (text === "Pendiente" ||
            text === "pendiente" ||
            text === "PENDIENTE") {
            tag.classList.add("tag_yellow");
        }
        else {
            tag.classList.add('tag_gray');
        }
    });
};
export class CloseDialog {
    x(container) {
        container.style.display = 'none';
        // const dialog: InterfaceElement = container.firstElementChild
        // dialog.remove()
    }
}
// SIDEBAR RENDERING TOOLS
export const renderRightSidebar = (UIFragment) => {
    const dialogContainer = document.getElementById('entity-editor-container');
    dialogContainer.innerHTML = '';
    dialogContainer.style.display = 'flex';
    dialogContainer.innerHTML = UIFragment;
};
export const fixDate = () => {
    const arrayDates = document.querySelectorAll('#table-date');
    arrayDates.forEach((date) => {
        const dateP1 = date.innerText.split('-');
        const dateP2 = dateP1[2].split('T');
        const dateP3 = dateP2[1].split(':');
        const YearDate = dateP1[0];
        const MonthDate = dateP1[1];
        const DayDate = dateP2[0];
        const Hours = dateP3[0];
        const Minutes = dateP3[1];
        const Seconds = dateP3[2];
        const DT = YearDate + ' ' + MonthDate + ' ' + DayDate;
        const Time = Hours + ':' + Minutes + ':' + Seconds.slice(0, 2);
        date.innerText = DT + ' ' + Time;
    });
};
export class filterDataByHeaderType {
    constructor() {
        this.datatable = document.getElementById('datatable');
        this.filter = () => {
            this.datatable.onclick = (e) => {
                if (e.target.tagName != "SPAN")
                    return;
                let span = e.target;
                let th = e.target.parentNode;
                const THead = this.datatable.querySelectorAll('tr th span');
                THead.forEach((header) => {
                    header.classList.remove('datatable_header_selected');
                });
                e.target.classList.add('datatable_header_selected');
                this.sortGrid(th.cellIndex, span.dataset.type);
            };
        };
        this.sortGrid = (colNum, type) => {
            let tbody = this.datatable.querySelector('tbody');
            let rowsArray = Array.from(tbody.rows);
            let compare;
            switch (type) {
                case 'name':
                    compare = (rowA, rowB) => {
                        return rowA.cells[colNum].innerHTML >
                            rowB.cells[colNum].innerHTML ? 1 : -1;
                    };
                    break;
                case 'id':
                    compare = (rowA, rowB) => {
                        return rowA.cells[colNum].innerHTML >
                            rowB.cells[colNum].innerHTML ? 1 : -1;
                    };
                    break;
                case 'status':
                    compare = (rowA, rowB) => {
                        return rowA.cells[colNum].innerHTML >
                            rowB.cells[colNum].innerHTML ? 1 : -1;
                    };
                    break;
                case 'citadel':
                    compare = (rowA, rowB) => {
                        return rowA.cells[colNum].innerHTML >
                            rowB.cells[colNum].innerHTML ? 1 : -1;
                    };
                    break;
            }
            rowsArray.sort(compare);
            tbody.append(...rowsArray);
        };
    }
}
export const userInfo = getUserInfo();
