/* ==========================================
   INTERACTIVE BG PARTICLES CANVAS
   ========================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let animationFrameId;
let isParticleEnabled = true;

const mouse = {
    x: null,
    y: null,
    radius: 120
};

// Handle window resizing
window.addEventListener('resize', () => {
    resizeCanvas();
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

// Particle Template
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Particle collision with cursor
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 2;
            }
        }

        // Particle constant movement
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = Math.min((canvas.width * canvas.height) / 11000, 100);
    
    // Fetch accent color from document root
    const getAccentRGB = () => {
        const temp = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim();
        return temp ? temp : '99, 102, 241';
    };

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let rgb = getAccentRGB();
        let color = `rgba(${rgb}, 0.35)`;
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Draw connections between nearby nodes
function connectNodes() {
    let opacityValue = 1;
    const rgb = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '99, 102, 241';

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                opacityValue = 1 - (distance / 110);
                ctx.strokeStyle = `rgba(${rgb}, ${opacityValue * 0.18})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Particle Loop
function animateParticles() {
    if (!isParticleEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectNodes();
    animationFrameId = requestAnimationFrame(animateParticles);
}

// Track mouse positioning
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Start particles initial load
resizeCanvas();
animateParticles();


/* ==========================================
   HERO TYPING TEXT EFFECT
   ========================================== */
const typewriterElement = document.getElementById('typewriter');
const phrases = ["Smart AI Solutions", "Responsive Web Interfaces", "Insightful Data Analytics", "Core Software Architectures"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function runTypewriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Deletes faster
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 110; // Typing speed
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 1500; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before typing next
    }

    setTimeout(runTypewriter, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runTypewriter, 1000);
});


/* ==========================================
   SELF-INTRODUCTION VIDEO & VOICE WAVE PLAY
   ========================================== */
const video = document.getElementById('intro-video');
const videoPlaceholder = document.getElementById('video-placeholder');
const voiceCanvas = document.getElementById('voice-waves');
const voiceCtx = voiceCanvas.getContext('2d');
const playBtn = document.getElementById('play-visual-btn');
const subtitleBox = document.getElementById('subtitle-box');
const subtitleText = document.getElementById('subtitle-text');
const hologramLine = document.getElementById('hologram-line');

let visualizerInterval;
let isBriefingPlaying = false;
let waveOffset = 0;
let currentUtterance = null;

// Subtitle texts representing Drushtishree's self introduction
const briefingSubtitles = [
    { text: "Greetings! Initiating Drushtishree's portfolio briefings assistant.", voiceText: "Greetings! Initiating Drush ti shree's portfolio briefings assistant." },
    { text: "Drushtishree is a Computer Science & Engineering student at Ghousia College of Engineering, graduating in July 2027.", voiceText: "Drush ti shree is a Computer Science and Engineering student at Ghousia College of Engineering, graduating in July 2027." },
    { text: "She specializes in intelligent AI systems, full-stack layouts, and data analytics in Bengaluru, India.", voiceText: "She specializes in intelligent A.I. systems, full-stack layouts, and data analytics in Bengaluru, India." },
    { text: "Her language profile includes Python, C, HTML, CSS, and structured modern JavaScript.", voiceText: "Her language profile includes Python, C, H.T.M.L., C.S.S., and structured modern JavaScript." },
    { text: "In 2024, she completed Deloitte Australia's Data Analytics Job Simulation, working on Excel and Tableau.", voiceText: "In 2024, she completed Deloitte Australia's Data Analytics Job Simulation, working on Excel and Tableau." },
    { text: "She is also an IBM certified Enterprise Design Thinking Practitioner, solving real-world challenges user-first.", voiceText: "She is also an I.B.M. certified Enterprise Design Thinking Practitioner, solving real-world challenges user-first." },
    { text: "Below are her featured creations: the AI-Powered Facial Attendance System, and a voice-activated chatbot.", voiceText: "Below are her featured creations: the A.I. Powered Facial Attendance System, and a voice-activated chatbot." },
    { text: "Check out her resume, or drop a query in the contact section below to collaborate. Thank you!", voiceText: "Check out her resume, or drop a query in the contact section below to collaborate. Thank you!" }
];

let currentSubtitleIndex = 0;

// Adjust audio wave canvas dimensions
function resizeVoiceCanvas() {
    voiceCanvas.width = videoPlaceholder.clientWidth;
    voiceCanvas.height = videoPlaceholder.clientHeight;
}
window.addEventListener('resize', resizeVoiceCanvas);
resizeVoiceCanvas();

// Check if user uploaded intro.mp4 and it plays fine
video.addEventListener('error', () => {
    console.log("No custom intro.mp4 detected. Utilizing fallback AI Audio Briefing Visualizer.");
});

// Player click trigger
videoPlaceholder.addEventListener('click', toggleBriefing);

function toggleBriefing() {
    // If intro.mp4 exists and can play, play it directly
    if (video.src && !video.src.includes('undefined') && video.readyState >= 2) {
        videoPlaceholder.style.display = 'none';
        video.style.display = 'block';
        video.play();
        return;
    }

    // Fallback AI Wave Briefing Logic
    if (isBriefingPlaying) {
        stopBriefing();
    } else {
        startBriefing();
    }
}

function startBriefing() {
    isBriefingPlaying = true;
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    subtitleBox.classList.add('active');
    hologramLine.classList.add('active');
    
    // Wave visualizer loop
    visualizerInterval = requestAnimationFrame(drawVoiceWaves);
    
    // Start speaking subtitles
    currentSubtitleIndex = 0;
    speakNextSubtitle();
}

function stopBriefing() {
    isBriefingPlaying = false;
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    subtitleBox.classList.remove('active');
    hologramLine.classList.remove('active');
    cancelAnimationFrame(visualizerInterval);
    
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    // Clear canvas
    voiceCtx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
    subtitleText.textContent = "Briefing paused. Click play to resume introduction...";
}

function speakNextSubtitle() {
    if (!isBriefingPlaying) return;

    if (currentSubtitleIndex < briefingSubtitles.length) {
        const item = briefingSubtitles[currentSubtitleIndex];
        
        // Print text instantly or write it
        typeSubtitle(item.text);

        // Synthesis Speech setup
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel(); // Stop prior speeches
            
            const speechText = item.voiceText || item.text;
            currentUtterance = new SpeechSynthesisUtterance(speechText);
            
            // Try to find a clear female speech voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural')));
            if (preferredVoice) {
                currentUtterance.voice = preferredVoice;
            }
            
            currentUtterance.rate = 0.95; // Speaking pace
            currentUtterance.pitch = 1.0;
            
            currentUtterance.onend = () => {
                if (isBriefingPlaying) {
                    currentSubtitleIndex++;
                    setTimeout(speakNextSubtitle, 300); // Small breath pause
                }
            };
            
            currentUtterance.onerror = (e) => {
                console.error("Speech Synthesis Error:", e);
                // Fail-safe: if speech synthesis fails, progress by duration timer
                if (isBriefingPlaying) {
                    currentSubtitleIndex++;
                    setTimeout(speakNextSubtitle, 4500);
                }
            };
            
            window.speechSynthesis.speak(currentUtterance);
        } else {
            // Speech API unsupported, fallback to timer
            setTimeout(() => {
                if (isBriefingPlaying) {
                    currentSubtitleIndex++;
                    speakNextSubtitle();
                }
            }, 5000);
        }
    } else {
        // Complete
        typeSubtitle("AI holographic briefing completed. Click play to repeat.");
        playBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
        isBriefingPlaying = false;
        hologramLine.classList.remove('active');
        cancelAnimationFrame(visualizerInterval);
    }
}

function typeSubtitle(fullText) {
    let charI = 0;
    subtitleText.textContent = "";
    
    function writeChar() {
        if (charI < fullText.length && isBriefingPlaying) {
            subtitleText.textContent += fullText.charAt(charI);
            charI++;
            setTimeout(writeChar, 18);
        } else if (!isBriefingPlaying) {
            subtitleText.textContent = fullText;
        }
    }
    writeChar();
}

// Drawing animated visualizer HUD overlays
function drawVoiceWaves() {
    if (!isBriefingPlaying) return;

    voiceCtx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
    const rgb = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '99, 102, 241';
    const acc = `rgb(${rgb})`;
    
    const w = voiceCanvas.width;
    const h = voiceCanvas.height;
    const midX = w / 2;
    const midY = h / 2;

    // 1. Draw Biometric Face-Tracking Bounding Box
    voiceCtx.strokeStyle = `rgba(${rgb}, 0.35)`;
    voiceCtx.lineWidth = 1;
    voiceCtx.setLineDash([6, 12]);
    voiceCtx.strokeRect(midX - 70, midY - 90, 140, 150);
    voiceCtx.setLineDash([]); // Reset dash

    // Draw Bounding Corners (cyberpunk HUD angles)
    voiceCtx.strokeStyle = acc;
    voiceCtx.lineWidth = 2;
    const len = 15;
    
    // Top-Left Corner
    voiceCtx.beginPath();
    voiceCtx.moveTo(midX - 70 + len, midY - 90);
    voiceCtx.lineTo(midX - 70, midY - 90);
    voiceCtx.lineTo(midX - 70, midY - 90 + len);
    voiceCtx.stroke();

    // Top-Right Corner
    voiceCtx.beginPath();
    voiceCtx.moveTo(midX + 70 - len, midY - 90);
    voiceCtx.lineTo(midX + 70, midY - 90);
    voiceCtx.lineTo(midX + 70, midY - 90 + len);
    voiceCtx.stroke();

    // Bottom-Left Corner
    voiceCtx.beginPath();
    voiceCtx.moveTo(midX - 70 + len, midY + 60);
    voiceCtx.lineTo(midX - 70, midY + 60);
    voiceCtx.lineTo(midX - 70, midY + 60 - len);
    voiceCtx.stroke();

    // Bottom-Right Corner
    voiceCtx.beginPath();
    voiceCtx.moveTo(midX + 70 - len, midY + 60);
    voiceCtx.lineTo(midX + 70, midY + 60);
    voiceCtx.lineTo(midX + 70, midY + 60 - len);
    voiceCtx.stroke();

    // 2. Draw HUD telemetry text labels
    voiceCtx.fillStyle = `rgba(${rgb}, 0.75)`;
    voiceCtx.font = "10px Space Grotesk";
    voiceCtx.fillText("TARGET: DRUSHTISHREE", midX - 65, midY - 75);
    voiceCtx.fillText("LOC: BENGALURU, IN", midX - 65, midY + 40);
    
    voiceCtx.font = "8px Space Grotesk";
    voiceCtx.fillStyle = "#10b981";
    voiceCtx.fillText("STATUS: MATCHED [100%]", midX - 65, midY - 62);
    
    // Oscillating scanning laser point
    const dotY = midY - 90 + ((Math.sin(waveOffset * 1.5) + 1) / 2) * 150;
    voiceCtx.fillStyle = acc;
    voiceCtx.beginPath();
    voiceCtx.arc(midX - 70, dotY, 3, 0, Math.PI * 2);
    voiceCtx.arc(midX + 70, dotY, 3, 0, Math.PI * 2);
    voiceCtx.fill();

    // 3. Draw Audio Spectrum Waves at bottom
    voiceCtx.shadowBlur = 8;
    voiceCtx.shadowColor = `rgba(${rgb}, 0.4)`;
    
    const waveCount = 2;
    for (let j = 0; j < waveCount; j++) {
        voiceCtx.beginPath();
        voiceCtx.strokeStyle = `rgba(${rgb}, ${0.8 - j * 0.3})`;
        voiceCtx.lineWidth = 1.5;
        
        let amplitude = (30 - j * 12) * (0.6 + Math.sin(Date.now() * 0.005) * 0.4);
        let frequency = 0.015 + j * 0.005;
        
        for (let x = 0; x < w; x++) {
            let y = (h - 60) + Math.sin(x * frequency + waveOffset + (j * 3)) * amplitude;
            if (x === 0) {
                voiceCtx.moveTo(x, y);
            } else {
                voiceCtx.lineTo(x, y);
            }
        }
        voiceCtx.stroke();
    }
    
    voiceCtx.shadowBlur = 0; // Reset shadow

    // Progress bar for speech completion
    voiceCtx.fillStyle = `rgba(${rgb}, 0.15)`;
    voiceCtx.fillRect(0, h - 6, w, 6);
    
    const progress = currentSubtitleIndex / briefingSubtitles.length;
    voiceCtx.fillStyle = acc;
    voiceCtx.fillRect(0, h - 6, w * progress, 6);

    // Speed of visualizer offsets
    waveOffset += 0.06;
    visualizerInterval = requestAnimationFrame(drawVoiceWaves);
}


/* ==========================================
   SKILL METER SCROLL ANIMATION
   ========================================== */
const skillsSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.meter-fill');
const percentLabels = document.querySelectorAll('.percent-label');
let skillsAnimated = false;

function checkSkillsScroll() {
    if (skillsAnimated) return;
    
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (sectionPos < screenHeight * 0.85) {
        progressBars.forEach(bar => {
            const finalVal = bar.getAttribute('data-val');
            bar.style.width = finalVal;
        });

        percentLabels.forEach(label => {
            const target = parseInt(label.getAttribute('data-target'));
            let current = 0;
            const increment = target / 40; // timing increment
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    label.textContent = target + '%';
                    clearInterval(timer);
                } else {
                    label.textContent = Math.ceil(current) + '%';
                }
            }, 25);
        });

        skillsAnimated = true;
    }
}

window.addEventListener('scroll', checkSkillsScroll);


/* ==========================================
   PROJECT DETAILS MODALS DATA
   ========================================== */
const projectData = {
    attendance: {
        title: "AI-Powered Attendance System",
        tagline: "Automated student tracking via biometric facial recognition",
        desc: "Developed in 2024 to simplify student check-in procedures, this program integrates an AI facial evaluation engine with a dashboard display. It automatically identifies students passing through camera feeds, log timestamps in a database, and generates visual analytics for administrators.",
        features: [
            "Facial recognition algorithms using real-time webcam captures.",
            "Frog-eye illumination adaptation filters to match students under uneven lighting.",
            "Administrative analytics dashboard displaying daily averages and individual logs.",
            "Auto-generated PDF spreadsheets for monthly attendance archives."
        ],
        tech: ["Python", "OpenCV / Face Recognition", "SQLite3", "HTML5", "CSS3 / Grid Layouts", "JavaScript"]
    },
    chatbot: {
        title: "Voice-Enabled Chatbot",
        tagline: "Hands-free browser querying powered by lightweight NLP pipelines",
        desc: "Built in 2024, this project enables accessible communication with custom chatbot agents. Users can activate their desktop microphones to prompt commands, which are parsed by a lightweight NLP tokenizer to supply immediate, contextually appropriate text and audio responses.",
        features: [
            "Real-time voice tokenization via HTML5 Speech Recognition APIs.",
            "Custom NLP regex-classifier identifying command intent.",
            "Text-to-speech feedback synthesis using browser audio cards.",
            "Glassmorphic control console showcasing visual sound-node wave responses."
        ],
        tech: ["Python", "Natural Language Toolkit (NLTK)", "Web Speech API", "SpeechSynthesis", "Flask Framework", "CSS Flexbox"]
    }
};

const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const projectCards = document.querySelectorAll('.project-card');

// Modal opening trigger
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const data = projectData[projectId];
        if (data) {
            populateModal(data);
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // stop scroll underneath
        }
    });
});

function populateModal(data) {
    let featuresHTML = '';
    data.features.forEach(feat => {
        featuresHTML += `<li><i class="fa-solid fa-circle-check"></i> <span>${feat}</span></li>`;
    });

    let techHTML = '';
    data.tech.forEach(t => {
        techHTML += `<span>${t}</span>`;
    });

    modalBody.innerHTML = `
        <h3 class="modal-detail-title">${data.title}</h3>
        <p class="modal-detail-tagline">${data.tagline}</p>
        <p class="modal-detail-desc">${data.desc}</p>
        
        <h4 class="modal-section-title"><i class="fa-solid fa-list-ul text-glow"></i> Major Implementations</h4>
        <ul class="modal-feature-list">
            ${featuresHTML}
        </ul>
        
        <div class="modal-detail-tech">
            ${techHTML}
        </div>
    `;
}

// Modal closing trigger
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto'; // restore scroll
}


/* ==========================================
   SCROLLSPY ACTIVE NAVIGATION LINKS
   ========================================== */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
        const secHeight = sec.offsetHeight;
        const secTop = sec.offsetTop - 120; // header height offset
        const id = sec.getAttribute('id');

        if (scrollY >= secTop && scrollY < secTop + secHeight) {
            currentSection = id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
});


/* ==========================================
   MOBILE MENU TOGGLE & THEME DRAWER
   ========================================== */
const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
});

// Close menu when navigation item clicked on mobile
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navMenu.classList.remove('open');
    });
});

// Accent selector switcher drawer triggers
const themeBtn = document.getElementById('theme-btn');
const themePanel = document.getElementById('theme-panel');
const themeOpts = document.querySelectorAll('.theme-opt');
const particleSwitch = document.getElementById('particle-switch');

themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themePanel.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target) && e.target !== themeBtn) {
        themePanel.classList.remove('open');
    }
});

// Theme selecting handles
themeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
        themeOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        
        const selectedTheme = opt.getAttribute('data-theme');
        
        // Remove all previous body theme classes
        document.body.classList.remove('theme-indigo', 'theme-cyan', 'theme-emerald', 'theme-rose');
        document.body.classList.add(`theme-${selectedTheme}`);
        
        // Reset particle colors to match new theme
        initParticles();
    });
});

// Particle switch handle
particleSwitch.addEventListener('change', (e) => {
    isParticleEnabled = e.target.checked;
    if (isParticleEnabled) {
        animateParticles();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});
