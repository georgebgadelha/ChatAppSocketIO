const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

socket.on('message', (message) => {
    console.log(message);
    const messageHTML = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML("beforeend", messageHTML);
});

socket.on('locationMessage', (message) => {
    console.log(message);
    const locationHTML = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML("beforeend", locationHTML);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported by your browser.')
    
    $sendLocationButton.setAttribute('disabled', 'disabled');
    
    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared!')
        });
    });
});