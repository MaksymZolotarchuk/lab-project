let token = null;
let userRole = null;

function showSections() {
    document.getElementById('filmsSection').style.display = 'block';
    document.getElementById('hallsSection').style.display = 'block';
    document.getElementById('schedulesSection').style.display = 'block';

    if (userRole === 'admin') {
        document.getElementById('filmForm').style.display = 'block';
        document.getElementById('hallForm').style.display = 'block';
        document.getElementById('scheduleForm').style.display = 'block';
    }
}

async function fetchFilms() {
    const response = await fetch('http://localhost:8000/api/films/', {
        headers: { Authorization: `Bearer ${token}` },
    });
    const films = await response.json();
    const filmsList = document.getElementById('filmsList');
    filmsList.innerHTML = films.map((film) => `
        <div>
            <strong>${film.title}</strong> (${film.duration} min)
            <p>${film.description}</p>
            ${userRole === 'admin' ? `<button onclick="deleteFilm(${film.id})">Delete</button>` : ''}
        </div>
    `).join('');

    if (userRole === 'admin') {
        const filmSelect = document.getElementById('scheduleFilm');
        filmSelect.innerHTML = films.map((film) => `<option value="${film.id}">${film.title}</option>`).join('');
    }
}

async function fetchHalls() {
    const response = await fetch('http://localhost:8000/api/halls/', {
        headers: { Authorization: `Bearer ${token}` },
    });
    const halls = await response.json();
    const hallsList = document.getElementById('hallsList');
    hallsList.innerHTML = halls.map((hall) => `
        <div>
            <strong>${hall.name}</strong>
            ${userRole === 'admin' ? `<button onclick="deleteHall(${hall.id})">Delete</button>` : ''}
        </div>
    `).join('');

    if (userRole === 'admin') {
        const hallSelect = document.getElementById('scheduleHall');
        hallSelect.innerHTML = halls.map((hall) => `<option value="${hall.id}">${hall.name}</option>`).join('');
    }
}

async function fetchSchedules() {
    const response = await fetch('http://localhost:8000/api/schedules/', {
        headers: { Authorization: `Bearer ${token}` },
    });
    const schedules = await response.json();
    const schedulesList = document.getElementById('schedulesList');
    schedulesList.innerHTML = schedules.map((schedule) => `
        <div>
            Film ID: ${schedule.film}, Hall ID: ${schedule.hall}, Time: ${new Date(schedule.showtime).toLocaleString()}
            ${userRole === 'admin' ? `<button onclick="deleteSchedule(${schedule.id})">Delete</button>` : ''}
        </div>
    `).join('');
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');

    try {
        const response = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            token = data.access;
            userRole = data.user.role;
            document.getElementById('loginSection').style.display = 'none';
            showSections();
            await Promise.all([fetchFilms(), fetchHalls(), fetchSchedules()]);
        } else {
            errorElement.textContent = data.error;
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Network error';
        errorElement.style.display = 'block';
    }
}

async function addFilm() {
    const title = document.getElementById('filmTitle').value;
    const duration = document.getElementById('filmDuration').value;
    const description = document.getElementById('filmDescription').value;

    await fetch('http://localhost:8000/api/films/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, duration, description }),
    });
    await fetchFilms();
}

async function deleteFilm(id) {
    await fetch(`http://localhost:8000/api/films/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    await fetchFilms();
}

async function addHall() {
    const name = document.getElementById('hallName').value;
    await fetch('http://localhost:8000/api/halls/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
    });
    await fetchHalls();
}

async function deleteHall(id) {
    await fetch(`http://localhost:8000/api/halls/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    await fetchHalls();
}

async function addSchedule() {
    const film = document.getElementById('scheduleFilm').value;
    const hall = document.getElementById('scheduleHall').value;
    const showtime = document.getElementById('scheduleTime').value;

    await fetch('http://localhost:8000/api/schedules/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ film, hall, showtime }),
    });
    await fetchSchedules();
}

async function deleteSchedule(id) {
    await fetch(`http://localhost:8000/api/schedules/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    await fetchSchedules();
}
