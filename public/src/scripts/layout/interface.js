//
//  interface.ts
//
//  Generated by Poll Castillo on 15/02/2023.
//
import { getEntityData, getUserInfo } from "../endpoints.js";
import { SelectCustomer } from "./selectCustomer/selectCustomer.js";
import { SignIn } from "../login.js";
import { Sidebar } from "./sidebar.js";
import { CloseDialog } from "../tools.js";
export class RenderApplicationUI {
    constructor() {
        this.loginContainer = document.getElementById('login-container');
        this.APP = document.getElementById('app');
        this.sidebarContainer = document.getElementById('app-sidebar');
        this.topbar = document.getElementById('app-topbar');
    }
    render() {
      this.loginContainer.style.display = 'none';
      this.APP.style.display = 'grid';
      this.sidebarContainer.style.display = 'inline-flex';
      this.topbar.style.display = 'flex';
      this.renderTopbar();
      new Sidebar().render();
      new SelectCustomer().render();
  }
  async renderTopbar() {
    const customerId = localStorage.getItem('customer_id')
    const currentUser = await getUserInfo();
    const user = await getEntityData('User', currentUser.attributes.id);
    let customer = await getEntityData('Customer', customerId);
    let topbar = this.topbar.innerHTML = `
        <div class="user">
            <span class="welcome">Bienvenido</span>
            <span class="separator"></span>
            <div class="userAvatar">
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="nameAndCustomer">
                <p id="current-username" class="name">
                ${user.firstName} ${user.lastName}
                </p>
                <p id="current-user-customer" class="customer">${user.username}</p>
                <p >${customer.name ? customer.name : 'Seleccione una empresa'}</p>
            </div>
           <div class="settings_button">
             <button id="settings-button">
               <i class="fa-solid fa-gear"></i>
             </button>
           </div>
           <div class="user_settings" id="user-settings">
             <button class="btn btn_transparent btn_widder" id="change-customer">Cambiar Empresa</button>
             <button class="btn btn_transparent btn_widder">Preferencias</button>
             <button class="btn btn_transparent btn_widder">Cambiar Contraseña</button>
             <br>
             <button class="btn btn_primary btn_widder" id="logout-button">Cerrar sesión</button>
           </div>
         </div>
    `;
    this.topbar.innerHTML = topbar;
    const options = document.getElementById('settings-button');
    options.addEventListener('click', () => {
        const settingOptions = document.getElementById('user-settings');
        const changeCustomer = document.getElementById('change-customer');
        const logoutButton = document.getElementById('logout-button');
        settingOptions.classList.toggle("user_settings_visible");
        changeCustomer.addEventListener("click", () => {
            new SelectCustomer().render();
            //new CloseDialog().x(settingOptions);
        });
        logoutButton.addEventListener("click", () => {
            new SignIn().signOut();
        });
    });
}
}
const renderSetting = () => {
    const options = document.getElementById('settings-button');
    options.addEventListener('click', () => {
        const settingOptions = document.querySelector("#user-settings");
        const logoutButton = settingOptions.querySelector("#logout");
        settingOptions.classList.toggle("user_settings_visible");
        logoutButton.addEventListener("click", () => {
            new SignIn().signOut();
        });
    });
};
//new Dashboard().render();
