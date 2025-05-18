document.addEventListener('DOMContentLoaded', () => {
    const notificationsContainer = document.getElementById('notifications');
    const chatMessagesContainer = document.getElementById('chatMessages');
    const chatInputField = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const usernameElement = document.getElementById('username');
    const changeNameBtn = document.getElementById('changeNameBtn');
    const changeNameModal = document.getElementById('changeNameModal');
    const changeNameForm = document.getElementById('changeNameForm');
    const newUsernameInput = document.getElementById('newUsername');
    const closeModalBtn = document.querySelector('.close');

    const newMovieBtn = document.getElementById('newMovieBtn');
    const updateScheduleBtn = document.getElementById('updateScheduleBtn');
    const deleteMovieBtn = document.getElementById('deleteMovieBtn');
    const actionFormContainer = document.getElementById('actionFormContainer');

    const newMovieFormTemplate = document.getElementById('newMovieFormTemplate');
    const updateScheduleFormTemplate = document.getElementById('updateScheduleFormTemplate');
    const deleteMovieFormTemplate = document.getElementById('deleteMovieFormTemplate');

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.hostname}:${window.location.port}`;
    const socket = new WebSocket(wsUrl);

    let clientId = null;
    let clientName = 'Admin';

    socket.onopen = (event) => {
        console.log('Підключено до WebSocket сервера');
        addNotification({
            type: 'notification',
            message: 'Підключено до системи',
            timestamp: new Date().toISOString()
        });
    };

    socket.onclose = (event) => {
        console.log('Відключено від WebSocket сервера');
        if (!event.wasClean) {
            addNotification({
                type: 'notification',
                message: 'З\'єднання втрачено. Спробуйте оновити сторінку',
                timestamp: new Date().toISOString()
            });
        }
    };

    socket.onerror = (error) => {
        console.error('Помилка WebSocket:', error);
        addNotification({
            type: 'notification',
            message: 'Помилка з\'єднання',
            timestamp: new Date().toISOString()
        });
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Отримано дані:', data);

            switch (data.type) {
                case 'connection':
                    clientId = data.id;
                    clientName = data.name;
                    usernameElement.textContent = clientName;
                    break;

                case 'history':
                    if (data.chatHistory && data.chatHistory.length > 0) {
                        data.chatHistory.forEach(message => addChatMessage(message));
                    }
                    if (data.notifications && data.notifications.length > 0) {
                        data.notifications.forEach(notification => addNotification(notification));
                    }
                    break;

                case 'notification':
                    addNotification(data);
                    break;

                case 'chat':
                    addChatMessage(data);
                    break;

                default:
                    console.log('Невідомий тип повідомлення:', data.type);
            }
        } catch (error) {
            console.error('Помилка обробки повідомлення:', error);
        }
    };

    function addNotification(notification) {
        const notificationElement = document.createElement('div');
        let className = 'notification';

        if (notification.action) {
            switch (notification.action) {
                case 'movie_add':
                    className += ' movie-add';
                    break;
                case 'movie_delete':
                    className += ' movie-delete';
                    break;
                case 'schedule_update':
                    className += ' schedule-update';
                    break;
            }
        }

        notificationElement.className = className;

        const timestamp = new Date(notification.timestamp).toLocaleTimeString();

        notificationElement.innerHTML = `
            <div class="notification-content">${notification.message}</div>
            <div class="notification-time">${timestamp}</div>
        `;

        notificationsContainer.prepend(notificationElement);

        if (notificationsContainer.children.length > 20) {
            notificationsContainer.removeChild(notificationsContainer.lastChild);
        }
    }

    function addChatMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';

        const timestamp = new Date(message.timestamp).toLocaleTimeString();

        messageElement.innerHTML = `
            <div class="message-sender">${message.sender}:</div>
            <div class="message-content">${message.message}</div>
            <div class="message-time">${timestamp}</div>
        `;

        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function sendWebSocketMessage(data) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket не підключено');
            addNotification({
                type: 'notification',
                message: 'Не вдалося надіслати повідомлення: відсутнє з\'єднання',
                timestamp: new Date().toISOString()
            });
        }
    }

    sendMessageBtn.addEventListener('click', sendChatMessage);

    chatInputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendChatMessage();
        }
    });

    function sendChatMessage() {
        const message = chatInputField.value.trim();
        if (message) {
            sendWebSocketMessage({
                type: 'chat',
                message: message
            });
            chatInputField.value = '';
        }
    }

    changeNameBtn.addEventListener('click', () => {
        changeNameModal.style.display = 'block';
        newUsernameInput.value = clientName;
        newUsernameInput.focus();
    });

    closeModalBtn.addEventListener('click', () => {
        changeNameModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === changeNameModal) {
            changeNameModal.style.display = 'none';
        }
    });

    changeNameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newName = newUsernameInput.value.trim();
        if (newName && newName !== clientName) {
            sendWebSocketMessage({
                type: 'name_change',
                name: newName
            });
            usernameElement.textContent = newName;
            clientName = newName;
        }
        changeNameModal.style.display = 'none';
    });

    newMovieBtn.addEventListener('click', () => {
        showForm(newMovieFormTemplate);
    });

    updateScheduleBtn.addEventListener('click', () => {
        showForm(updateScheduleFormTemplate);
    });

    deleteMovieBtn.addEventListener('click', () => {
        showForm(deleteMovieFormTemplate);
    });

    function showForm(template) {
        actionFormContainer.innerHTML = '';

        const form = document.importNode(template.content, true);
        actionFormContainer.appendChild(form);

        const activeForm = actionFormContainer.querySelector('form');
        activeForm.classList.add('active');

        const cancelBtn = activeForm.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            activeForm.classList.remove('active');
            setTimeout(() => {
                actionFormContainer.innerHTML = '';
            }, 300);
        });

        activeForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (activeForm.id === 'newMovieForm') {
                handleNewMovie(activeForm);
            } else if (activeForm.id === 'updateScheduleForm') {
                handleScheduleUpdate(activeForm);
            } else if (activeForm.id === 'deleteMovieForm') {
                handleDeleteMovie(activeForm);
            }

            activeForm.classList.remove('active');
            setTimeout(() => {
                actionFormContainer.innerHTML = '';
            }, 300);
        });
    }

    function handleNewMovie(form) {
        const title = form.querySelector('#movieTitle').value.trim();
        const duration = form.querySelector('#movieDuration').value;
        const genre = form.querySelector('#movieGenre').value.trim();
        const description = form.querySelector('#movieDescription').value.trim();

        const movie = {
            id: Date.now(), // Унікальний ID для демонстрації
            title,
            duration,
            genre,
            description
        };

        fetch('/api/movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Відповідь сервера:', data);
        })
        .catch(error => {
            console.error('Помилка:', error);
            sendWebSocketMessage({
                type: 'movie_add',
                movie: movie
            });
        });
    }

    function handleScheduleUpdate(form) {
        const movieId = form.querySelector('#scheduleMovie').value;
        const movieTitle = form.querySelector('#scheduleMovie').options[form.querySelector('#scheduleMovie').selectedIndex].text;
        const date = form.querySelector('#scheduleDate').value;
        const time = form.querySelector('#scheduleTime').value;
        const hall = form.querySelector('#scheduleHall').value;

        const scheduleUpdate = {
            id: Date.now(),
            movieId,
            movieTitle,
            date,
            time,
            hall,
            message: `${movieTitle} - ${date} ${time}, Зал ${hall}`
        };

        fetch('/api/schedule', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleUpdate)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Відповідь сервера:', data);
        })
        .catch(error => {
            console.error('Помилка:', error);
            sendWebSocketMessage({
                type: 'schedule_update',
                message: scheduleUpdate.message,
                details: scheduleUpdate
            });
        });
    }

    function handleDeleteMovie(form) {
        const movieId = form.querySelector('#deleteMovieSelect').value;
        const movieTitle = form.querySelector('#deleteMovieSelect').options[form.querySelector('#deleteMovieSelect').selectedIndex].text;

        fetch(`/api/movie/${movieId}?title=${encodeURIComponent(movieTitle)}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Відповідь сервера:', data);
        })
        .catch(error => {
            console.error('Помилка:', error);
            sendWebSocketMessage({
                type: 'movie_delete',
                movie: {
                    id: movieId,
                    title: movieTitle
                }
            });
        });
    }
});
