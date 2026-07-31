// ============ SCROLL PROGRESS REEL ============
const reelFill = document.getElementById('reelFill');
function updateReel(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  reelFill.style.height = pct + '%';
}
window.addEventListener('scroll', updateReel);
updateReel();

// ============ REVEAL ON SCROLL ============
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
revealEls.forEach(el => observer.observe(el));

// ============ FLOATING PETALS ============
const petalContainer = document.getElementById('petals');
const PETAL_COUNT = 14;
for(let i=0; i<PETAL_COUNT; i++){
  const petal = document.createElement('div');
  petal.className = 'petal';
  const size = 6 + Math.random()*10;
  petal.style.width = size + 'px';
  petal.style.height = size + 'px';
  petal.style.left = Math.random()*100 + 'vw';
  petal.style.animationDuration = (10 + Math.random()*14) + 's';
  petal.style.animationDelay = (Math.random()*14) + 's';
  petal.style.opacity = 0.25 + Math.random()*0.35;
  petalContainer.appendChild(petal);
}

// ============ TYPEWRITER LOVE LETTER ============
const letterText = `Hey you.

I know you're going to scroll past this to get to the photos, but read this part first.

Living alone in a hostel was supposed to just be living alone. Somehow you turned it into something that feels a lot less like that — a five-minute walk that I look forward to every single day, and a room that stops feeling empty the second you're in it.

Here's a little scrapbook of us. Keep scrolling.`;

const letterEl = document.getElementById('letterText');
let typed = false;

function typeLetter(){
  if(typed) return;
  typed = true;
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.innerHTML = '&nbsp;';

  function step(){
    if(i <= letterText.length){
      letterEl.textContent = letterText.slice(0, i);
      letterEl.appendChild(cursor);
      i++;
      setTimeout(step, 18);
    } else {
      cursor.remove();
    }
  }
  step();
}

const letterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      setTimeout(typeLetter, 400);
      letterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
letterObserver.observe(document.querySelector('.paper'));

// ============ THE EVASIVE "NO" BUTTON ============
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const askButtons = document.getElementById('askButtons');
const askHint = document.getElementById('askHint');

const teases = [
  "told you to dare",
  "nice try",
  "almost had it",
  "it's quick, I'll give it that",
  "okay this is just embarrassing for you now",
  "at this point just say yes",
  "I respect the persistence though",
  "it's not happening, but keep going"
];
let dodgeCount = 0;

function dodgeNo(){
  dodgeCount++;
  askButtons.classList.add('escaping');

  const btnRect = noBtn.getBoundingClientRect();
  const margin = 24;
  const maxLeft = window.innerWidth - btnRect.width - margin;
  const maxTop = window.innerHeight - btnRect.height - margin;

  const newLeft = Math.max(margin, Math.random() * maxLeft);
  const newTop = Math.max(margin, Math.random() * maxTop);

  noBtn.style.left = newLeft + 'px';
  noBtn.style.top = newTop + 'px';

  // yes button grows a little each time, capped
  const scale = Math.min(1.5, 1 + dodgeCount * 0.05);
  yesBtn.style.transform = `scale(${scale})`;

  askHint.textContent = teases[Math.min(dodgeCount - 1, teases.length - 1)];
}

noBtn.addEventListener('mouseenter', dodgeNo);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNo(); }, { passive:false });
noBtn.addEventListener('click', (e) => { e.preventDefault(); dodgeNo(); });

// ============ YES -> CONFETTI + FINALE ============
yesBtn.addEventListener('click', () => {
  document.getElementById('finale').scrollIntoView({ behavior:'smooth' });
  setTimeout(launchConfetti, 700);
});

// ============ CONFETTI ============
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas(){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const confettiColors = ['#C9A15C', '#D98E9B', '#3B0F1A', '#F3E7D3', '#8C2F44'];

function launchConfetti(){
  if(confettiRunning) return;
  confettiRunning = true;
  resizeCanvas();
  confettiPieces = [];
  for(let i=0; i<140; i++){
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random()*6,
      h: 8 + Math.random()*10,
      color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
      speedY: 2 + Math.random()*3,
      speedX: (Math.random()-0.5) * 2,
      rotation: Math.random()*360,
      rotSpeed: (Math.random()-0.5) * 8
    });
  }
  let frames = 0;
  function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    let stillFalling = false;
    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      if(p.y < canvas.height + 20) stillFalling = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    frames++;
    if(stillFalling && frames < 400){
      requestAnimationFrame(animate);
    } else {
      confettiRunning = false;
      ctx.clearRect(0,0,canvas.width, canvas.height);
    }
  }
  animate();
}
