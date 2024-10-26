const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";
class Circle {
constructor(x, y, radius, color, text, speed) {
this.posX = x;
this.posY = y;
this.radius = radius;
this.originalColor = color; // Guardar el color original
this.color = color;
this.text = text;
this.speed = speed;
this.dx = Math.random() < 0.5 ? speed : -speed; // Direcciones aleatorias iniciales
this.dy = Math.random() < 0.5 ? speed : -speed;
//this.collided = false; // Estado de colisión
this.isFlashing = false; // Estado de flasheo
this.flashDuration = 0; // Duración del flasheo
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
    // Actualizar la posición X
    this.posX += this.dx;
    // Cambiar la dirección si el círculo llega al borde del canvas en X
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
    this.dx = -this.dx;
    }
    // Actualizar la posición Y
    this.posY += this.dy;
    // Cambiar la dirección si el círculo llega al borde del canvas en Y
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
    this.dy = -this.dy;
    }

    // Gestionar el flasheo   
if (this.isFlashing) {
    this.flashDuration--;
                if (this.flashDuration <= 0) { 
                this.isFlashing = false; // Dejar de flashear
                    this.color = this.originalColor; // Regresar al color original
                }
            }

    }

    // Función para detectar si colisiona con otro círculo
isCollidingWith(otherCircle) {
    const dx = this.posX - otherCircle.posX;
    const dy = this.posY - otherCircle.posY;  
    const distance = Math.sqrt(dx * dx + dy * dy);   
    return distance < this.radius + otherCircle.radius;
    }

    // Método para iniciar el flasheo
startFlashing(duration) {
        this.isFlashing = true; // Activar estado de flasheo
        this.flashDuration = duration; // Establecer duración del flasheo
        this.color = "#0000FF"; // Cambiar a color azul
    }
    
// Método para invertir la dirección de movimiento
bounce() {
    this.dx = -this.dx; // Invertir dirección en X
    this.dy = -this.dy; // Invertir dirección en Y
}

// Actualizar el estado de colisión
resetCollision() {
        this.collided = false; // Resetear estado al final de la actualización
    }

}
    // Crear un array para almacenar N círculos
    let circles = [];
    // Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
    }
    }

 // Función para verificar y manejar colisiones

function checkCollisions() {
    // Recorrer todos los círculos
    for (let i = 0; i < circles.length; i++) {
        let circleA = circles[i];
        for (let j = 0; j < circles.length; j++) {
            if (i !== j) { // No compararse consigo mismo
let circleB = circles[j];
                
if (circleA.isCollidingWith(circleB)) {
                    circleA.bounce(circleB); // Cambiar dirección de ambos círculos
                    circleA.color = "#0000FF"; // Cambiar color de A al colisionar
                    circleB.color = "#0000FF"; // Cambiar color de B al colisionar
                    circleA.collided = true; // Marcar como colisionado
                    circleB.collided = true; // Marcar como colisionado
                    circleA.startFlashing(50); // Iniciar flasheo en A
                    circleB.startFlashing(50); // Iniciar flasheo en B
                }
            }
        }
    }

    
                
// Devolver al color original si no colisiona
    circles.forEach(circle => {
if (!circle.collided) {
            circle.color = circle.originalColor; // Regresa al color original
        }
        circle.resetCollision(); // Resetear el estado de colisión
    });
}

  
    // Función para animar los círculos
    function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
    checkCollisions();
    circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo
    });
    requestAnimationFrame(animate); // Repetir la animación
    }
    // Generar N círculos y comenzar la animación
    generateCircles(10); // Puedes cambiar el número de círculos aquí
    animate();
