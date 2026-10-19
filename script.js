/* ==========================================================================
   ARSH'S LOVE MEMORIES WEBSITE - JAVASCRIPT
   Interactive, Responsive, Scrapbook Engine
   Features:
   - Ambient Canvas (Floating Hearts & Sparkles)
   - Romantic Web Audio API Synth & MP3 Music Player
   - Photo Gallery with Local Storage, Uploads, Lightbox, Slideshow
   - Memory Map CRUD
   - Romantic Timeline CRUD
   - Little Moments CRUD
   - 3D Unfolding Envelope Love Letter
   - Live Birthday Countdown & Love Journey Counter
   - Final Romantic Surprise with Heart Confetti
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     0. PASSWORD PROTECTION GATE (Cryptographically Secure SHA-256 Hashing)
     ======================================================================== */
  // 🔐 CRYPTOGRAPHIC PASSWORD HASH
  // To prevent exposing plain text in the page source, only the SHA-256
  // one-way cryptographic hash is stored. The plain password is never exposed.
  const DEFAULT_PASSWORD_HASH = "9a1de7c21aa9510d8baf3f654bdd1e9256507e9277e2402148faf8b1a15a5bee";

  // Pure JavaScript SHA-256 fallback implementation
  function sha256Fallback(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    
    let hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    for (let i = 0; i < ascii.length; i++) {
      const code = ascii.charCodeAt(i);
      words[i >> 2] |= code << ((3 - (i % 4)) * 8);
    }
    words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

    for (let j = 0; j < words.length; j += 16) {
      const w = words.slice(j, j + 16);
      const oldHash = hash.slice(0);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & hash[5]) ^ (~e & hash[6]);
        const temp1 = hash[7] + s1 + ch + k[i] + (w[i] = (i < 16) ? w[i] : (
          w[i - 16] +
          (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
          w[i - 7] +
          (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
        ) | 0);
        const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
        const temp2 = s0 + maj;

        hash = [(temp1 + temp2) | 0, a, hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
      }
      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
    for (let i = 0; i < 8; i++) {
      for (let b = 3; b >= 0; b--) {
        const byte = (hash[i] >> (b * 8)) & 255;
        result += (byte < 16 ? '0' : '') + byte.toString(16);
      }
    }
    return result;
  }

  async function computeSHA256(str) {
    const trimmed = str.trim();
    if (window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(trimmed);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (err) {
        return sha256Fallback(trimmed);
      }
    }
    return sha256Fallback(trimmed);
  }

  function getActivePasswordHash() {
    return localStorage.getItem('arsh_custom_pwd_hash') || DEFAULT_PASSWORD_HASH;
  }

  const passwordGate = document.getElementById('passwordGate');
  const gateCard = document.getElementById('gateCard');
  const gateLockIcon = document.getElementById('gateLockIcon');
  const passwordForm = document.getElementById('passwordForm');
  const gatePasswordInput = document.getElementById('gatePasswordInput');
  const pwdPeekBtn = document.getElementById('pwdPeekBtn');
  const peekIcon = document.getElementById('peekIcon');
  const gateErrorBox = document.getElementById('gateErrorBox');
  const gateErrorText = document.getElementById('gateErrorText');
  const hintToggleBtn = document.getElementById('hintToggleBtn');
  const hintText = document.getElementById('hintText');
  const mainWebsiteContent = document.getElementById('mainWebsiteContent');
  const lockNavBtn = document.getElementById('lockNavBtn');
  const lockFooterBtn = document.getElementById('lockFooterBtn');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const passwordChangeModal = document.getElementById('passwordChangeModal');
  const closePasswordChangeBtn = document.getElementById('closePasswordChangeBtn');
  const passwordChangeForm = document.getElementById('passwordChangeForm');
  const newPasswordInput = document.getElementById('newPasswordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const passwordChangeFeedback = document.getElementById('passwordChangeFeedback');

  // Check if session is already unlocked in this browser tab
  if (sessionStorage.getItem('arsh_unlocked') === 'true') {
    unlockWebsiteInstantly();
  } else {
    // Focus password input for quick typing
    setTimeout(() => {
      if (gatePasswordInput) gatePasswordInput.focus();
    }, 400);
  }

  function unlockWebsiteInstantly() {
    if (passwordGate) passwordGate.classList.add('unlocked');
    if (mainWebsiteContent) mainWebsiteContent.classList.remove('locked');
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const entered = gatePasswordInput.value;
    if (!entered) return;

    try {
      const enteredHash = await computeSHA256(entered);
      const expectedHash = getActivePasswordHash();

      if (enteredHash.toLowerCase() === expectedHash.toLowerCase()) {
        // Correct Password!
        gateErrorBox.classList.add('hidden');
        gateLockIcon.classList.add('opened');

        // Romantic burst around the lock
        const rect = gateLockIcon.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);

        // Mark unlocked in session
        sessionStorage.setItem('arsh_unlocked', 'true');

        // Smooth transition after lock animation
        setTimeout(() => {
          passwordGate.classList.add('unlocked');
          mainWebsiteContent.classList.remove('locked');
        }, 450);

      } else {
        // Incorrect Password
        showGateError("Oops! That's not our secret password... Think of our sweet word or special date! 🥺🤍");
      }
    } catch (err) {
      console.error("Crypto error:", err);
      showGateError("Oops! That's not our secret password... Think of our sweet word or special date! 🥺🤍");
    }
  }

  function showGateError(msg) {
    gateErrorText.textContent = msg;
    gateErrorBox.classList.remove('hidden');

    // Trigger shake animation
    gateCard.classList.remove('shake');
    void gateCard.offsetWidth; // Force reflow
    gateCard.classList.add('shake');

    gatePasswordInput.select();
    gatePasswordInput.focus();
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordSubmit);
  }

  // Show / Hide password peek
  if (pwdPeekBtn) {
    pwdPeekBtn.addEventListener('click', () => {
      const isPwd = gatePasswordInput.type === 'password';
      gatePasswordInput.type = isPwd ? 'text' : 'password';
      peekIcon.textContent = isPwd ? '🙈' : '👁️';
    });
  }

  // Hint Toggle
  if (hintToggleBtn) {
    hintToggleBtn.addEventListener('click', () => {
      hintText.classList.toggle('hidden');
    });
  }

  // Lock Website Functions (Available via Nav and Footer)
  function lockWebsite() {
    sessionStorage.removeItem('arsh_unlocked');
    mainWebsiteContent.classList.add('locked');
    passwordGate.classList.remove('unlocked');
    gateLockIcon.classList.remove('opened');
    gatePasswordInput.value = '';
    gateErrorBox.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      gatePasswordInput.focus();
    }, 400);
  }

  if (lockNavBtn) lockNavBtn.addEventListener('click', lockWebsite);
  if (lockFooterBtn) lockFooterBtn.addEventListener('click', lockWebsite);

  // Change Password Modal
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
      passwordChangeFeedback.textContent = '';
      passwordChangeForm.reset();
      passwordChangeModal.classList.add('active');
    });
  }

  if (closePasswordChangeBtn) {
    closePasswordChangeBtn.addEventListener('click', () => {
      passwordChangeModal.classList.remove('active');
    });
  }
  const pwdBackdrop = document.getElementById('passwordChangeBackdrop');
  if (pwdBackdrop) {
    pwdBackdrop.addEventListener('click', () => {
      passwordChangeModal.classList.remove('active');
    });
  }

  if (passwordChangeForm) {
    passwordChangeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const p1 = newPasswordInput.value;
      const p2 = confirmPasswordInput.value;

      if (p1 !== p2) {
        passwordChangeFeedback.style.color = '#c62828';
        passwordChangeFeedback.textContent = '❌ Passwords do not match!';
        return;
      }

      if (p1.length < 3) {
        passwordChangeFeedback.style.color = '#c62828';
        passwordChangeFeedback.textContent = '❌ Password must be at least 3 characters.';
        return;
      }

      const newHash = await computeSHA256(p1);
      localStorage.setItem('arsh_custom_pwd_hash', newHash);

      passwordChangeFeedback.style.color = 'var(--rose-primary)';
      passwordChangeFeedback.innerHTML = `✅ Password updated successfully!<br><small style="color:var(--text-muted);font-weight:normal;">Saved to your browser! To bake this into the source code permanently, paste this hash into <code>script.js</code>:<br><code style="font-size:0.75rem;word-break:break-all;user-select:all;display:block;margin-top:4px;padding:4px;background:#fff0f5;border-radius:4px;">${newHash}</code></small>`;

      setTimeout(() => {
        passwordChangeModal.classList.remove('active');
      }, 5000);
    });
  }

  /* ========================================================================
     1. DEFAULT MEMORIES DATA (Editable placeholders with romantic defaults)
     ======================================================================== */

  // 💖 PHOTOS DATA (Can be updated via UI or directly in code below)
  const DEFAULT_PHOTOS = [
    {
      id: 1,
      caption: "Our Sweet Beginning",
      date: "Special Day",
      category: "favorites",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      caption: "That Sunset With You",
      date: "Golden Hour",
      category: "dates",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      caption: "Coffee & Endless Laughter",
      date: "Our Little Cafe",
      category: "dates",
      url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      caption: "You Making Me Smile",
      date: "Always & Forever",
      category: "smiles",
      url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      caption: "Holding Your Hand",
      date: "My Safest Place",
      category: "favorites",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 6,
      caption: "Under the Soft Lights",
      date: "Magical Evening",
      category: "smiles",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop"
    }
  ];

  // 📍 MEMORY PLACES DATA
  const DEFAULT_PLACES = [
    {
      id: 1,
      name: "The Little Cafe by the Corner",
      date: "The Day We Talked For Hours",
      photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
      note: "We only planned to grab a quick coffee, but two hours turned into five. Your smile across the table made time completely stand still.",
      mapUrl: "https://maps.google.com"
    },
    {
      id: 2,
      name: "The Promenade at Sunset",
      date: "Golden Hour Stroll",
      photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      note: "The sky turned blush pink and orange. You held my hand in your jacket pocket to keep it warm, and my heart melted right there.",
      mapUrl: "https://maps.google.com"
    },
    {
      id: 3,
      name: "Our Secret Rooftop",
      date: "Stargazing Night",
      photo: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop",
      note: "Watching the city lights twinkle beneath us, wrapped up in one oversized hoodie, talking about our dreams and our future.",
      mapUrl: "https://maps.google.com"
    }
  ];

  // 🗓️ TIMELINE MILESTONES DATA
  const DEFAULT_TIMELINE = [
    {
      id: 1,
      title: "The Day Our Eyes First Met",
      date: "Chapter One",
      photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
      story: "A simple hello that quietly changed my entire world. I didn't know back then that you would become my most favorite person in existence."
    },
    {
      id: 2,
      title: "Our First Official Date",
      date: "Butterflies Everywhere",
      photo: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop",
      story: "My hands were shaking a little bit from nervousness, but the second you smiled and asked how I was, everything felt so naturally right."
    },
    {
      id: 3,
      title: "The Moment I Knew I Loved You",
      date: "A Quiet Epiphany",
      photo: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
      story: "You were laughing so hard at a silly joke, completely unfiltered and genuine. I looked at you and thought: home isn't a place, home is you."
    },
    {
      id: 4,
      title: "Our First Late Night Adventure",
      date: "Midnight Magic",
      photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
      story: "Empty roads, windows rolled down, singing along to romantic songs terribly, and laughing until our cheeks hurt."
    },
    {
      id: 5,
      title: "Right Here, Right Now — And Forever",
      date: "Today & All Our Tomorrows",
      photo: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop",
      story: "Every day with you is my new favorite day. Thank you for being my anchor, my sweetest boy, and my happiest adventure."
    }
  ];

  // 💌 LITTLE MOMENTS DATA
  const DEFAULT_MOMENTS = [
    {
      id: 1,
      title: "My Favourite Memory",
      stamp: "🌟",
      photo: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
      text: "The way you gently tuck my hair behind my ear and look at me like there's no one else in the room."
    },
    {
      id: 2,
      title: "The Day I Smiled the Most",
      stamp: "🤭",
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
      text: "When you tried to cook and ended up dropping the spoon, but still served it with the proudest, sweetest smile ever."
    },
    {
      id: 3,
      title: "A Moment I'll Never Forget",
      stamp: "💭",
      photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
      text: "When I was having a terrible day, and you showed up without saying a word, just giving me the warmest, tightest hug."
    },
    {
      id: 4,
      title: "Things That Remind Me of You",
      stamp: "☕",
      photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
      text: "Cozy oversized hoodies, hot hazelnut coffee, starry nighttime playlists, and the sweetest warmth in the world."
    }
  ];

  // ⏳ DEFAULT SPECIAL DATES
  // Format: YYYY-MM-DD
  const DEFAULT_DATES = {
    // 💖 Arsh's Next Birthday (Editable via UI or code)
    birthday: "2026-11-20",
    birthdayNote: "Counting down to celebrating the boy who owns my whole heart!",
    // 💖 Relationship Anniversary
    anniversary: "2024-05-15",
    anniversaryNote: "Every second with you has been my absolute favorite."
  };


  /* ========================================================================
     2. LOCAL STORAGE MANAGERS (Loads saved data or falls back to defaults)
     ======================================================================== */
  const storage = {
    getPhotos: () => JSON.parse(localStorage.getItem('arsh_photos')) || DEFAULT_PHOTOS,
    savePhotos: (data) => localStorage.setItem('arsh_photos', JSON.stringify(data)),

    getPlaces: () => JSON.parse(localStorage.getItem('arsh_places')) || DEFAULT_PLACES,
    savePlaces: (data) => localStorage.setItem('arsh_places', JSON.stringify(data)),

    getTimeline: () => JSON.parse(localStorage.getItem('arsh_timeline')) || DEFAULT_TIMELINE,
    saveTimeline: (data) => localStorage.setItem('arsh_timeline', JSON.stringify(data)),

    getMoments: () => JSON.parse(localStorage.getItem('arsh_moments')) || DEFAULT_MOMENTS,
    saveMoments: (data) => localStorage.setItem('arsh_moments', JSON.stringify(data)),

    getDates: () => JSON.parse(localStorage.getItem('arsh_dates')) || DEFAULT_DATES,
    saveDates: (data) => localStorage.setItem('arsh_dates', JSON.stringify(data)),

    getLetter: () => JSON.parse(localStorage.getItem('arsh_letter')) || null,
    saveLetter: (data) => localStorage.setItem('arsh_letter', JSON.stringify(data)),

    resetAll: () => {
      localStorage.removeItem('arsh_photos');
      localStorage.removeItem('arsh_places');
      localStorage.removeItem('arsh_timeline');
      localStorage.removeItem('arsh_moments');
      localStorage.removeItem('arsh_dates');
      localStorage.removeItem('arsh_letter');
      location.reload();
    }
  };


  /* ========================================================================
     3. AMBIENT FLOATING HEARTS & SPARKLES CANVAS
     ======================================================================== */
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class HeartParticle {
    constructor(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : height + Math.random() * 50;
      this.size = Math.random() * 14 + 10;
      this.isBurst = isBurst;
      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
      } else {
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -(Math.random() * 0.8 + 0.5);
        this.life = Math.random() * 0.7 + 0.3;
        this.decay = 0.001;
      }
      this.color = ['#f48fb1', '#f06292', '#ff80ab', '#f8bbd0', '#ffd1dc'][Math.floor(Math.random() * 5)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      if (this.isBurst) {
        this.life -= this.decay;
      } else {
        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }
    }

    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.life * 0.65);
      ctx.fillStyle = this.color;

      // Draw Heart Shape
      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, s / 4);
      ctx.quadraticCurveTo(0, 0, s / 4, 0);
      ctx.quadraticCurveTo(s / 2, 0, s / 2, s / 4);
      ctx.quadraticCurveTo(s / 2, 0, (s * 3) / 4, 0);
      ctx.quadraticCurveTo(s, 0, s, s / 4);
      ctx.quadraticCurveTo(s, s / 2, (s * 3) / 4, (s * 3) / 4);
      ctx.lineTo(s / 2, s);
      ctx.lineTo(s / 4, (s * 3) / 4);
      ctx.quadraticCurveTo(0, s / 2, 0, s / 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  // Create initial ambient background hearts
  for (let i = 0; i < 28; i++) {
    particles.push(new HeartParticle(Math.random() * width, Math.random() * height));
  }

  function spawnBurst(x, y, count = 18) {
    for (let i = 0; i < count; i++) {
      particles.push(new HeartParticle(x, y, true));
    }
  }

  // Tap anywhere to spawn romantic mini-hearts
  window.addEventListener('click', (e) => {
    // Only spawn if not clicking an input or button
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      spawnBurst(e.clientX, e.clientY, 8);
    }
  });

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.isBurst && p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  /* ========================================================================
     4. ROMANTIC MUSIC PLAYER & SYNTHESIZER ENGINE 🎵
     ======================================================================== */
  const nativeAudio = document.getElementById('nativeAudio');
  const miniPlayBtn = document.getElementById('miniPlayBtn');
  const mainPlayBtn = document.getElementById('mainPlayBtn');
  const mainPlayIcon = document.getElementById('mainPlayIcon');
  const vinylDisc = document.getElementById('vinylDisc');
  const miniSongTitle = document.getElementById('miniSongTitle');
  const miniSongStatus = document.getElementById('miniSongStatus');
  const playerTrackTitle = document.getElementById('playerTrackTitle');
  const playerTrackArtist = document.getElementById('playerTrackArtist');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');
  const audioFileInput = document.getElementById('audioFileInput');
  const modeSynthBtn = document.getElementById('modeSynthBtn');
  const modeLocalBtn = document.getElementById('modeLocalBtn');
  const musicPill = document.getElementById('musicPill');
  const musicCardExpanded = document.getElementById('musicCardExpanded');
  const closeExpandedBtn = document.getElementById('closeExpandedBtn');

  let isPlaying = false;
  let musicMode = 'synth'; // 'synth' or 'audio'
  let synthInterval = null;
  let audioCtx = null;

  // Toggle Expanded Music Player
  musicPill.addEventListener('click', (e) => {
    if (e.target.closest('#miniPlayBtn')) return;
    musicCardExpanded.classList.toggle('hidden');
  });
  closeExpandedBtn.addEventListener('click', () => {
    musicCardExpanded.classList.add('hidden');
  });

  // Web Audio API Gentle Acoustic Piano Lullaby Engine
  function initAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPianoNote(freq, time, duration = 1.6) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Warm harmonics
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.18, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    gain2.gain.setValueAtTime(0.001, time);
    gain2.gain.exponentialRampToValueAtTime(0.04, time + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.7);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(audioCtx.destination);
    gain2.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  }

  // Romantic arpeggio chords: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
  const romanticChords = [
    [261.63, 329.63, 392.00, 493.88], // C, E, G, B
    [220.00, 261.63, 329.63, 392.00], // A, C, E, G
    [174.61, 261.63, 329.63, 349.23], // F, C, E, F
    [196.00, 261.63, 293.66, 392.00]  // G, C, D, G
  ];
  let chordIndex = 0;
  let synthStep = 0;

  function startSynthEngine() {
    initAudioCtx();
    if (synthInterval) clearInterval(synthInterval);

    synthInterval = setInterval(() => {
      if (!isPlaying || musicMode !== 'synth') return;
      const now = audioCtx.currentTime;
      const chord = romanticChords[chordIndex];
      const noteFreq = chord[synthStep % chord.length];

      playPianoNote(noteFreq, now, 2.0);

      synthStep++;
      if (synthStep % chord.length === 0) {
        chordIndex = (chordIndex + 1) % romanticChords.length;
      }

      // Update synthetic progress bar
      const progress = ((synthStep % 64) / 64) * 100;
      progressBar.style.width = `${progress}%`;
      const currentSec = Math.floor((synthStep % 64) * 0.7);
      currentTimeEl.textContent = `0:${currentSec < 10 ? '0' : ''}${currentSec}`;
      totalDurationEl.textContent = '2:45';
    }, 700);
  }

  function stopSynthEngine() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function togglePlayMusic() {
    initAudioCtx();
    isPlaying = !isPlaying;

    if (isPlaying) {
      vinylDisc.classList.add('playing');
      miniSongStatus.textContent = 'Playing...';
      mainPlayIcon.textContent = '❚❚';
      document.querySelector('.play-icon').classList.add('hidden');
      document.querySelector('.pause-icon').classList.remove('hidden');

      if (musicMode === 'synth') {
        startSynthEngine();
      } else {
        nativeAudio.play().catch(e => {
          console.log("Audio autoplay prevented, switching to synth:", e);
          musicMode = 'synth';
          startSynthEngine();
        });
      }
    } else {
      vinylDisc.classList.remove('playing');
      miniSongStatus.textContent = 'Paused';
      mainPlayIcon.textContent = '▶';
      document.querySelector('.play-icon').classList.remove('hidden');
      document.querySelector('.pause-icon').classList.add('hidden');

      if (musicMode === 'synth') {
        stopSynthEngine();
      } else {
        nativeAudio.pause();
      }
    }
  }

  miniPlayBtn.addEventListener('click', togglePlayMusic);
  mainPlayBtn.addEventListener('click', togglePlayMusic);

  // Audio Mode Selector Buttons
  modeSynthBtn.addEventListener('click', () => {
    modeSynthBtn.classList.add('active');
    modeLocalBtn.classList.remove('active');
    musicMode = 'synth';
    playerTrackTitle.textContent = "Melody of Us";
    playerTrackArtist.textContent = "Arsh & Me";
    miniSongTitle.textContent = "Romantic Melody";
    nativeAudio.pause();
    if (isPlaying) startSynthEngine();
  });

  modeLocalBtn.addEventListener('click', () => {
    modeLocalBtn.classList.add('active');
    modeSynthBtn.classList.remove('active');
    musicMode = 'audio';
    stopSynthEngine();
    // Default placeholder track from local folder
    nativeAudio.src = 'music/our-song.mp3';
    playerTrackTitle.textContent = "Our Song (music/our-song.mp3)";
    playerTrackArtist.textContent = "Drop MP3 into music/ folder";
    miniSongTitle.textContent = "Our Song";
    if (isPlaying) nativeAudio.play().catch(() => {});
  });

  // User Custom MP3 Upload from Phone / Laptop
  audioFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      nativeAudio.src = fileUrl;
      musicMode = 'audio';
      stopSynthEngine();
      modeLocalBtn.classList.add('active');
      modeSynthBtn.classList.remove('active');

      const songName = file.name.replace(/\.[^/.]+$/, "");
      playerTrackTitle.textContent = songName;
      playerTrackArtist.textContent = "Selected from your device 💖";
      miniSongTitle.textContent = songName;

      isPlaying = true;
      nativeAudio.play();
      vinylDisc.classList.add('playing');
      miniSongStatus.textContent = 'Playing...';
      mainPlayIcon.textContent = '❚❚';
      document.querySelector('.play-icon').classList.add('hidden');
      document.querySelector('.pause-icon').classList.remove('hidden');
    }
  });

  // Native Audio progress handling
  nativeAudio.addEventListener('timeupdate', () => {
    if (nativeAudio.duration) {
      const pct = (nativeAudio.currentTime / nativeAudio.duration) * 100;
      progressBar.style.width = `${pct}%`;
      currentTimeEl.textContent = formatTime(nativeAudio.currentTime);
      totalDurationEl.textContent = formatTime(nativeAudio.duration);
    }
  });

  progressContainer.addEventListener('click', (e) => {
    if (musicMode === 'audio' && nativeAudio.duration) {
      const rect = progressContainer.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      nativeAudio.currentTime = clickPos * nativeAudio.duration;
    }
  });

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }


  /* ========================================================================
     5. WELCOME HERO & "OPEN YOUR LITTLE WORLD" TRANSITION
     ======================================================================== */
  const openWorldBtn = document.getElementById('openWorldBtn');
  const welcomeHeart = document.getElementById('welcomeHeart');

  function openWebsiteWorld(e) {
    const rect = openWorldBtn.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

    // Auto-start music if not playing yet
    if (!isPlaying) {
      togglePlayMusic();
    }

    // Smooth scroll down to Photo Gallery
    const gallerySection = document.getElementById('gallery');
    gallerySection.scrollIntoView({ behavior: 'smooth' });
  }

  openWorldBtn.addEventListener('click', openWebsiteWorld);
  welcomeHeart.addEventListener('click', (e) => {
    const rect = welcomeHeart.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
  });


  /* ========================================================================
     6. OUR PHOTO GALLERY 📸 (Polaroids, Uploads, Lightbox, Slideshow)
     ======================================================================== */
  const photoGrid = document.getElementById('photoGrid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const addPhotoBtn = document.getElementById('addPhotoBtn');
  const startSlideshowBtn = document.getElementById('startSlideshowBtn');

  // Modals
  const photoModal = document.getElementById('photoModal');
  const closePhotoModalBtn = document.getElementById('closePhotoModalBtn');
  const photoForm = document.getElementById('photoForm');
  const formPhotoFile = document.getElementById('formPhotoFile');
  const formPhotoUrl = document.getElementById('formPhotoUrl');
  const formPhotoPreview = document.getElementById('formPhotoPreview');
  const formPhotoCaption = document.getElementById('formPhotoCaption');
  const formPhotoDate = document.getElementById('formPhotoDate');
  const formPhotoCategory = document.getElementById('formPhotoCategory');
  const editPhotoIndex = document.getElementById('editPhotoIndex');

  // Lightbox
  const lightboxModal = document.getElementById('lightboxModal');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxHeartBtn = document.getElementById('lightboxHeartBtn');
  const lightboxHeartCount = document.getElementById('lightboxHeartCount');

  // Slideshow
  const slideshowModal = document.getElementById('slideshowModal');
  const closeSlideshowBtn = document.getElementById('closeSlideshowBtn');
  const slideshowImg = document.getElementById('slideshowImg');
  const slideshowTitle = document.getElementById('slideshowTitle');
  const slideshowCaption = document.getElementById('slideshowCaption');
  const slideshowCounter = document.getElementById('slideshowCounter');
  const slidePrevBtn = document.getElementById('slidePrevBtn');
  const slideNextBtn = document.getElementById('slideNextBtn');
  const slidePlayPauseBtn = document.getElementById('slidePlayPauseBtn');

  let currentPhotos = storage.getPhotos();
  let activeFilter = 'all';
  let slideshowIdx = 0;
  let slideshowTimer = null;
  let isSlideshowPlaying = true;

  function renderGallery() {
    photoGrid.innerHTML = '';
    const filtered = activeFilter === 'all' 
      ? currentPhotos 
      : currentPhotos.filter(p => p.category === activeFilter);

    filtered.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.innerHTML = `
        <div class="polaroid-tape"></div>
        <div class="polaroid-img-wrap">
          <img src="${photo.url}" alt="${photo.caption}" class="polaroid-img" loading="lazy">
          <div class="polaroid-overlay-tools">
            <button class="photo-tool-btn edit-photo-btn" title="Change this picture from phone">📷</button>
            <button class="photo-tool-btn delete-photo-btn" title="Delete memory">🗑️</button>
          </div>
        </div>
        <div class="polaroid-caption-wrap">
          <h4 class="polaroid-caption">${photo.caption}</h4>
          <span class="polaroid-date">${photo.date}</span>
        </div>
      `;

      // Tap on photo -> Open Lightbox
      card.querySelector('.polaroid-img-wrap').addEventListener('click', (e) => {
        if (e.target.closest('.photo-tool-btn')) return;
        openLightbox(photo);
      });

      // Quick change picture button
      card.querySelector('.edit-photo-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditPhotoModal(photo, idx);
      });

      // Delete photo
      card.querySelector('.delete-photo-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete memory "${photo.caption}"?`)) {
          currentPhotos = currentPhotos.filter(p => p.id !== photo.id);
          storage.savePhotos(currentPhotos);
          renderGallery();
        }
      });

      photoGrid.appendChild(card);
    });
  }

  // Gallery Filters
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      renderGallery();
    });
  });

  // Photo Lightbox
  function openLightbox(photo) {
    lightboxImg.src = photo.url;
    lightboxTitle.textContent = photo.caption;
    lightboxDate.textContent = photo.date;
    lightboxCaption.textContent = photo.caption + " — Every memory with Arsh is unforgettable. 🤍";
    lightboxHeartCount.textContent = "Loved ❤️";
    lightboxModal.classList.add('active');
  }

  closeLightboxBtn.addEventListener('click', () => lightboxModal.classList.remove('active'));
  document.getElementById('lightboxBackdrop').addEventListener('click', () => lightboxModal.classList.remove('active'));
  lightboxHeartBtn.addEventListener('click', (e) => {
    const rect = lightboxHeartBtn.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
    lightboxHeartCount.textContent = "Loved +1 💖";
  });

  // Photo Add / Edit Modal
  addPhotoBtn.addEventListener('click', () => {
    editPhotoIndex.value = "-1";
    document.getElementById('photoModalTitle').textContent = "Add a Cherished Photo 📸";
    photoForm.reset();
    formPhotoPreview.innerHTML = `<span>Preview will appear here</span>`;
    photoModal.classList.add('active');
  });

  function openEditPhotoModal(photo, idx) {
    editPhotoIndex.value = photo.id;
    document.getElementById('photoModalTitle').textContent = "Edit Cherished Photo 📸";
    formPhotoCaption.value = photo.caption;
    formPhotoDate.value = photo.date;
    formPhotoCategory.value = photo.category || 'favorites';
    formPhotoUrl.value = photo.url.startsWith('data:') ? '' : photo.url;
    formPhotoPreview.innerHTML = `<img src="${photo.url}" alt="Preview">`;
    photoModal.classList.add('active');
  }

  closePhotoModalBtn.addEventListener('click', () => photoModal.classList.remove('active'));
  document.getElementById('photoBackdrop').addEventListener('click', () => photoModal.classList.remove('active'));

  // Handle Photo File selection (FileReader for local image preview & base64 storage)
  formPhotoFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        formPhotoPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        formPhotoPreview.dataset.base64 = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  formPhotoUrl.addEventListener('input', () => {
    if (formPhotoUrl.value) {
      formPhotoPreview.innerHTML = `<img src="${formPhotoUrl.value}" alt="Preview">`;
      delete formPhotoPreview.dataset.base64;
    }
  });

  photoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const photoSrc = formPhotoPreview.dataset.base64 || formPhotoUrl.value || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop";
    const targetId = parseInt(editPhotoIndex.value);

    if (targetId === -1) {
      // Add new
      const newPhoto = {
        id: Date.now(),
        caption: formPhotoCaption.value,
        date: formPhotoDate.value || "Our Special Date",
        category: formPhotoCategory.value,
        url: photoSrc
      };
      currentPhotos.unshift(newPhoto);
    } else {
      // Edit existing
      const pIdx = currentPhotos.findIndex(p => p.id === targetId);
      if (pIdx !== -1) {
        currentPhotos[pIdx].caption = formPhotoCaption.value;
        currentPhotos[pIdx].date = formPhotoDate.value;
        currentPhotos[pIdx].category = formPhotoCategory.value;
        if (formPhotoPreview.dataset.base64 || formPhotoUrl.value) {
          currentPhotos[pIdx].url = photoSrc;
        }
      }
    }

    storage.savePhotos(currentPhotos);
    renderGallery();
    photoModal.classList.remove('active');
  });

  // Slideshow
  function updateSlideshowView() {
    if (!currentPhotos.length) return;
    const item = currentPhotos[slideshowIdx];
    slideshowImg.style.opacity = '0';
    setTimeout(() => {
      slideshowImg.src = item.url;
      slideshowTitle.textContent = item.caption;
      slideshowCaption.textContent = item.date;
      slideshowCounter.textContent = `${slideshowIdx + 1} / ${currentPhotos.length}`;
      slideshowImg.style.opacity = '1';
    }, 200);
  }

  function startSlideshowTimer() {
    if (slideshowTimer) clearInterval(slideshowTimer);
    slideshowTimer = setInterval(() => {
      if (isSlideshowPlaying) {
        slideshowIdx = (slideshowIdx + 1) % currentPhotos.length;
        updateSlideshowView();
      }
    }, 3500);
  }

  startSlideshowBtn.addEventListener('click', () => {
    if (!currentPhotos.length) return;
    slideshowIdx = 0;
    updateSlideshowView();
    slideshowModal.classList.add('active');
    isSlideshowPlaying = true;
    slidePlayPauseBtn.textContent = '❚❚';
    startSlideshowTimer();
  });

  closeSlideshowBtn.addEventListener('click', () => {
    slideshowModal.classList.remove('active');
    if (slideshowTimer) clearInterval(slideshowTimer);
  });
  document.getElementById('slideshowBackdrop').addEventListener('click', () => {
    slideshowModal.classList.remove('active');
    if (slideshowTimer) clearInterval(slideshowTimer);
  });

  slideNextBtn.addEventListener('click', () => {
    slideshowIdx = (slideshowIdx + 1) % currentPhotos.length;
    updateSlideshowView();
  });
  slidePrevBtn.addEventListener('click', () => {
    slideshowIdx = (slideshowIdx - 1 + currentPhotos.length) % currentPhotos.length;
    updateSlideshowView();
  });
  slidePlayPauseBtn.addEventListener('click', () => {
    isSlideshowPlaying = !isSlideshowPlaying;
    slidePlayPauseBtn.textContent = isSlideshowPlaying ? '❚❚' : '▶';
  });

  renderGallery();


  /* ========================================================================
     7. OUR MEMORY MAP 📍 ("Places That Hold Our Memories")
     ======================================================================== */
  const placesGrid = document.getElementById('placesGrid');
  const addPlaceBtn = document.getElementById('addPlaceBtn');
  const placeModal = document.getElementById('placeModal');
  const closePlaceModalBtn = document.getElementById('closePlaceModalBtn');
  const placeForm = document.getElementById('placeForm');
  const formPlaceName = document.getElementById('formPlaceName');
  const formPlaceDate = document.getElementById('formPlaceDate');
  const formPlaceFile = document.getElementById('formPlaceFile');
  const formPlaceUrl = document.getElementById('formPlaceUrl');
  const formPlacePreview = document.getElementById('formPlacePreview');
  const formPlaceNote = document.getElementById('formPlaceNote');
  const formPlaceMapLink = document.getElementById('formPlaceMapLink');
  const editPlaceIndex = document.getElementById('editPlaceIndex');

  let currentPlaces = storage.getPlaces();

  function renderPlaces() {
    placesGrid.innerHTML = '';
    currentPlaces.forEach((place) => {
      const card = document.createElement('div');
      card.className = 'place-card';
      card.innerHTML = `
        <div class="place-img-wrap">
          <img src="${place.photo}" alt="${place.name}" class="place-img" loading="lazy">
          <div class="place-stamp-badge">
            <span>📍</span> <span>Memory Spot</span>
          </div>
          <div class="place-actions-quick">
            <button class="place-edit-btn" title="Edit Place">✏️</button>
            <button class="place-delete-btn" title="Delete Place">🗑️</button>
          </div>
        </div>
        <div class="place-body">
          <h4 class="place-title">${place.name}</h4>
          <span class="place-date">${place.date}</span>
          <p class="place-story">${place.note}</p>
          <div class="place-footer">
            ${place.mapUrl ? `<a href="${place.mapUrl}" target="_blank" rel="noopener" class="maps-link-btn">View on Google Maps ↗</a>` : `<span></span>`}
          </div>
        </div>
      `;

      card.querySelector('.place-edit-btn').addEventListener('click', () => openEditPlaceModal(place));
      card.querySelector('.place-delete-btn').addEventListener('click', () => {
        if (confirm(`Delete memory for "${place.name}"?`)) {
          currentPlaces = currentPlaces.filter(p => p.id !== place.id);
          storage.savePlaces(currentPlaces);
          renderPlaces();
        }
      });

      placesGrid.appendChild(card);
    });
  }

  addPlaceBtn.addEventListener('click', () => {
    editPlaceIndex.value = "-1";
    document.getElementById('placeModalTitle').textContent = "Add a Special Memory Place 📍";
    placeForm.reset();
    formPlacePreview.innerHTML = `<span>Preview will appear here</span>`;
    delete formPlacePreview.dataset.base64;
    placeModal.classList.add('active');
  });

  function openEditPlaceModal(place) {
    editPlaceIndex.value = place.id;
    document.getElementById('placeModalTitle').textContent = "Edit Memory Place 📍";
    formPlaceName.value = place.name;
    formPlaceDate.value = place.date;
    formPlaceNote.value = place.note;
    formPlaceMapLink.value = place.mapUrl || '';
    formPlaceUrl.value = place.photo.startsWith('data:') ? '' : place.photo;
    formPlacePreview.innerHTML = `<img src="${place.photo}" alt="Preview">`;
    placeModal.classList.add('active');
  }

  closePlaceModalBtn.addEventListener('click', () => placeModal.classList.remove('active'));
  document.getElementById('placeBackdrop').addEventListener('click', () => placeModal.classList.remove('active'));

  formPlaceFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        formPlacePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        formPlacePreview.dataset.base64 = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  formPlaceUrl.addEventListener('input', () => {
    if (formPlaceUrl.value) {
      formPlacePreview.innerHTML = `<img src="${formPlaceUrl.value}" alt="Preview">`;
      delete formPlacePreview.dataset.base64;
    }
  });

  placeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const photoSrc = formPlacePreview.dataset.base64 || formPlaceUrl.value || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop";
    const targetId = parseInt(editPlaceIndex.value);

    if (targetId === -1) {
      const newPlace = {
        id: Date.now(),
        name: formPlaceName.value,
        date: formPlaceDate.value || "Our Special Date",
        note: formPlaceNote.value,
        mapUrl: formPlaceMapLink.value || "https://maps.google.com",
        photo: photoSrc
      };
      currentPlaces.unshift(newPlace);
    } else {
      const pIdx = currentPlaces.findIndex(p => p.id === targetId);
      if (pIdx !== -1) {
        currentPlaces[pIdx].name = formPlaceName.value;
        currentPlaces[pIdx].date = formPlaceDate.value;
        currentPlaces[pIdx].note = formPlaceNote.value;
        currentPlaces[pIdx].mapUrl = formPlaceMapLink.value;
        if (formPlacePreview.dataset.base64 || formPlaceUrl.value) {
          currentPlaces[pIdx].photo = photoSrc;
        }
      }
    }

    storage.savePlaces(currentPlaces);
    renderPlaces();
    placeModal.classList.remove('active');
  });

  renderPlaces();


  /* ========================================================================
     8. OUR RELATIONSHIP TIMELINE 🗓️
     ======================================================================== */
  const timelineContainer = document.getElementById('timelineContainer');
  const addTimelineBtn = document.getElementById('addTimelineBtn');
  const timelineModal = document.getElementById('timelineModal');
  const closeTimelineModalBtn = document.getElementById('closeTimelineModalBtn');
  const timelineForm = document.getElementById('timelineForm');
  const formTimelineTitle = document.getElementById('formTimelineTitle');
  const formTimelineDate = document.getElementById('formTimelineDate');
  const formTimelineFile = document.getElementById('formTimelineFile');
  const formTimelineUrl = document.getElementById('formTimelineUrl');
  const formTimelinePreview = document.getElementById('formTimelinePreview');
  const formTimelineStory = document.getElementById('formTimelineStory');
  const editTimelineIndex = document.getElementById('editTimelineIndex');

  let currentTimeline = storage.getTimeline();

  function renderTimeline() {
    // Keep central line, clear cards
    timelineContainer.innerHTML = '<div class="timeline-central-line"></div>';

    currentTimeline.forEach((item, index) => {
      const side = index % 2 === 0 ? 'left' : 'right';
      const el = document.createElement('div');
      el.className = `timeline-item ${side}`;
      el.innerHTML = `
        <div class="timeline-node">🤍</div>
        <div class="timeline-card">
          <span class="timeline-date-stamp">${item.date}</span>
          <h4 class="timeline-card-title">${item.title}</h4>
          ${item.photo ? `
            <div class="timeline-photo-wrap">
              <img src="${item.photo}" alt="${item.title}" class="timeline-photo" loading="lazy">
            </div>
          ` : ''}
          <p class="timeline-story">${item.story}</p>
          <div class="timeline-item-tools">
            <button class="place-edit-btn edit-timeline-btn" title="Edit milestone">✏️</button>
            <button class="place-delete-btn delete-timeline-btn" title="Delete milestone">🗑️</button>
          </div>
        </div>
      `;

      el.querySelector('.edit-timeline-btn').addEventListener('click', () => openEditTimelineModal(item));
      el.querySelector('.delete-timeline-btn').addEventListener('click', () => {
        if (confirm(`Delete milestone "${item.title}"?`)) {
          currentTimeline = currentTimeline.filter(t => t.id !== item.id);
          storage.saveTimeline(currentTimeline);
          renderTimeline();
        }
      });

      timelineContainer.appendChild(el);
    });
  }

  addTimelineBtn.addEventListener('click', () => {
    editTimelineIndex.value = "-1";
    document.getElementById('timelineModalTitle').textContent = "Add a Milestone 🗓️";
    timelineForm.reset();
    formTimelinePreview.innerHTML = `<span>Preview</span>`;
    delete formTimelinePreview.dataset.base64;
    timelineModal.classList.add('active');
  });

  function openEditTimelineModal(item) {
    editTimelineIndex.value = item.id;
    document.getElementById('timelineModalTitle').textContent = "Edit Milestone 🗓️";
    formTimelineTitle.value = item.title;
    formTimelineDate.value = item.date;
    formTimelineStory.value = item.story;
    formTimelineUrl.value = item.photo && !item.photo.startsWith('data:') ? item.photo : '';
    formTimelinePreview.innerHTML = item.photo ? `<img src="${item.photo}" alt="Preview">` : `<span>No photo</span>`;
    timelineModal.classList.add('active');
  }

  closeTimelineModalBtn.addEventListener('click', () => timelineModal.classList.remove('active'));
  document.getElementById('timelineBackdrop').addEventListener('click', () => timelineModal.classList.remove('active'));

  formTimelineFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        formTimelinePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        formTimelinePreview.dataset.base64 = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  formTimelineUrl.addEventListener('input', () => {
    if (formTimelineUrl.value) {
      formTimelinePreview.innerHTML = `<img src="${formTimelineUrl.value}" alt="Preview">`;
      delete formTimelinePreview.dataset.base64;
    }
  });

  timelineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const photoSrc = formTimelinePreview.dataset.base64 || formTimelineUrl.value || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop";
    const targetId = parseInt(editTimelineIndex.value);

    if (targetId === -1) {
      const newMilestone = {
        id: Date.now(),
        title: formTimelineTitle.value,
        date: formTimelineDate.value,
        story: formTimelineStory.value,
        photo: photoSrc
      };
      currentTimeline.push(newMilestone);
    } else {
      const tIdx = currentTimeline.findIndex(t => t.id === targetId);
      if (tIdx !== -1) {
        currentTimeline[tIdx].title = formTimelineTitle.value;
        currentTimeline[tIdx].date = formTimelineDate.value;
        currentTimeline[tIdx].story = formTimelineStory.value;
        if (formTimelinePreview.dataset.base64 || formTimelineUrl.value) {
          currentTimeline[tIdx].photo = photoSrc;
        }
      }
    }

    storage.saveTimeline(currentTimeline);
    renderTimeline();
    timelineModal.classList.remove('active');
  });

  renderTimeline();


  /* ========================================================================
     9. OUR LITTLE MOMENTS 💌
     ======================================================================== */
  const momentsGrid = document.getElementById('momentsGrid');
  const addMomentBtn = document.getElementById('addMomentBtn');
  const momentModal = document.getElementById('momentModal');
  const closeMomentModalBtn = document.getElementById('closeMomentModalBtn');
  const momentForm = document.getElementById('momentForm');
  const formMomentTitle = document.getElementById('formMomentTitle');
  const formMomentFile = document.getElementById('formMomentFile');
  const formMomentUrl = document.getElementById('formMomentUrl');
  const formMomentPreview = document.getElementById('formMomentPreview');
  const formMomentText = document.getElementById('formMomentText');
  const editMomentIndex = document.getElementById('editMomentIndex');

  let currentMoments = storage.getMoments();

  function renderMoments() {
    momentsGrid.innerHTML = '';
    currentMoments.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'moment-card';
      card.innerHTML = `
        <div class="moment-stamp">${item.stamp || '💌'}</div>
        <h4 class="moment-title">${item.title}</h4>
        ${item.photo ? `
          <div class="moment-photo-wrap">
            <img src="${item.photo}" alt="${item.title}" class="moment-photo" loading="lazy">
          </div>
        ` : ''}
        <p class="moment-body">${item.text}</p>
        <div class="moment-card-footer">
          <button class="place-edit-btn edit-moment-btn" title="Edit note">✏️ Edit</button>
          <button class="place-delete-btn delete-moment-btn" title="Delete note">🗑️</button>
        </div>
      `;

      card.querySelector('.edit-moment-btn').addEventListener('click', () => openEditMomentModal(item));
      card.querySelector('.delete-moment-btn').addEventListener('click', () => {
        if (confirm(`Delete "${item.title}"?`)) {
          currentMoments = currentMoments.filter(m => m.id !== item.id);
          storage.saveMoments(currentMoments);
          renderMoments();
        }
      });

      momentsGrid.appendChild(card);
    });
  }

  addMomentBtn.addEventListener('click', () => {
    editMomentIndex.value = "-1";
    document.getElementById('momentModalTitle').textContent = "Add Another Little Moment 💌";
    momentForm.reset();
    formMomentPreview.innerHTML = `<span>Preview</span>`;
    delete formMomentPreview.dataset.base64;
    momentModal.classList.add('active');
  });

  function openEditMomentModal(item) {
    editMomentIndex.value = item.id;
    document.getElementById('momentModalTitle').textContent = "Edit Little Moment 💌";
    formMomentTitle.value = item.title;
    formMomentText.value = item.text;
    formMomentUrl.value = item.photo && !item.photo.startsWith('data:') ? item.photo : '';
    formMomentPreview.innerHTML = item.photo ? `<img src="${item.photo}" alt="Preview">` : `<span>No photo</span>`;
    momentModal.classList.add('active');
  }

  closeMomentModalBtn.addEventListener('click', () => momentModal.classList.remove('active'));
  document.getElementById('momentBackdrop').addEventListener('click', () => momentModal.classList.remove('active'));

  formMomentFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        formMomentPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        formMomentPreview.dataset.base64 = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  formMomentUrl.addEventListener('input', () => {
    if (formMomentUrl.value) {
      formMomentPreview.innerHTML = `<img src="${formMomentUrl.value}" alt="Preview">`;
      delete formMomentPreview.dataset.base64;
    }
  });

  momentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const photoSrc = formMomentPreview.dataset.base64 || formMomentUrl.value || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop";
    const targetId = parseInt(editMomentIndex.value);

    if (targetId === -1) {
      const newMoment = {
        id: Date.now(),
        title: formMomentTitle.value,
        stamp: "💖",
        text: formMomentText.value,
        photo: photoSrc
      };
      currentMoments.push(newMoment);
    } else {
      const mIdx = currentMoments.findIndex(m => m.id === targetId);
      if (mIdx !== -1) {
        currentMoments[mIdx].title = formMomentTitle.value;
        currentMoments[mIdx].text = formMomentText.value;
        if (formMomentPreview.dataset.base64 || formMomentUrl.value) {
          currentMoments[mIdx].photo = photoSrc;
        }
      }
    }

    storage.saveMoments(currentMoments);
    renderMoments();
    momentModal.classList.remove('active');
  });

  renderMoments();


  /* ========================================================================
     10. A LETTER FOR YOU 💗 (3D Interactive Envelope)
     ======================================================================== */
  const waxSeal = document.getElementById('waxSeal');
  const envelopeBox = document.getElementById('envelopeBox');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const editLetterBtn = document.getElementById('editLetterBtn');

  // Letter content elements
  const letterBodyText = document.getElementById('letterBodyText');
  const letterDate = document.getElementById('letterDate');
  const letterSign = document.getElementById('letterSign');

  // Letter edit modal
  const letterModal = document.getElementById('letterModal');
  const closeLetterModalBtn = document.getElementById('closeLetterModalBtn');
  const letterForm = document.getElementById('letterForm');
  const formLetterDate = document.getElementById('formLetterDate');
  const formLetterContent = document.getElementById('formLetterContent');
  const formLetterSign = document.getElementById('formLetterSign');

  // Load custom letter from localStorage if present
  const savedLetter = storage.getLetter();
  if (savedLetter) {
    letterDate.textContent = savedLetter.date;
    letterSign.textContent = savedLetter.sign;
    letterBodyText.innerHTML = savedLetter.content
      .split('\n')
      .filter(p => p.trim() !== '')
      .map(p => `<p>${p}</p>`)
      .join('');
  }

  // Break Wax Seal & Open Envelope
  waxSeal.addEventListener('click', () => {
    const rect = waxSeal.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
    envelopeBox.classList.add('opened');
  });

  closeLetterBtn.addEventListener('click', () => {
    envelopeBox.classList.remove('opened');
  });

  // Edit Letter in modal
  editLetterBtn.addEventListener('click', () => {
    formLetterDate.value = letterDate.textContent;
    formLetterSign.value = letterSign.textContent;
    // Extract paragraphs as plain text with linebreaks
    const paras = Array.from(letterBodyText.querySelectorAll('p')).map(p => p.textContent);
    formLetterContent.value = paras.join('\n\n');
    letterModal.classList.add('active');
  });

  closeLetterModalBtn.addEventListener('click', () => letterModal.classList.remove('active'));
  document.getElementById('letterBackdrop').addEventListener('click', () => letterModal.classList.remove('active'));

  letterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newDate = formLetterDate.value || "Forever & Always";
    const newSign = formLetterSign.value || "Yours Always 🤍";
    const rawContent = formLetterContent.value;

    letterDate.textContent = newDate;
    letterSign.textContent = newSign;
    letterBodyText.innerHTML = rawContent
      .split('\n')
      .filter(p => p.trim() !== '')
      .map(p => `<p>${p}</p>`)
      .join('');

    storage.saveLetter({
      date: newDate,
      sign: newSign,
      content: rawContent
    });

    letterModal.classList.remove('active');
  });


  /* ========================================================================
     11. OUR COUNTDOWN & SPECIAL DATES ⏳
     ======================================================================== */
  const bDays = document.getElementById('bDays');
  const bHours = document.getElementById('bHours');
  const bMins = document.getElementById('bMins');
  const bSecs = document.getElementById('bSecs');
  const birthdayTargetText = document.getElementById('birthdayTargetText');
  const editBirthdayBtn = document.getElementById('editBirthdayBtn');

  const lDays = document.getElementById('lDays');
  const lHours = document.getElementById('lHours');
  const lMins = document.getElementById('lMins');
  const lSecs = document.getElementById('lSecs');
  const anniversaryTargetText = document.getElementById('anniversaryTargetText');
  const editAnniversaryBtn = document.getElementById('editAnniversaryBtn');

  // Dates Modal
  const datesModal = document.getElementById('datesModal');
  const closeDatesModalBtn = document.getElementById('closeDatesModalBtn');
  const datesForm = document.getElementById('datesForm');
  const datesMode = document.getElementById('datesMode');
  const datePickerLabel = document.getElementById('datePickerLabel');
  const formCustomDate = document.getElementById('formCustomDate');
  const formDateSubtext = document.getElementById('formDateSubtext');

  let specialDates = storage.getDates();

  function updateCountdowns() {
    const now = new Date();

    // 1. Birthday Countdown (Target in future)
    let bDate = new Date(specialDates.birthday + 'T00:00:00');
    // If birthday has passed for this year, count down to next year's
    if (bDate < now) {
      bDate.setFullYear(now.getFullYear() + (now.getMonth() > bDate.getMonth() || (now.getMonth() === bDate.getMonth() && now.getDate() > bDate.getDate()) ? 1 : 0));
    }
    const diffBirthday = bDate - now;

    if (diffBirthday > 0) {
      const days = Math.floor(diffBirthday / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diffBirthday % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffBirthday % (1000 * 60)) / 1000);

      bDays.textContent = String(days).padStart(2, '0');
      bHours.textContent = String(hours).padStart(2, '0');
      bMins.textContent = String(mins).padStart(2, '0');
      bSecs.textContent = String(secs).padStart(2, '0');
    } else {
      bDays.textContent = '00';
      bHours.textContent = '00';
      bMins.textContent = '00';
      bSecs.textContent = '00';
      birthdayTargetText.textContent = "🎉 Happy Birthday Arsh! You are my greatest gift! 🤍";
    }

    // 2. Relationship Anniversary Count-Up (From the past to today)
    const aDate = new Date(specialDates.anniversary + 'T00:00:00');
    const diffAnniv = now - aDate;

    if (diffAnniv > 0) {
      const days = Math.floor(diffAnniv / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffAnniv % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diffAnniv % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffAnniv % (1000 * 60)) / 1000);

      lDays.textContent = String(days).padStart(2, '0');
      lHours.textContent = String(hours).padStart(2, '0');
      lMins.textContent = String(mins).padStart(2, '0');
      lSecs.textContent = String(secs).padStart(2, '0');
    }

    birthdayTargetText.textContent = specialDates.birthdayNote || `Counting down to ${specialDates.birthday}`;
    anniversaryTargetText.textContent = specialDates.anniversaryNote || `Since ${specialDates.anniversary}`;
  }

  setInterval(updateCountdowns, 1000);
  updateCountdowns();

  // Edit Birthday
  editBirthdayBtn.addEventListener('click', () => {
    datesMode.value = 'birthday';
    document.getElementById('datesModalTitle').textContent = "Set Arsh's Birthday 🎂";
    datePickerLabel.textContent = "Select Birthday Date:";
    formCustomDate.value = specialDates.birthday;
    formDateSubtext.value = specialDates.birthdayNote;
    datesModal.classList.add('active');
  });

  // Edit Anniversary
  editAnniversaryBtn.addEventListener('click', () => {
    datesMode.value = 'anniversary';
    document.getElementById('datesModalTitle').textContent = "Set Our Anniversary Date 💑";
    datePickerLabel.textContent = "Select Anniversary Start Date:";
    formCustomDate.value = specialDates.anniversary;
    formDateSubtext.value = specialDates.anniversaryNote;
    datesModal.classList.add('active');
  });

  closeDatesModalBtn.addEventListener('click', () => datesModal.classList.remove('active'));
  document.getElementById('datesBackdrop').addEventListener('click', () => datesModal.classList.remove('active'));

  datesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mode = datesMode.value;
    if (mode === 'birthday') {
      specialDates.birthday = formCustomDate.value;
      specialDates.birthdayNote = formDateSubtext.value;
    } else {
      specialDates.anniversary = formCustomDate.value;
      specialDates.anniversaryNote = formDateSubtext.value;
    }
    storage.saveDates(specialDates);
    updateCountdowns();
    datesModal.classList.remove('active');
  });


  /* ========================================================================
     12. FINAL SURPRISE 🎁 ("One Last Thing...")
     ======================================================================== */
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseGiftIcon = document.getElementById('surpriseGiftIcon');
  const surpriseModal = document.getElementById('surpriseModal');
  const closeSurpriseModalBtn = document.getElementById('closeSurpriseModalBtn');
  const showerHeartsBtn = document.getElementById('showerHeartsBtn');
  const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');

  function openFinalSurprise() {
    const rect = surpriseBtn.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
    surpriseModal.classList.add('active');

    // Pre-fill WhatsApp message
    const loveMsg = encodeURIComponent("Arsh, I just visited our memories website... and I love you more than words could ever describe! 🤍✨");
    shareWhatsappBtn.href = `https://api.whatsapp.com/send?text=${loveMsg}`;
  }

  surpriseBtn.addEventListener('click', openFinalSurprise);
  surpriseGiftIcon.addEventListener('click', openFinalSurprise);
  closeSurpriseModalBtn.addEventListener('click', () => surpriseModal.classList.remove('active'));
  document.getElementById('surpriseBackdrop').addEventListener('click', () => surpriseModal.classList.remove('active'));

  // Massive Heart Shower
  showerHeartsBtn.addEventListener('click', () => {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        spawnBurst(Math.random() * width, Math.random() * height * 0.7, 5);
      }, i * 35);
    }
  });


  /* ========================================================================
     13. NAVIGATION OBSERVER (Highlights current section on scroll)
     ======================================================================== */
  const sections = document.querySelectorAll('header[id], section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    threshold: 0.35,
    rootMargin: "-20px 0px -20px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));


  /* ========================================================================
     14. FOOTER RESET TO DEFAULTS
     ======================================================================== */
  const resetDataBtn = document.getElementById('resetDataBtn');
  resetDataBtn.addEventListener('click', () => {
    if (confirm("Reset memories and photos back to default placeholders?")) {
      storage.resetAll();
    }
  });

});
