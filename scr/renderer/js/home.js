//---------------------------------------------------------------------//
//--------------------------- ( Variables ) ---------------------------//
//---------------------------------------------------------------------//
const fragment = document.createDocumentFragment();
const templateAuthClient = document.getElementById('template-auth-client').content;
const authClientsField = document.getElementById('auth-clients-field');
const ipContainer = document.getElementById('ip-container');
const uthAddButton = document.getElementById('auth-add-button');
const runServerButton = document.getElementById('run-broker-button');
const inputServerIp = document.getElementById('input-broker-ip');
const inputServerPort = document.getElementById('input-broker-port');
const inputAthOption = document.getElementById('input-auth-option');
let clientsAuth = {}
let ipPort = { "ip": "127.0.0.1", "port": "1883" }


//---------------------------------------------------------------------//
//--------------------------- ( Listeners ) ---------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', _ => {
   fetch_data();
   show_welcome_message();
})


//---------------------------------------------------------------------//
//--------------------------- ( Functions ) ---------------------------//
//---------------------------------------------------------------------//


// (FUN) Show welcome message every time that the renderer starts.
const show_welcome_message = _ => {
   setTimeout(() => {
      document.getElementById('welcome-gif').remove();
      document.getElementById('welcome-text').remove();
      document.getElementById('window').classList.remove('invisible');
      document.getElementById('input-broker-ip').focus();
   }, 1500);
}

// (FUN) Read database, then start the aplication logic.
const fetch_data = async () => {
   try {
      const res = await fetch('../../data/clients.json');
      const clients = await res.json();
      set_clientsAuth_object(clients);
      home();
      // console.log(data);
   } catch (error) {
      console.log(error);
   }
}

// (FUN) Save the clients, found in the database, in the clientsAuth object. If
// the database has no clients, a client with empty data is created in clientsAuth.
const set_clientsAuth_object = clients => {
   if (clients.length === 0) {
      clientsAuth[1] = {
         id: 1,
         user: '',
         password: '',
      }
   }
   else {
      clients.forEach(client => {
         clientsAuth[client.id] = {
            id: client.id,
            user: client.user,
            password: client.password,
         }
      })
   }

}

// (FUN) Log application listening events.
const home = _ => {
   ipContainer.addEventListener('click', (event) => {
      // console.log(event.target);
      if (event.target.classList.contains('form-check-input')) {
         document.getElementById('auth-text').classList.toggle('no-show');
         document.getElementById('auth-add-button').classList.toggle('no-show');
         // console.log(event.target.checked);
         if (event.target.checked) {
            draw_authClientsField()
         } else {
            erase_authClientsField()
         }

      }

      event.stopPropagation();
   })

   authClientsField.addEventListener('click', event => {
      // console.log(event.target);
      try {
         // console.log(event.target.dataset.id.split('-')[0]);
         const key_word = event.target.dataset.id.split('-')[0]
         const id = event.target.dataset.id.split('-')[1]
         switch (key_word) {
            case 'erase':
               delete_client(id);
               break;
            case 'showpass':
               show_password(id);
               break;
         }
      } catch (error) {
         // console.log(error);
      }

      event.stopPropagation();
   })

   uthAddButton.onclick = _ => {
      add_new_client();
   }


   runServerButton.onclick = _ => {
      validate_input_data();
   }

   inputServerPort.onkeydown = (event) => {
      // console.log(event);
      if (event.key === 'E' || event.key === 'e' || event.key === '.' || event.key === '+' || event.key === '-') {
         // console.log(event.key);
         return false 
      }
   }

}

// (FUN) Fills templateAuthClient with clients found in clientAuth object. 
// Then Draws authClientsField with nodes in template templateAuthClient. 
// If clientsAuth object only has 1 client with empty user, it focuses on 
// user input.
const draw_authClientsField = () => {
   authClientsField.innerHTML = ''
   Object.values(clientsAuth).forEach(client => {
      // console.log(client);
      templateAuthClient.querySelector('.row').dataset.id = client.id;
      templateAuthClient.querySelector('.col-1').textContent = client.id;
      templateAuthClient.querySelectorAll('.input-data input')[0].value = client.user;
      templateAuthClient.querySelectorAll('.input-data input')[0].dataset.id = `user-${client.id}`;
      templateAuthClient.querySelectorAll('.input-data input')[1].value = client.password;
      templateAuthClient.querySelectorAll('.input-data input')[1].dataset.id = `pass-${client.id}`;
      templateAuthClient.querySelector('.text-danger i').dataset.id = `erase-${client.id}`;
      templateAuthClient.querySelector('.float-end i').dataset.id = `showpass-${client.id}`;
      const clone = templateAuthClient.cloneNode(true);
      fragment.appendChild(clone);
   })

   authClientsField.appendChild(fragment);
   if (Object.values(clientsAuth).length === 1 && authClientsField.querySelector('input').value === '') {
      authClientsField.querySelector('input').focus();
   }

}

// (FUN) Delete the clients from the DOM.
const erase_authClientsField = _ => {
   save_input_client_data();
   authClientsField.innerHTML = ''
}

// (FUN) Saves the data, which exists in the clients' inputs, in the clients object.
const save_input_client_data = () => {
   // console.log(authClientsField.querySelector(`[data-id="pass-1"]`))
   try {
      Object.values(clientsAuth).forEach(client => {
         const userValue = authClientsField.querySelector(`[data-id="user-${client.id}"]`).value
         const passValue = authClientsField.querySelector(`[data-id="pass-${client.id}"]`).value
         clientsAuth[client.id].user = userValue;
         clientsAuth[client.id].password = passValue;
      })
   } catch (error) {
      // console.log(error);
   }
}

// (FUN) Allows to see the passwords based on the id of the html dataset attribute.
const show_password = (id) => {
   // console.log(authClientsField.querySelector(`[data-id="pass-${id}"]`));
   authClientsField.querySelector(`[data-id="showpass-${id}"]`).classList.toggle('fa-eye')
   authClientsField.querySelector(`[data-id="showpass-${id}"]`).classList.toggle('fa-eye-slash')

   if (authClientsField.querySelector(`[data-id="pass-${id}"]`).type === 'password') {
      authClientsField.querySelector(`[data-id="pass-${id}"]`).type = 'text';
   } else {
      authClientsField.querySelector(`[data-id="pass-${id}"]`).type = 'password';
   }
}

// (FUN) Remove the client from the clientsAuth object that has the id.
const delete_client = (id) => {
   save_input_client_data();

   const lastClientId = Object.values(clientsAuth).length;
   for (let i = parseInt(id); i <= lastClientId; i++) {
      console.log(i);
      if(i < lastClientId)
      {
         clientsAuth[i+1]["id"] = clientsAuth[i+1]["id"] - 1;
         clientsAuth[i] = {...clientsAuth[i+1]}

      }
      else
      {
         delete clientsAuth[i]
      }
   }

   draw_authClientsField();
   // console.log(clientsAuth);
}

// (FUN) Add a client, with empty data, in the clientsAuth object.
const add_new_client = _ => {
   const new_id = Object.values(clientsAuth).length + 1;
   const client = {
      id: new_id,
      user: '',
      password: '',
   }
   clientsAuth[new_id] = { ...client }
   draw_authClientsField();
   // console.log(new_id);
   // console.log(clientsAuth);
}


// (FUN) Manages the validation of data in each input of the page.
const validate_input_data = _ => {
   // console.log(inputServerIp.value)
   // console.log(inputServerPort.value)
   // console.log(inputAthOption.checked)
  save_input_client_data();
   if (validate_ip_port(inputServerIp, inputServerPort)) {
      if (inputAthOption.checked) {
         if (validate_clients_inputs()) {
            const dataToSend = { ...ipPort, ...clientsAuth, ...{ mode: 'auth' } }
            go_to_broker(dataToSend);
         };
      }
      else {
         const dataToSend = { ...ipPort, ...{ mode: 'free' } }
         go_to_broker(dataToSend);
      }
   }

}

// (FUN) validates the ip and port.
const validate_ip_port = (ip = '', port = '') => {
   const errors = [];
   if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip.value) && ip_start_by_zero(ip.value)) {
      // console.log('IP Ok');
   } else {
      // console.log('IP Wrong');
      errors.push(['IP Incorrecta', `El valor ingresado de '${ip.value}' no cumple con el estandar TCP/IP`])
   }

   if (parseInt(port.value) >= 1024 && parseInt(port.value) <= 49151  ) {
      // console.log('PORT Ok');
   } else {
      // console.log('PORT Wrong');
      errors.push(['PUERTO Incorrecto', `El valor ingresado de '${port.value}' debe encontrarse entre 1024 y 49151`])
   }
   // console.log(errors);
   if (errors.length > 0) {
      show_alert(errors, type = 'errors') // show_alert Function Created in the renderer_style.js
      return false
   } else {
      ipPort.ip = ip.value
      ipPort.port = port.value
      return true
   }
}


const ip_start_by_zero = (ip) => {
   // console.log(ip.split("."));
   for(let value of ip.split("."))
   {
      // console.log(value);
      if (value[0]==='0' && value.length > 1)
      {
         return false
      }
   }
   return true
}

// (FUN) Validates if the user client is empty.
const validate_clients_inputs = _ => {
   const errors = []
   // console.log(clientsAuth);
   // console.log('Validar entradas de clientes');
   for(let client of  Object.values(clientsAuth)){
      if (client.user === '') {
         // console.log('Usuario vacio');
         errors.push(['USUARIO Incorrecto', `El usuario del cliente número ${client.id} esta vacio`])
         show_alert(errors, type = 'errors') // show_alert Function Created in the renderer_style.js
         return false;
      }
   }
   return true;
}

// (FUN) Sends data to the main to start the Broker.
const go_to_broker = (dataToSend) => {
   // console.log('go_to_broker:', dataToSend);
   ipcRenderer.send('ready-to-server', dataToSend) // ipcRenderer Added in the renderer_style.js
   show_alert([["Broker iniciado!", "Los datos enviados se muestran en la consola"]], type = 'info', titles=["Dispositivo", 'Observaciones']) // show_alert Function Created in the renderer_style.js
}




