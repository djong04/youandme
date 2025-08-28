// Messages array - each message has speaker and text
const messages = [
  { speaker: 'him', text: 'I have something to tell you' },
  { speaker: 'him', text: 'I really like you and talking to you so I have been wanting to ask you this question' },
  { speaker: 'him', text: 'Can I be your boyfriend? 😊' }
];

let currentMessageIndex = 0;
let isTyping = false;
let hasStarted = false; // Track if conversation has started

// DOM elements
const messageText = document.getElementById('message-text');
const speechBubble = document.getElementById('speech-bubble');
const avatarHim = document.getElementById('avatar-him');
const avatarHer = document.getElementById('avatar-her');
const flower = document.getElementById('flower');
const actions = document.getElementById('actions');
const confettiCanvas = document.getElementById('confetti');
const yayMessage = document.getElementById('yay-message');
const instruction = document.getElementById('instruction');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', handleTap);
  setupButtons();
  instruction.classList.add('show');
});

function handleTap() {
  if (isTyping) return;
  
  // If conversation hasn't started, start it
  if (!hasStarted) {
    hasStarted = true;
    showNextMessage();
    return;
  }
  
  if (currentMessageIndex < messages.length) {
    showNextMessage();
  }
}

function showNextMessage() {
  if (currentMessageIndex >= messages.length) return;
  
  const message = messages[currentMessageIndex];
  
  // Highlight speaking avatar
  if (message.speaker === 'him') {
    avatarHim.classList.add('speaking');
    avatarHer.classList.remove('speaking');
  } else {
    avatarHer.classList.add('speaking');
    avatarHim.classList.remove('speaking');
  }
  
  // Remove existing speaker classes and hide bubble
  speechBubble.classList.remove('show', 'speaker-him', 'speaker-her');
  
  // Immediately add the correct speaker class (no delay) to prevent flickering
  speechBubble.classList.add(`speaker-${message.speaker}`);
  
  setTimeout(() => {
    typeMessage(message.text, () => {
      currentMessageIndex++;
      
      // Show flower and actions after last message
      if (currentMessageIndex >= messages.length) {
        setTimeout(() => {
          flower.classList.add('show');
          actions.classList.add('show');
          instruction.classList.remove('show'); // Hide instruction when buttons appear
        }, 500);
      } else {
        // Show instruction after each message (except the last one)
        setTimeout(() => {
          instruction.classList.add('show');
        }, 1000);
      }
    });
  }, 300);
}

function typeMessage(text, callback) {
  isTyping = true;
  messageText.textContent = '';
  speechBubble.classList.add('show');
  
  let i = 0;
  const typeInterval = setInterval(() => {
    messageText.textContent += text[i];
    i++;
    
    if (i >= text.length) {
      clearInterval(typeInterval);
      isTyping = false;
      if (callback) callback();
    }
  }, 30);
}

function setupButtons() {
  document.getElementById('yes-btn').addEventListener('click', () => {
    showYesAnimation();
    messageText.textContent = 'Yay! You made me so happy! 💖';
    actions.style.display = 'none';
  });
  
  document.getElementById('no-btn').addEventListener('click', () => {
    messageText.textContent = 'I understand, thanks for being honest 🙂';
    actions.style.display = 'none';
  });
}

function showYesAnimation() {
  // Move avatars to center and face each other 
  avatarHim.classList.add('center-him');
  
  // Remove transition temporarily, flip immediately, then add center class
  avatarHer.style.transition = 'none';
  avatarHer.style.transform = 'scaleX(-1)';
  
  // Force a reflow to apply the immediate flip
  avatarHer.offsetHeight;
  
  // Re-enable transition and add center class for smooth movement
  avatarHer.style.transition = '';
  avatarHer.classList.add('center-her');
  
  // Hide speech bubble and rose
  speechBubble.style.opacity = '0';
  flower.style.opacity = '0';

  // Show yay message
  setTimeout(() => {
    yayMessage.classList.add('show');
  }, 800);
  
  // Start hearts animation after avatars move
  setTimeout(() => {
    showFloatingHearts();
  }, 800);
}

function showFloatingHearts() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const hearts = [];
  const heartColors = ['#ff6b9d', '#ff8e8e', '#ff1744', '#e91e63', '#f06292'];
  
  // Create floating hearts from avatar area (top of screen)
  for (let i = 0; i < 15; i++) {
    hearts.push({
      x: window.innerWidth * 0.35 + Math.random() * (window.innerWidth * 0.2),
      y: window.innerHeight * 0.3 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 4 - 2,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      size: Math.random() * 20 + 15,
      opacity: 1,
      life: 0
    });
  }
  
  function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = hearts.length - 1; i >= 0; i--) {
      const heart = hearts[i];
      heart.x += heart.vx;
      heart.y += heart.vy;
      heart.life += 0.015;
      heart.opacity = Math.max(0, 1 - heart.life);
      
      // Draw heart shape
      ctx.save();
      ctx.globalAlpha = heart.opacity;
      ctx.fillStyle = heart.color;
      ctx.font = `${heart.size}px Arial`;
      ctx.fillText('💖', heart.x, heart.y);
      ctx.restore();
      
      if (heart.opacity <= 0 || heart.y < -100) {
        hearts.splice(i, 1);
      }
    }
    
    // Add new hearts occasionally from avatar area
    if (Math.random() < 0.12 && hearts.length < 25) {
      hearts.push({
        x: window.innerWidth * 0.35 + Math.random() * (window.innerWidth * 0.2),
        y: window.innerHeight * 0.3 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 4 - 2,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        size: Math.random() * 20 + 15,
        opacity: 1,
        life: 0
      });
    }
    
    if (hearts.length > 0) {
      requestAnimationFrame(animateHearts);
    }
  }
  
  animateHearts();
}

function showConfetti() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#ff6b9d', '#ff8e8e', '#ffd93d', '#ff9f43', '#74b9ff', '#a29bfe'];
  
  // Create particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 2
    });
  }
  
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      
      if (p.y > canvas.height) {
        particles.splice(i, 1);
      }
    }
    
    if (particles.length > 0) {
      requestAnimationFrame(animateConfetti);
    }
  }
  
  animateConfetti();
}