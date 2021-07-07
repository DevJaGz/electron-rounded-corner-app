//-------------------------------------------------------------------------//
//--------------------------- ( Importaciones ) ---------------------------//
//-------------------------------------------------------------------------//
const { ipcRenderer } = require('electron')

//---------------------------------------------------------------------//
//--------------------------- ( Variables ) ---------------------------//
//---------------------------------------------------------------------//
const windowBar = document.getElementById('window-bar')
const alertField = document.getElementById('alert-field')
const templateAlert = document.getElementById('template-alert').content
const templateErrorsTable = document.getElementById('template-errors-table').content
const menuField = document.getElementById('menu-field')
const infoButton = document.getElementById('info-button')
const audio = new Audio('../../assets/mp3/Jerusalema.mp3');

//---------------------------------------------------------------------//
//--------------------------- ( Listeners ) ---------------------------//
//---------------------------------------------------------------------//
windowBar.addEventListener('click', (event) => {
   // console.log(event.target);
   if (event.target.classList.contains('fa-times')) {
      // console.log('Close ventana')
      ipcRenderer.send('window-bar', 'close')
   }
   else if (event.target.classList.contains('fa-window-minimize')) {
      // console.log('Minimize venetana')
      ipcRenderer.send('window-bar', 'minimize')
   } else if (event.target.classList.contains('fa-bars')) {
      // console.log('Menú')
      show_menu();
   }

   event.stopPropagation();
})


alertField.addEventListener('click', event => {
   // console.log(event.target);
   if (event.target.classList.contains('btn-light')) {
      alertField.innerHTML = ''
      audio.pause();
   }
   event.stopPropagation();
})


infoButton.onclick = () => {
   show_alert([['Julian Gomez','Demo :)']], type='info', titles=["Autor", 'Version'])
}

//---------------------------------------------------------------------//
//--------------------------- ( Functions ) ---------------------------//
//---------------------------------------------------------------------//

// (FUN) Empty for now

const show_menu = () => {
   const style = getComputedStyle(menuField)
   // console.log('Show menu', style.left);
   if (style.left == '-200px'){
      menuField.style.left = '0';
      menuField.style.opacity = '1';
   }else{
      menuField.style.left = '-200px';
      menuField.style.opacity = '0';
   }

}


// (FUN) Shows alerts in the window
const show_alert = (content = [], type = '', titles=['', '']) => {
   const fragment = document.createDocumentFragment()
   templateAlert.querySelector('tbody').innerHTML = '' 
   templateAlert.getElementById('dance-gif').classList.add('invisible')
   alertField.innerHTML = ''

   if (type === 'errors') {
      // console.log('alert', content);
      templateAlert.querySelector('.card-header').textContent = "Advertencia";
      templateAlert.querySelector('.card-title').textContent = "Errores encontrados";
      templateAlert.querySelectorAll('tr th')[0].textContent = 'Error';
      templateAlert.querySelectorAll('tr th')[1].textContent = 'Observaciones';
   }
   else if(type === 'info')
   {
      templateAlert.querySelector('.card-header').textContent = "";
      templateAlert.querySelector('.card-title').textContent = "Información";
      templateAlert.querySelectorAll('tr th')[0].textContent = titles[0];
      templateAlert.querySelectorAll('tr th')[1].textContent = titles[1];
   }

   content.forEach(msg => {
      // console.log(templateErrorsTable.querySelectorAll('td'))
      if(msg[0].includes('Julian Gomez')){
         templateAlert.getElementById('dance-gif').classList.remove('invisible')
         audio.currentTime = 10;
         audio.play();
      }
      templateErrorsTable.querySelectorAll('td')[0].textContent = msg[0]
      templateErrorsTable.querySelectorAll('td')[1].textContent = msg[1]
      const clone = templateErrorsTable.cloneNode(true)
      fragment.appendChild(clone)
   })

   templateAlert.querySelector('tbody').appendChild(fragment)
   const clone = templateAlert.cloneNode(true)
   fragment.appendChild(clone)
   alertField.appendChild(fragment)
}