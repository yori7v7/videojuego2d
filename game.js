// Configuración del canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cargar imagen de enemigo
const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";

// Variables del juego
let enemies = [];
let score = 0;

// Función para generar enemigos con movimientos distintos
function createEnemy() {
    let size = Math.random() * 30 + 30; // Tamaño entre 30 y 60 px
    let speed = Math.random() * 3 + 1; // Velocidad aleatoria

    // Elegir una posición inicial aleatoria en los bordes del canvas
    let spawnSide = Math.floor(Math.random() * 4); // 0 = arriba, 1 = abajo, 2 = izquierda, 3 = derecha
    let x, y, direction;

    if (spawnSide === 0) { 
        // Aparece arriba
        x = Math.random() * canvas.width;
        y = -size;
        direction = "down";
    } else if (spawnSide === 1) { 
        // Aparece abajo
        x = Math.random() * canvas.width;
        y = canvas.height;
        direction = "up";
    } else if (spawnSide === 2) { 
        // Aparece a la izquierda
        x = -size;
        y = Math.random() * canvas.height;
        direction = "right";
    } else { 
        // Aparece a la derecha
        x = canvas.width;
        y = Math.random() * canvas.height;
        direction = "left";
    }

    // Definir tipo de movimiento aleatorio
    let moveType = Math.floor(Math.random() * 3); // 0 = lineal, 1 = diagonal, 2 = circular
    let angle = Math.random() * Math.PI * 2; // Ángulo inicial para movimiento circular

    enemies.push({ x, y, size, speed, direction, moveType, angle });
}

// Dibujar los enemigos
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.size, enemy.size);
    });
}

// Mover los enemigos en direcciones aleatorias
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if (enemy.moveType === 0) {
            // Movimiento lineal (arriba, abajo, izquierda o derecha)
            if (enemy.direction === "down") enemy.y += enemy.speed;
            if (enemy.direction === "up") enemy.y -= enemy.speed;
            if (enemy.direction === "left") enemy.x -= enemy.speed;
            if (enemy.direction === "right") enemy.x += enemy.speed;
        } else if (enemy.moveType === 1) {
            // Movimiento diagonal
            enemy.x += Math.cos(enemy.angle) * enemy.speed;
            enemy.y += Math.sin(enemy.angle) * enemy.speed;
        } else if (enemy.moveType === 2) {
            // Movimiento circular
            enemy.x += Math.cos(enemy.angle) * enemy.speed;
            enemy.y += Math.sin(enemy.angle) * enemy.speed;
            enemy.angle += 0.05; // Ajustar la velocidad de rotación
        }

        // Si el enemigo sale del canvas, se elimina
        if (
            enemy.x + enemy.size < 0 || 
            enemy.x > canvas.width || 
            enemy.y + enemy.size < 0 || 
            enemy.y > canvas.height
        ) {
            enemies.splice(i, 1);
        }
    }
}

// Detectar clic sobre un enemigo y eliminarlo
canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (
            mouseX >= enemy.x &&
            mouseX <= enemy.x + enemy.size &&
            mouseY >= enemy.y &&
            mouseY <= enemy.y + enemy.size
        ) {
            enemies.splice(i, 1);
            score++;
            document.getElementById("score").textContent = `Puntuación: ${score}`;
            break;
        }
    }
});

// Bucle principal del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEnemies();
    updateEnemies();
    requestAnimationFrame(gameLoop);
}

// Crear enemigos cada 1.5 segundos
setInterval(createEnemy, 1500);

// Iniciar el juego
gameLoop();
