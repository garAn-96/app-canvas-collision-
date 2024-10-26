const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = canvas.height;
const window_width = canvas.width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, radius, color, text, speed) {
        this.posX = x;
        this.posY = window_height + radius; // Posición inicial justo debajo del margen inferior
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() - 0.5) * 2; // Movimiento lateral aleatorio
        this.dy = -Math.abs(speed); // Siempre hacia arriba
        this.isFlashing = false;
        this.flashDuration = 0;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        
        // Actualizar posición X y Y
        this.posX += this.dx;
        this.posY += this.dy;
        
        // Cambiar la dirección si llega a los bordes laterales
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        
        // Reiniciar posición al alcanzar el borde superior
        if (this.posY + this.radius < 0) {
            this.posY = window_height + this.radius; // Volver al borde inferior
            this.posX = Math.random() * (window_width - this.radius * 2) + this.radius;
        }

        if (this.isFlashing) {
            this.flashDuration--;
            if (this.flashDuration <= 0) {
                this.isFlashing = false;
                this.color = this.originalColor;
            }
        }
    }

    isCollidingWith(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius;
    }

    startFlashing(duration) {
        this.isFlashing = true;
        this.flashDuration = duration;
        this.color = "#0000FF";
    }

    bounce() {
        this.dx = -this.dx;
        this.dy = -this.dy;
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, radius, color, text, speed));
    }
}

function checkCollisions() {
    for (let i = 0; i < circles.length; i++) {
        let circleA = circles[i];
        for (let j = 0; j < circles.length; j++) {
            if (i !== j) {
                let circleB = circles[j];
                if (circleA.isCollidingWith(circleB)) {
                    circleA.bounce();
                    circleB.bounce();
                    circleA.startFlashing(50);
                    circleB.startFlashing(50);
                }
            }
        }
    }
}
// Detectar clic en el canvas y eliminar círculo
canvas.addEventListener("click", function(event) {
    // Obtener las coordenadas del clic dentro del canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Filtrar los círculos para eliminar el que fue clickeado
    circles = circles.filter(circle => {
        const dx = mouseX - circle.posX;
        const dy = mouseY - circle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance > circle.radius; // Mantener solo los círculos que no fueron clickeados
    });
});

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    checkCollisions();
    circles.forEach(circle => {
        circle.update(ctx);
    });
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
