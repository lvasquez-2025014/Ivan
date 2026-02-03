document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const loginContainer = document.querySelector('.login-container');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let mouseX = -500;
    let mouseY = -500;
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const config = {
        dropCount: 110,
        baseSpeed: 2.2,
        repulsionRadius: 110,
        dropWidth: 6,   // Más gorditas
        dropHeight: 14, 
        shadowBlur: 15,
        shadowColor: 'rgba(180, 240, 255, 0.8)'
    };

    class RainDrop {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 1.2 + 0.8;
            this.speed = (config.baseSpeed + Math.random()) * this.size;
            this.opacity = Math.random() * 0.4 + 0.4;
            
            // --- Variables de Viscosidad ---
            this.stretch = 1; // Deformación vertical
            this.squeeze = 1; // Deformación horizontal
            this.isDripping = false;
            this.targetX = this.x;
        }

        update() {
            const rect = loginContainer.getBoundingClientRect();
            
            // Reset de elasticidad suave (viscosidad)
            this.stretch += (1 - this.stretch) * 0.1;
            this.squeeze += (1 - this.squeeze) * 0.1;

            // Colisión con el techo
            if (!this.isDripping &&
                this.x > rect.left && this.x < rect.right &&
                this.y + (config.dropHeight * this.size) > rect.top && this.y < rect.top + 8) {
                
                // Efecto de impacto viscoso (se aplasta)
                this.stretch = 0.4; 
                this.squeeze = 1.6;

                let side = (this.x > rect.left + rect.width / 2) ? rect.right : rect.left;
                this.x += (side - this.x) * 0.08;
                this.y = rect.top - (config.dropHeight * this.size * this.stretch);

                if (Math.abs(this.x - side) < 6) this.isDripping = true;
            } 
            else if (this.isDripping) {
                // Escurrimiento lento (viscoso)
                this.y += this.speed * 0.3;
                this.stretch = 1.3; // Se estira por la gravedad
                this.squeeze = 0.7;

                if (this.y > rect.bottom) this.isDripping = false;
            } 
            else {
                this.y += this.speed;

                // Interacción viscosa con el mouse
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < config.repulsionRadius) {
                    const force = (config.repulsionRadius - dist) / config.repulsionRadius;
                    this.x += (dx / dist) * force * 5;
                    
                    // Deformación al pasar cerca del mouse
                    this.stretch = 1 + force; 
                    this.squeeze = 1 - (force * 0.5);
                }
            }

            if (this.y > canvas.height + 50) this.reset();
        }

        draw() {
            const w = config.dropWidth * this.size * this.squeeze;
            const h = config.dropHeight * this.size * this.stretch;

            ctx.save();
            ctx.translate(this.x, this.y);
            
            ctx.shadowBlur = config.shadowBlur;
            ctx.shadowColor = config.shadowColor;
            ctx.fillStyle = `rgba(200, 250, 255, ${this.opacity})`;

            // Dibujo de gota elástica
            ctx.beginPath();
            ctx.moveTo(0, 0);
            // El cuerpo se adapta a las variables stretch/squeeze
            ctx.bezierCurveTo(w, h * 0.3, w, h, 0, h);
            ctx.bezierCurveTo(-w, h, -w, h * 0.3, 0, 0);
            ctx.fill();

            // Reflejo interno para dar aspecto de líquido
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(-w/3, h/2, w/4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    const drops = [];
    for (let i = 0; i < config.dropCount; i++) drops.push(new RainDrop());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drops.forEach(drop => {
            drop.update();
            drop.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    // Validación Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (document.getElementById('email').value === 'adminIvan@admin.com' && 
                document.getElementById('password').value === 'Ludiwng299?') {
                window.location.href = 'home.html';
            } else {
                alert('Acceso denegado');
            }
        });
    }
});