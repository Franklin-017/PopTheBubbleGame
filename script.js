// Canvas setup
const canvas = document.getElementById('canvas');
const modal = document.getElementById('modal');
const startButton = document.getElementById('startGameBtn');
const scoreDisplay = document.getElementById('score');

const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let timer = 61;
let animationId;

ctx.font = '50px Georgia';

startButton.addEventListener('click', () => {
  animate();
  startTime();
  modal.style.display = 'none';
})

// Mouse Interactivity
let canvasePosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click:  false
}
canvas.addEventListener('mousedown', function(event) {
  mouse.click = true;
  mouse.x = event.x - canvasePosition.left;
  mouse.y = event.y - canvasePosition.top;
})
canvas.addEventListener('mouseup', function(event) {
  mouse.click = false;
})
// Player
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    if(mouse.x != this.x) {
      this.x -= dx/10;
    }
    if(mouse.y != this.y) {
      this.y -= dy/10;
    }
  }
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = '#e2590a';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.radius, 10); 
  }
}
const player = new Player;

// Bubbles
const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
  }
  draw() {
    ctx.fillStyle = '#62a8e69d';
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = './asset/Plop.ogg'
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './asset/bubbles-single1.wav'

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for(let i=0; i<bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
  }

  for(let i=0; i<bubblesArray.length; i++) {
    if(bubblesArray[i] < 0 - this.radius * 2  ) {
      bubblesArray.splice(i, 1);
    }
    if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound === 'sound1') {
          bubblePop1.play();
        } else {
          bubblePop2.play();
        }
        score += (1 * Math.floor(bubblesArray[i].speed));
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
      }
    }
  }
}
// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  player.update();
  player.draw();
  ctx.fillStyle = '#ddddd8d7';
  ctx.fillText('score: '+ score, 10, 50);
  ctx.fillStyle = '#ddddd8d7';
  ctx.fillText('Time: '+ timer, 500, 50);
  gameFrame++;
  animationId = requestAnimationFrame(animate);
}

function startTime() {
  timer--;
  if (timer < 0) { 
    cancelAnimationFrame(animationId);
    modal.style.display = 'flex';
    timer = 61;
    scoreDisplay.innerHTML = score;
    document.getElementById('points').innerHTML = 'POINTS';
    document.getElementById('instructions').style.display = 'none';
    if (score !== 0) {
      startButton.innerHTML = 'Try Again';
    }
    score = 0;
  } else {
    setTimeout(startTime, 1000);
  }
}
