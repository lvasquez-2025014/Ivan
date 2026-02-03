// --- LÓGICA DE LA NIEVE ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

let particles = Array.from({ length: 156 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    d: Math.random() * 2 + 0.5
}));

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.beginPath();
    particles.forEach(p => {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        p.y += p.d;
        if (p.y > canvas.height) p.y = -10;
    });
    ctx.fill();
    requestAnimationFrame(draw);
}
draw();

// --- LOGIN Y PANTALLA DE CARGA ---
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        if (email === 'adminIvan@admin.com' && pass === 'Ludiwng299?') {
            const userName = "Iván";
            
            // Mostrar Loader
            document.getElementById('form-container').style.display = 'none';
            const loader = document.getElementById('loader-screen');
            loader.style.display = 'flex';
            document.getElementById('user-name-display').innerText = userName;

            // Animación de texto
            setTimeout(() => {
                const txt = document.getElementById('welcome-text');
                txt.style.opacity = '1';
                txt.style.transform = 'translateY(0)';
            }, 100);

            // Redirección
            setTimeout(() => { window.location.href = 'home.html'; }, 2800);
        } else {
            alert('Credenciales incorrectas');
        }
    });
}

function toggleForm() {
    const login = document.getElementById('login-section');
    const reg = document.getElementById('register-section');
    login.style.display = login.style.display === "none" ? "block" : "none";
    reg.style.display = reg.style.display === "none" ? "block" : "none";
}