/**
 * THIỆP TRI ÂN THẦY CÔ 20/11 - JAVASCRIPT LOGIC
 * Hiệu ứng phong bì 3D, âm nhạc du dương, mưa hoa & tạo mã QR
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================
  // 1. DATA: LỜI CHÚC THEO TỪNG ĐỐI TƯỢNG
  // ===================================================
  const wishesData = {
    all: {
      salutation: "Kính gửi Quý Thầy Cô giáo kính yêu,",
      paragraphs: [
        "Nhân ngày Nhà giáo Việt Nam 20/11, chúng em xin gửi trọn tấm lòng biết ơn sâu sắc và lời tri ân chân thành nhất tới Quý Thầy Cô — những người lái đò thầm lặng chở từng lớp học trò qua sông tri thức.",
        "Từng bài giảng tâm huyết, từng lời răn dạy ân cần và từng giọt mồ hôi rơi trên bục giảng đã trở thành hành trang vô giá nâng bước chúng em vững chãi trên đường đời. Dẫu mai này đi muôn phương, chúng em vẫn mãi khắc ghi công ơn dưỡng dục tựa biển trời của Thầy Cô.",
        "Kính chúc Quý Thầy Cô luôn dồi dào sức khỏe, tràn đầy niềm vui, hạnh phúc và mãi giữ ngọn lửa nhiệt huyết để tiếp tục dìu dắt thêm nhiều thế hệ tương lai cập bến thành công!"
      ]
    },
    thay: {
      salutation: "Kính gửi Thầy giáo kính mến,",
      paragraphs: [
        "Nhân ngày 20/11, em xin kính chúc Thầy luôn mạnh khỏe, kiên định và tràn đầy năng lượng trên bục giảng.",
        "Em luôn nhớ về sự nghiêm khắc nhưng chan chứa yêu thương của Thầy. Thầy không chỉ truyền dạy cho em những kiến thức sâu rộng, mà còn rèn luyện cho em bản lĩnh, sự tự tin và lòng chính trực để đối diện với mọi thử thách.",
        "Cảm ơn Thầy vì đã luôn là ngọn hải đăng soi sáng con đường tri thức cho chúng em. Kính chúc Thầy cùng gia đình luôn dồi dào sức khỏe, bình an và gặt hái thật nhiều thành công trong sự nghiệp trồng người!"
      ]
    },
    co: {
      salutation: "Kính gửi Cô giáo mến thương,",
      paragraphs: [
        "Nhân ngày Nhà giáo Việt Nam 20/11, em xin gửi tới Cô ngàn đóa hoa tươi thắm cùng những lời chúc mừng ấm áp và ngọt ngào nhất!",
        "Tấm lòng dịu dàng, nụ cười hiền hậu và sự kiên nhẫn của Cô đã nâng đỡ em qua những tháng ngày thơ bé dưới mái trường. Những bài học của Cô như dòng suối mát lành, gieo vào tâm hồn em tình yêu cuộc sống và khát vọng vươn lên.",
        "Kính chúc Cô mãi luôn tươi trẻ, tràn đầy niềm vui, hạnh phúc bên gia đình và luôn rạng ngời ngọn lửa đam mê với nghề giáo cao quý!"
      ]
    },
    chunhiem: {
      salutation: "Kính gửi Thầy/Cô Chủ nhiệm kính yêu,",
      paragraphs: [
        "Nhân ngày 20/11, tập thể học trò chúng em xin gửi lời tri ân sâu sắc nhất tới người 'cha, người mẹ thứ hai' của lớp chúng em!",
        "Chúng em biết rằng làm chủ nhiệm là bao vất vả, lo toan, từng buổi sinh hoạt, từng kỳ thi hay những lúc chúng em nghịch ngợm khiến Thầy Cô phải bận lòng. Nhưng chưa bao giờ Thầy Cô buông tay, mà luôn bao dung, bảo ban chúng em như chính những đứa con ruột thịt.",
        "Cảm ơn Thầy Cô vì đã luôn chở che và vun đắp nên một mái nhà tập thể đoàn kết, tràn ngập kỷ niệm đẹp. Chúng em kính chúc Thầy Cô một ngày 20/11 thật nhiều niềm vui, sức khỏe và luôn tự hào về chúng em!"
      ]
    }
  };

  // ===================================================
  // 2. DOM ELEMENTS
  // ===================================================
  const envelopeSection = document.getElementById('envelopeSection');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const envelope = document.getElementById('envelope');
  const cardSection = document.getElementById('cardSection');
  const btnCloseCard = document.getElementById('btnCloseCard');
  const recipientSelect = document.getElementById('recipientSelect');
  const letterBody = document.getElementById('letterBody');
  const senderNameDisplay = document.getElementById('senderNameDisplay');
  const btnCelebrate = document.getElementById('btnCelebrate');
  const btnShareCard = document.getElementById('btnShareCard');
  const cheerToast = document.getElementById('cheerToast');
  
  // Modals & Nav
  const btnToggleBoard = document.getElementById('btnToggleBoard');
  const boardModal = document.getElementById('boardModal');
  const btnCloseBoard = document.getElementById('btnCloseBoard');
  const btnShowQr = document.getElementById('btnShowQr');
  const qrModal = document.getElementById('qrModal');
  const btnCloseQr = document.getElementById('btnCloseQr');
  const btnCopyUrl = document.getElementById('btnCopyUrl');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const btnDownloadQrPng = document.getElementById('btnDownloadQrPng');
  const qrCanvas = document.getElementById('qrCanvas');
  
  // Music Button
  const btnMusic = document.getElementById('btnMusic');
  const vinylDisc = document.getElementById('vinylDisc');
  const musicLabel = document.getElementById('musicLabel');

  // ===================================================
  // 3. ENVELOPE OPEN / CLOSE INTERACTION
  // ===================================================
  function openEnvelope() {
    envelope.classList.add('open');
    triggerCheerSound();
    
    // Start music automatically on user tap if not playing
    if (!musicPlaying) {
      toggleMusic();
    }

    setTimeout(() => {
      envelopeSection.classList.add('hidden');
      cardSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      burstParticles(window.innerWidth / 2, window.innerHeight / 2, 40);
    }, 850);
  }

  function closeCard() {
    cardSection.classList.add('hidden');
    envelopeSection.classList.remove('hidden');
    envelope.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  envelopeContainer.addEventListener('click', openEnvelope);
  envelopeContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
  btnCloseCard.addEventListener('click', closeCard);

  // ===================================================
  // 4. RECIPIENT & SENDER CUSTOMIZATION
  // ===================================================
  function updateLetter(recipientKey) {
    const data = wishesData[recipientKey] || wishesData.all;
    let html = `<p>${data.salutation}</p>`;
    data.paragraphs.forEach(para => {
      html += `<p>${para}</p>`;
    });
    letterBody.innerHTML = html;
  }

  recipientSelect.addEventListener('change', (e) => {
    updateLetter(e.target.value);
  });
  updateLetter('all');

  // Load saved sender name if any
  const savedName = localStorage.getItem('tri_an_sender_name');
  if (savedName) {
    senderNameDisplay.textContent = savedName;
  }
  senderNameDisplay.addEventListener('blur', () => {
    const text = senderNameDisplay.textContent.trim();
    if (text) {
      localStorage.setItem('tri_an_sender_name', text);
    }
  });

  // ===================================================
  // 5. WEB AUDIO API SYNTHESIZER (NHẠC DU DƯƠNG 20/11)
  // Procedural soothing piano chords & bell melody
  // Zero external dependencies, 100% reliable offline
  // ===================================================
  let audioCtx = null;
  let musicPlaying = false;
  let melodyTimer = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, time, duration, gainVal = 0.15, type = 'sine') {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    // Warm envelope
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(gainVal, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Pentatonic serene melody notes in Hz (C4, D4, E4, G4, A4, C5, D5, E5)
  const melodyNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00,
    523.25, 587.33, 659.25, 783.99, 880.00
  ];

  // A poetic chord progression for Teachers' Day
  const score = [
    // [Note indices in melodyNotes, duration in beats]
    [2, 1], [3, 1], [4, 1.5], [5, 2], [4, 1], [3, 1], [2, 2.5],
    [0, 1], [1, 1], [2, 1.5], [4, 2], [3, 1], [2, 1], [1, 2.5],
    [2, 1], [4, 1], [5, 1.5], [7, 2], [6, 1], [5, 1], [4, 2.5],
    [5, 1], [4, 1], [3, 1.5], [2, 1.5], [1, 1], [0, 3]
  ];

  let currentScoreIndex = 0;
  function scheduleMelody() {
    if (!musicPlaying || !audioCtx) return;

    const [noteIdx, beats] = score[currentScoreIndex];
    const freq = melodyNotes[noteIdx];
    const now = audioCtx.currentTime;
    const duration = beats * 0.7;

    // Main melodic note
    playTone(freq, now, duration * 1.3, 0.14, 'triangle');
    // Subtle chime harmonic
    playTone(freq * 2, now, duration * 0.8, 0.04, 'sine');
    // Gentle bass root chord every few beats
    if (currentScoreIndex % 3 === 0) {
      playTone(freq / 2, now, duration * 1.6, 0.12, 'sine');
    }

    currentScoreIndex = (currentScoreIndex + 1) % score.length;
    melodyTimer = setTimeout(scheduleMelody, beats * 650);
  }

  function toggleMusic() {
    initAudio();
    musicPlaying = !musicPlaying;

    if (musicPlaying) {
      vinylDisc.classList.add('spinning');
      musicLabel.textContent = 'Đang Phát';
      currentScoreIndex = 0;
      scheduleMelody();
    } else {
      vinylDisc.classList.remove('spinning');
      musicLabel.textContent = 'Bật Nhạc';
      if (melodyTimer) clearTimeout(melodyTimer);
    }
  }

  btnMusic.addEventListener('click', toggleMusic);

  function triggerCheerSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      // Cheerful chime chord
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        playTone(freq, now + idx * 0.08, 0.6, 0.12, 'sine');
      });
    } catch (e) {}
  }

  // ===================================================
  // 6. CELEBRATION (THẢ HOA TRI ÂN)
  // ===================================================
  btnCelebrate.addEventListener('click', (e) => {
    triggerCheerSound();
    
    // Burst particles from button coordinates
    const rect = btnCelebrate.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    burstParticles(x, y, 70);

    // Show toast
    cheerToast.classList.add('show');
    setTimeout(() => {
      cheerToast.classList.remove('show');
    }, 3200);
  });

  // ===================================================
  // 7. SHARE CARD
  // ===================================================
  btnShareCard.addEventListener('click', () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: 'Thiệp Tri Ân Thầy Cô • 20/11',
      text: 'Gửi ngàn lời chúc mừng chân thành và biết ơn sâu sắc tới Quý Thầy Cô nhân ngày 20/11!',
      url: currentUrl
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      // Fallback: open QR modal
      openQrModal();
    }
  });

  // ===================================================
  // 8. MODAL CONTROLS (BẢNG ĐEN & MÃ QR)
  // ===================================================
  btnToggleBoard.addEventListener('click', () => {
    boardModal.classList.remove('hidden');
  });
  btnCloseBoard.addEventListener('click', () => {
    boardModal.classList.add('hidden');
  });
  boardModal.addEventListener('click', (e) => {
    if (e.target === boardModal) boardModal.classList.add('hidden');
  });

  function openQrModal() {
    qrModal.classList.remove('hidden');
    drawQRCodeOnCanvas();
  }

  btnShowQr.addEventListener('click', openQrModal);
  btnCloseQr.addEventListener('click', () => {
    qrModal.classList.add('hidden');
  });
  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.add('hidden');
  });

  // Copy URL button
  btnCopyUrl.addEventListener('click', () => {
    shareUrlInput.select();
    navigator.clipboard.writeText(shareUrlInput.value).then(() => {
      const orig = btnCopyUrl.textContent;
      btnCopyUrl.textContent = 'Đã Chép!';
      btnCopyUrl.style.background = '#28a745';
      setTimeout(() => {
        btnCopyUrl.textContent = orig;
        btnCopyUrl.style.background = '';
      }, 2000);
    });
  });

  // Synchronize URL input with window.location if deployed
  if (window.location.protocol.startsWith('http')) {
    shareUrlInput.value = window.location.href;
  }

  // ===================================================
  // 9. QR CODE RENDER ON CANVAS (PURE JS)
  // ===================================================
  function drawQRCodeOnCanvas() {
    if (!window.QRCode) return;
    const targetUrl = shareUrlInput.value || 'https://taductoi1596-stack.github.io/tri-an-20-11/';
    
    const qr = new window.QRCode(0, 0);
    qr.addData(targetUrl);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const ctx = qrCanvas.getContext('2d');
    const width = qrCanvas.width;
    const height = qrCanvas.height;

    // Background white with margin
    const margin = 4;
    const totalModules = moduleCount + margin * 2;
    const cellSize = width / totalModules;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw QR modules with elegant rounded corners
    ctx.fillStyle = '#1e0c0c';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qr.isDark(r, c)) {
          const x = (c + margin) * cellSize;
          const y = (r + margin) * cellSize;
          ctx.fillRect(x, y, cellSize + 0.3, cellSize + 0.3);
        }
      }
    }

    // Mini center badge 20/11
    const centerSize = cellSize * 5.5;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize / 1.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8a101f';
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd97d';
    ctx.font = 'bold 13px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('20/11', centerX, centerY);
  }

  // Download QR as PNG
  btnDownloadQrPng.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ma-qr-tri-an-thay-co-20-11.png';
    link.href = qrCanvas.toDataURL('image/png');
    link.click();
  });

  // ===================================================
  // 10. CANVAS PARTICLE ENGINE (CÁNH HOA & BỤI PHẤN)
  // ===================================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle types: Petal, Sparkle, Chalk Dust, Heart
  const particles = [];
  const maxAmbientParticles = 40;

  // Colors for petals
  const petalColors = [
    '#ff4d6d', '#ff758f', '#ffb3c1', // Cherry/Rose pinks
    '#e63946', '#c1121f',             // Phượng đỏ
    '#ffd166', '#f4a261',             // Gold/Autumn petals
    '#ffffff'                         // Chalk sparkles
  ];

  class Particle {
    constructor(x, y, isBurst = false) {
      this.reset(x, y, isBurst);
    }

    reset(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : -20;
      this.size = Math.random() * 8 + 6;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.05;

      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 3;
        this.friction = 0.95;
        this.gravity = 0.25;
        this.alpha = 1;
        this.fade = Math.random() * 0.015 + 0.008;
        this.isBurst = true;
      } else {
        this.vx = (Math.random() - 0.3) * 1.5;
        this.vy = Math.random() * 1.5 + 1.2;
        this.friction = 1;
        this.gravity = 0;
        this.alpha = Math.random() * 0.6 + 0.4;
        this.fade = 0;
        this.isBurst = false;
        this.oscillation = Math.random() * Math.PI * 2;
      }
    }

    update() {
      if (this.isBurst) {
        this.vx *= this.friction;
        this.vy += this.gravity;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.fade;
      } else {
        this.oscillation += 0.02;
        this.x += this.vx + Math.sin(this.oscillation) * 0.8;
        this.y += this.vy;

        if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
          this.reset(Math.random() * width, -20, false);
        }
      }
      this.rotation += this.rotSpeed;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;

      // Draw graceful petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  // Populate initial ambient falling petals
  for (let i = 0; i < maxAmbientParticles; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // Distribute across screen initially
    particles.push(p);
  }

  function burstParticles(originX, originY, count = 50) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(originX, originY, true));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      if (p.isBurst && p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Initial render of QR canvas in background
  drawQRCodeOnCanvas();
});

