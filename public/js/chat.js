const socket = io();

// Elements
const $messageForm = document.getElementById('message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');

// Template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})
socket.on('message',(message)=>{
  console.log(message);

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    date: message.createdAt
  });
  $messages.insertAdjacentHTML('beforeend', html)

})

socket.on('roomData', ({ room, users})=>{
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
   document.getElementById('sidebar').innerHTML = html;
})

$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  // set disable button while message is sending
  $messageFormButton.setAttribute('disabled','disabled')

  const message = e.target.elements.message.value;
  socket.emit('sendMessage',message, (cbMsg)=>{
    console.log(cbMsg);
  })
  
  // remove disable button when message is sended
  $messageFormButton.removeAttribute('disabled')
  $messageFormInput.value = "";
  $messageFormInput.focus();
  
})



socket.emit('join', { username, room}, (error)=>{
  alert(error)
})