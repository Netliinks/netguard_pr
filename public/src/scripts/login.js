//
//  login.ts
//
//  Generated by Poll Castillo on 15/02/2023.
//
import { getUserInfo, _userAgent, getEntityData, getEntitiesData, updateEntity, getFilterEntityData } from "./endpoints.js";
import { RenderApplicationUI } from "./layout/interface.js";
import { registryPlataform } from "./tools.js";
const loginContainer = document.getElementById('login-container');
const app = document.getElementById('app');
const connectionHeader = {
    Accept: "application/json",
    "User-agent": _userAgent,
    Authorization: "Basic YzNjMDM1MzQ2MjoyZmM5ZjFiZTVkN2IwZDE4ZjI1YmU2NDJiM2FmMWU1Yg==",
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: "JSESSIONID=CDD208A868EAABD1F523BB6F3C8946AF",
};
const platformSystem = 'guards';
const reqOP = {
    url: 'http://localhost:8080/oauth/token',
    method: 'POST'
};
export class SignIn {
    async checkSignIn() {
        const accessToken = localStorage.getItem('access_token');
        const checkUser = async () => {
            let currentUser = await getUserInfo();
            const customerId = localStorage.getItem('customer_id')
            if (currentUser.error === 'invalid_token') {
                this.signOut();
            }
            if(currentUser.username === "consulta"){
                const email = localStorage.getItem('email');
                const password = localStorage.getItem('password');
                /*const users = await getEntitiesData('User');
                const type = users.filter((data) => `${data.userType}`.includes('GUARD'));
                const FSuper = type.filter((data) => data.isSuper === true);
                const data = FSuper.filter((data) => `${data.email}`.includes(`${email}`));*/
                let raw = JSON.stringify({
                    "filter": {
                        "conditions": [
                          {
                            "property": "email",
                            "operator": "=",
                            "value": `${email}`
                          },
                          {
                            "property": "state.name",
                            "operator": "=",
                            "value": `Enabled`
                          },
                          {
                            "property": "business.state.name",
                            "operator": "=",
                            "value": `Enabled`
                          },
                        ]
                    }
                });
                let user = await getFilterEntityData("User", raw);
                const reqOptions = {
                    method: reqOP.method,
                    body: `grant_type=password&username=${user[0]?.username}&password=${password}`,
                    headers: connectionHeader
                };
                fetch(reqOP.url, reqOptions)
                    .then((res) => res.json())
                    .then(async(res) => {
                    if (res.error == 'Bad credentials') {
                        console.error('error en las credenciales');
                    }
                    else {
                        const connectionData = {
                            token: res.access_token,
                            expiresIn: res.expires_in,
                            refreshToken: res.refresh_token,
                            scope: res.scope,
                            tokenType: res.token_type
                        };
                        await registryPlataform(user[0].id);
                        localStorage.removeItem('email');
                        localStorage.removeItem('password');
                        localStorage.removeItem('access_token');
                        localStorage.setItem('access_token', connectionData.token);
                        window.location.reload();  
                    }
                }).catch((e) => {
                    console.log(e);
                    this.signOut();
                });
            }else{
                if(customerId == null){
                    let user = await getEntityData('User', currentUser.attributes.id);
                    if(user.customer?.id != null || user.customer?.id != undefined){
                        localStorage.setItem('customer_id', user.customer?.id);
                        window.location.reload();
                    }else{
                        this.signOut();
                        alert('Usuario no tiene asignado empresa.');
                    }    
                }
                if (currentUser.attributes.isSuper !== true) {
                    this.signOut();
                    alert('Usuario no es superusuario.');
                }
                if (currentUser.attributes.userType !== 'GUARD') {
                    this.signOut();
                    alert('Usuario no es tipo guardia.');
                }
                if (currentUser.attributes.verifiedSuper === true) {
                    let user = await getEntityData('User', currentUser.attributes.id);
                    //let business = await getEntityData('Business', user?.business?.id);
                    let rawCustomer = JSON.stringify({
                        "filter": {
                            "conditions": [
                              {
                                "property": "id",
                                "operator": "=",
                                "value": `${customerId}`
                              },
                              {
                                "property": "business.id",
                                "operator": "=",
                                "value": `${user?.business?.id}`
                              },
                              {
                                "property": "business.state.name",
                                "operator": "=",
                                "value": `Enabled`
                              },
                            ]
                        }
                    });
                    let customer = await getFilterEntityData("Customer", rawCustomer);
                    if(user?.state?.name == 'Enabled' && customer.length != 0){
                        new RenderApplicationUI().render();
                    }else{
                        this.signOut();
                    }
                }else{
                    this.showVerified(currentUser.attributes.id, currentUser.attributes?.hashSuper);
                }
            }
            
        };
        if (accessToken) {
            checkUser();
        }
        else{
            this.showLogin();
            console.info('You need login');
        }
    }
    showLogin() {
        loginContainer.style.display = 'flex !important';
        loginContainer.innerHTML = `
        <div class="login_window">
        <div class="login_header">
          <img src="./public/src/assets/pictures/app_logo.png">
          <h1 class="login_title">Iniciar Sesión</h1>
          <p>Inicie sesión con los datos proporcionados por el proveedor.</p>
        </div>
        <div class="login_content">
          <form id="login-form">
            <div class="input">
              <label for="username">
                <i class="fa-regular fa-user"></i>
              </label>
              <input type="text" id="username"
                placeholder="johndoe@mail.com">
            </div>

            <div class="input">
              <label for="password">
                <i class="fa-regular fa-key"></i>
              </label>
              <input type="password" id="password"
                placeholder="••••••••••••">
            </div>
            <button class="btn btn_primary" id="login">Iniciar Sesión</button>
          </form>
        </div>

        <div class="login_footer">
          <div class="login_icons">
            <i class="fa-regular fa-house"></i>
            <i class="fa-regular fa-user"></i>
            <i class="fa-regular fa-inbox"></i>
            <i class="fa-regular fa-file"></i>
            <i class="fa-regular fa-computer"></i>
            <i class="fa-regular fa-mobile"></i>
          </div>
          <p>Accede a todas nuestras herramientas</p>

          <div class="foot_brief">
            <p>Desarrollado por</p>
            <img src="./public/src/assets/pictures/login_logo.png">
          </div>
        </div>
      </div>
        `;
        this.signIn();
    }
    signIn() {
        const form = document.querySelector('#login-form');
        const password = form.querySelector('#password');
        const userName = form.querySelector('#username');
        const trigger = form.querySelector('#login');
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (userName.value.trim() == '' || userName.value.trim() == null) {
                console.error('El campo nombre de usuario no puede estar vacío.');
                alert('El campo nombre de usuario no puede estar vacío.');
            }
            else if (password.value.trim() == '' || password.value.trim() == null) {
                console.log('El campo contraseña no puede estar vacío.');
                alert('El campo contraseña no puede estar vacío.');
            }
            else {
                connect(userName.value, password.value);
            }
        });
        async function connect(user, password) {
            const reqOptions = {
                method: reqOP.method,
                body: `grant_type=password&username=consulta&password=consulta`,
                headers: connectionHeader
            };
            fetch(reqOP.url, reqOptions)
                .then((res) => res.json())
                .then(async(res) => {
                if (res.error == 'Bad credentials') {
                    console.error('error en las credenciales');
                }
                else {
                    const connectionData = {
                        token: res.access_token,
                        expiresIn: res.expires_in,
                        refreshToken: res.refresh_token,
                        scope: res.scope,
                        tokenType: res.token_type
                    };
                    localStorage.setItem('email', user);
                    localStorage.setItem('password', password);
                    localStorage.setItem('access_token', connectionData.token);
                    window.location.reload();
                }
            });
        }
    }
    signOut() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('customer_id');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        this.checkSignIn();
        window.location.reload();
    }
    showVerified(id, hash) {
        loginContainer.style.display = 'flex !important';
        loginContainer.innerHTML = `
        <div class="login_window">
        <div class="login_header">
          <img src="./public/src/assets/pictures/app_logo.png">
          <h1 class="login_title">Verificación de usuario</h1>
          <p>Ingrese el código de verificación enviado al correo.</p>
        </div>
        <div class="login_content">
          <form id="login-form">

            <div class="input">
              <label for="password">
                <i class="fa-regular fa-key"></i>
              </label>
              <input type="password" id="password"
                placeholder="••••••••••••">
            </div>
            <button class="btn btn_close_editor" id="cancel"><i class="fa-regular fa-x"></i></button>
            <button class="btn btn_primary" id="login">Verificar</button>
          </form>
        </div>

        <div class="login_footer">
          <div class="login_icons">
            <i class="fa-regular fa-house"></i>
            <i class="fa-regular fa-user"></i>
            <i class="fa-regular fa-inbox"></i>
            <i class="fa-regular fa-file"></i>
            <i class="fa-regular fa-computer"></i>
            <i class="fa-regular fa-mobile"></i>
          </div>
          <p>Accede a todas nuestras herramientas</p>

          <div class="foot_brief">
            <p>Desarrollado por</p>
            <img src="./public/src/assets/pictures/login_logo.png">
          </div>
        </div>
      </div>
        `;
        this.verified(id, hash);
    }
    verified(id, hash){
        const form = document.querySelector('#login-form');
        const password = form.querySelector('#password');
        const btnCancel = form.querySelector('#cancel');
        const btnVerify = form.querySelector('#login');
        btnVerify.addEventListener('click', async(e) => {
            e.preventDefault();
            if (password.value.trim() == '' || password.value.trim() == null) {
                console.log('El campo clave no puede estar vacío.');
                alert('El campo clave no puede estar vacío.');
            }
            else {
                if(`${hash}` === `${password.value}`){
                    let updateRaw = JSON.stringify({
                        "verifiedSuper": true
                    });
                    await updateEntity('User', id, updateRaw)
                    .then((res) => {
                        setTimeout(async () => {
                            new RenderApplicationUI().render();
                        }, 100);
                    });
                }else{
                    alert('Código de verificación incorrecto.');
                    this.signOut();
                }
            }
        });
        btnCancel.addEventListener('click', (e) => {
            e.preventDefault();
            this.signOut();
        });
    }
}