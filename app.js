/**
 * MANALI KHUNT - UI/UX & FRONTEND PORTFOLIO
 * Interactive Floating Tech Physics, Ambient Constellations & Rich Animations
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. SOUND FX ENGINE (Web Audio API - Pure synthesized audio, zero assets)
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('mk_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playPop() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }

    playChime() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major chord
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 0.25);
      });
    }

    playWhoosh() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('mk_muted', this.muted);
      return this.muted;
    }
  }

  const sound = new SoundEngine();

  // =========================================================================
  // 2. CUSTOM GLOWING CURSOR & MAGNETIC EFFECT
  // =========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = -100, mouseY = -100;
  let glowX = -100, glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    if (cursorGlow) {
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover expansion on interactive elements
  const hoverTargets = 'a, button, input, textarea, .quiz-opt-btn, .swatch, .mock-card, .satellite, .skill-chip';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorGlow?.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorGlow?.classList.remove('hovering');
    }
  });

  // =========================================================================
  // 3. AMBIENT BACKGROUND CONSTELLATION CANVAS
  // =========================================================================
  const ambientCanvas = document.getElementById('ambientCanvas');
  if (ambientCanvas) {
    const actx = ambientCanvas.getContext('2d');
    let width = ambientCanvas.width = window.innerWidth;
    let height = ambientCanvas.height = window.innerHeight;

    const stars = [];
    const STAR_COUNT = Math.min(65, Math.floor((width * height) / 18000));

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    function renderAmbient() {
      actx.clearRect(0, 0, width, height);

      // Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        actx.beginPath();
        actx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        actx.fillStyle = `rgba(167, 139, 250, ${s.alpha})`;
        actx.fill();

        // Connect near mouse
        const dx = mouseX - s.x;
        const dy = mouseY - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          actx.beginPath();
          actx.moveTo(s.x, s.y);
          actx.lineTo(mouseX, mouseY);
          actx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`;
          actx.stroke();
        }
      }

      requestAnimationFrame(renderAmbient);
    }
    renderAmbient();
  }

  // =========================================================================
  // 4. FLOATING TECH STACK INTERACTIVE PHYSICS ENGINE (Zero-G Cosmos)
  // =========================================================================
  const techCanvas = document.getElementById('techPhysicsCanvas');
  const techTooltip = document.getElementById('techTooltip');
  const tooltipIcon = document.getElementById('tooltipIcon');
  const tooltipName = document.getElementById('tooltipName');
  const tooltipCat = document.getElementById('tooltipCat');
  const tooltipDesc = document.getElementById('tooltipDesc');
  const activePillsCount = document.getElementById('activePillsCount');

  // Complete resume tech stack dataset
  const TECH_SKILLS = [
    // UX Design
    { name: 'UX Research', cat: 'ux', icon: '🔍', desc: 'Empathy mapping, persona creation & reducing decision fatigue.' },
    { name: 'Wireframing', cat: 'ux', icon: '📐', desc: 'Low and high-fidelity skeletal layouts for intuitive user journeys.' },
    { name: 'Prototyping', cat: 'ux', icon: '⚡', desc: 'Interactive clickable flows validating usability before code.' },
    { name: 'Usability Testing', cat: 'ux', icon: '🧪', desc: 'Validating end-to-end user navigation and eliminating friction.' },
    { name: 'Journey Mapping', cat: 'ux', icon: '🗺️', desc: 'Optimizing touchpoints from onboarding to checkout.' },
    { name: 'E-Commerce UX', cat: 'ux', icon: '🛍️', desc: 'Cart, wishlist, skin quiz & high-converting checkout flows.' },
    { name: 'Brand Identity', cat: 'ux', icon: '💎', desc: 'Typography hierarchy, botanical palette & aesthetic consistency.' },
    { name: 'Interaction Design', cat: 'ux', icon: '✨', desc: 'Micro-animations, state changes & WCAG 2.1 compliance.' },

    // Design Tools
    { name: 'Figma', cat: 'design-tools', icon: '🎨', desc: '50+ screens designed, auto-layout, design systems & components.' },
    { name: 'FigJam', cat: 'design-tools', icon: '📝', desc: 'User flows, affinity diagramming & collaborative brainstorming.' },
    { name: 'Adobe Photoshop', cat: 'design-tools', icon: '🖼️', desc: 'High-res asset retouching, texture blending & visual polish.' },
    { name: 'Canva', cat: 'design-tools', icon: '✨', desc: 'Social assets, presentation pitch decks & fast layouts.' },
    { name: 'Adobe XD', cat: 'design-tools', icon: '🖥️', desc: 'UI architecture, interactive transitions & wireframing.' },

    // Frontend
    { name: 'React.js', cat: 'frontend', icon: '⚛️', desc: 'Modular components, hooks, dynamic states in Netflix Clone.' },
    { name: 'JavaScript ES6+', cat: 'frontend', icon: '⚡', desc: 'Async, array methods, DOM manipulation & modern syntax.' },
    { name: 'HTML5', cat: 'frontend', icon: '🌐', desc: 'Semantic markup, accessibility, SEO & modern web standards.' },
    { name: 'CSS3', cat: 'frontend', icon: '🎨', desc: 'Glassmorphism, animations, keyframes & custom variables.' },
    { name: 'Flexbox & Grid', cat: 'frontend', icon: '📐', desc: 'Responsive multi-tier responsive layouts across screens.' },
    { name: 'Responsive Design', cat: 'frontend', icon: '📱', desc: 'Mobile-first fluid interfaces adapting seamlessly.' },
    { name: 'Python', cat: 'frontend', icon: '🐍', desc: 'OOP, core logic building & CodSoft Virtual Internship.' },

    // Tools & Platforms
    { name: 'Git', cat: 'tools', icon: '🌿', desc: 'Version control, branch management & feature tracking.' },
    { name: 'GitHub', cat: 'tools', icon: '🐙', desc: 'Open source repositories, pull requests & code collaboration.' },
    { name: 'VS Code', cat: 'tools', icon: '💻', desc: 'Primary development IDE with linting & dev shortcuts.' },
    { name: 'Figma Dev Mode', cat: 'tools', icon: '🔍', desc: 'Design-to-code token inspection, CSS handoff & asset exports.' },
    { name: 'Figma Prototyping', cat: 'tools', icon: '🚀', desc: 'Smart animate, interactive variants & clickable screens.' },
    { name: 'Postman', cat: 'tools', icon: '📬', desc: 'API endpoint inspection, requests testing & payload validation.' },

    // CS Fundamentals
    { name: 'Data Structures', cat: 'cs', icon: '🌳', desc: 'Arrays, LinkedLists, Trees, HashMaps with 100+ LeetCode solved.' },
    { name: 'Algorithms (DSA)', cat: 'cs', icon: '⚡', desc: 'Two Pointers, Binary Search, Sorting & Time Complexity.' },
    { name: 'OOP', cat: 'cs', icon: '📦', desc: 'Encapsulation, Inheritance, Polymorphism & Abstraction in Python/C++.' },
    { name: 'DBMS', cat: 'cs', icon: '🗄️', desc: 'Relational database concepts, normalization & SQL querying.' },
    { name: 'Operating Systems', cat: 'cs', icon: '⚙️', desc: 'Process scheduling, memory management & concurrency.' },
    { name: 'Computer Networks', cat: 'cs', icon: '🌐', desc: 'TCP/IP protocols, HTTP/HTTPS & OSI model architecture.' },
    { name: 'HCI Coursework', cat: 'cs', icon: '👁️', desc: 'Human-Computer Interaction principles & cognitive ergonomics.' },

    // Soft Skills
    { name: 'Problem Solving', cat: 'soft', icon: '💡', desc: 'Structured analytical thinking & self-directed debugging.' },
    { name: 'Attention to Detail', cat: 'soft', icon: '🎯', desc: 'Pixel-perfect spacing, typography alignment & clean margins.' },
    { name: 'Team Collaboration', cat: 'soft', icon: '🤝', desc: 'Cross-functional synergy between designers and developers.' },
    { name: 'Time Management', cat: 'soft', icon: '⏳', desc: 'Sprint planning, project milestones & deliverable adherence.' },
    { name: 'Communication', cat: 'soft', icon: '💬', desc: 'Stakeholder presentations, design walk-throughs & feedback.' }
  ];

  if (techCanvas) {
    const tctx = techCanvas.getContext('2d');
    let cWidth = 0, cHeight = 0;

    function resizeTechCanvas() {
      const rect = techCanvas.parentElement.getBoundingClientRect();
      cWidth = techCanvas.width = rect.width;
      cHeight = techCanvas.height = rect.height;
    }
    resizeTechCanvas();
    window.addEventListener('resize', resizeTechCanvas);

    // Color mapping by category
    const CAT_COLORS = {
      'ux': { bg: 'rgba(236, 72, 153, 0.15)', border: '#ec4899', text: '#f472b6' },
      'design-tools': { bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', text: '#c084fc' },
      'frontend': { bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4', text: '#38bdf8' },
      'tools': { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#60a5fa' },
      'cs': { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399' },
      'soft': { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fbbf24' }
    };

    // Node objects with physics state
    class TechNode {
      constructor(data, index, total) {
        this.data = data;
        this.index = index;
        this.label = data.name;
        this.icon = data.icon;
        this.category = data.cat;
        this.colors = CAT_COLORS[data.cat] || { bg: 'rgba(255,255,255,0.1)', border: '#8b5cf6', text: '#fff' };

        // Measure text for pill width
        tctx.font = '600 13px Plus Jakarta Sans, sans-serif';
        const textWidth = tctx.measureText(`${this.icon} ${this.label}`).width;
        this.w = Math.max(90, textWidth + 30);
        this.h = 36;
        this.radius = 18;

        // Position nodes in loose spiral or random
        const angle = (index / total) * Math.PI * 2 * 3;
        const radiusDist = 40 + (index / total) * (Math.min(cWidth, cHeight) * 0.4);
        this.x = cWidth / 2 + Math.cos(angle) * radiusDist + (Math.random() - 0.5) * 50;
        this.y = cHeight / 2 + Math.sin(angle) * radiusDist + (Math.random() - 0.5) * 50;

        // Velocity
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;

        this.targetScale = 1;
        this.scale = 1;
        this.isHovered = false;
        this.isDragged = false;
        this.visible = true;
      }

      update(gravityMode, isGravityOn, vortexMode) {
        if (!this.visible && this.targetScale === 0) return;

        // Smooth scale transition (for category filtering)
        this.scale += (this.targetScale - this.scale) * 0.1;

        if (this.isDragged) return;

        // Vortex force pulling towards center
        if (vortexMode) {
          const dx = cWidth / 2 - this.x;
          const dy = cHeight / 2 - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const force = 0.4;
          this.vx += Math.cos(angle) * force - Math.sin(angle) * 0.8;
          this.vy += Math.sin(angle) * force + Math.cos(angle) * 0.8;
        }

        // Downward gravity mode (ball-pit style)
        if (isGravityOn) {
          this.vy += 0.35;
        } else {
          // Zero-G ambient wander
          this.vx += (Math.random() - 0.5) * 0.1;
          this.vy += (Math.random() - 0.5) * 0.1;
        }

        // Apply friction
        this.vx *= 0.985;
        this.vy *= 0.985;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary collision with bounce
        const halfW = (this.w * this.scale) / 2;
        const halfH = (this.h * this.scale) / 2;

        if (this.x - halfW < 0) {
          this.x = halfW;
          this.vx = Math.abs(this.vx) * 0.75;
        } else if (this.x + halfW > cWidth) {
          this.x = cWidth - halfW;
          this.vx = -Math.abs(this.vx) * 0.75;
        }

        if (this.y - halfH < 0) {
          this.y = halfH;
          this.vy = Math.abs(this.vy) * 0.75;
        } else if (this.y + halfH > cHeight) {
          this.y = cHeight - halfH;
          this.vy = -Math.abs(this.vy) * 0.7;
        }
      }

      draw(ctx) {
        if (this.scale <= 0.05) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        const hw = this.w / 2;
        const hh = this.h / 2;
        const r = this.radius;

        // Glow when hovered
        if (this.isHovered || this.isDragged) {
          ctx.shadowColor = this.colors.border;
          ctx.shadowBlur = 18;
        } else {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 8;
        }

        // Rounded pill shape
        ctx.beginPath();
        ctx.moveTo(-hw + r, -hh);
        ctx.lineTo(hw - r, -hh);
        ctx.quadraticCurveTo(hw, -hh, hw, -hh + r);
        ctx.lineTo(hw, hh - r);
        ctx.quadraticCurveTo(hw, hh, hw - r, hh);
        ctx.lineTo(-hw + r, hh);
        ctx.quadraticCurveTo(-hw, hh, -hw, hh - r);
        ctx.lineTo(-hw, -hh + r);
        ctx.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
        ctx.closePath();

        // Fill background
        ctx.fillStyle = this.isHovered ? 'rgba(255, 255, 255, 0.15)' : this.colors.bg;
        ctx.fill();

        // Stroke border
        ctx.lineWidth = this.isHovered ? 2 : 1.2;
        ctx.strokeStyle = this.isHovered ? '#ffffff' : this.colors.border;
        ctx.stroke();

        // Text & Icon
        ctx.shadowBlur = 0;
        ctx.font = '600 13px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = this.isHovered ? '#ffffff' : this.colors.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.icon}  ${this.label}`, 0, 1);

        ctx.restore();
      }

      contains(px, py) {
        const hw = (this.w * this.scale) / 2;
        const hh = (this.h * this.scale) / 2;
        return (
          px >= this.x - hw &&
          px <= this.x + hw &&
          py >= this.y - hh &&
          py <= this.y + hh
        );
      }
    }

    const nodes = TECH_SKILLS.map((item, idx) => new TechNode(item, idx, TECH_SKILLS.length));

    let isGravityOn = false;
    let vortexMode = false;
    let activeCategory = 'all';

    // Dragging interaction state
    let draggedNode = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastDragMouseX = 0;
    let lastDragMouseY = 0;

    function getCanvasCoordinates(e) {
      const rect = techCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        screenX: clientX,
        screenY: clientY
      };
    }

    // Pointer events for Canvas
    function onPointerDown(e) {
      const coords = getCanvasCoordinates(e);
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.visible && n.contains(coords.x, coords.y)) {
          draggedNode = n;
          n.isDragged = true;
          dragOffsetX = coords.x - n.x;
          dragOffsetY = coords.y - n.y;
          lastDragMouseX = coords.x;
          lastDragMouseY = coords.y;
          sound.playPop();
          break;
        }
      }
    }

    function onPointerMove(e) {
      const coords = getCanvasCoordinates(e);

      if (draggedNode) {
        draggedNode.x = coords.x - dragOffsetX;
        draggedNode.y = coords.y - dragOffsetY;
        draggedNode.vx = (coords.x - lastDragMouseX) * 0.7;
        draggedNode.vy = (coords.y - lastDragMouseY) * 0.7;
        lastDragMouseX = coords.x;
        lastDragMouseY = coords.y;

        // Hide tooltip while dragging
        techTooltip?.classList.remove('visible');
        return;
      }

      // Hover check for tooltips
      let foundHover = null;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.visible && n.contains(coords.x, coords.y)) {
          foundHover = n;
          n.isHovered = true;
        } else {
          n.isHovered = false;
        }
      }

      if (foundHover && techTooltip) {
        tooltipIcon.textContent = foundHover.icon;
        tooltipName.textContent = foundHover.label;
        tooltipCat.textContent = foundHover.data.cat.toUpperCase();
        tooltipDesc.textContent = foundHover.data.desc;

        // Position tooltip near cursor
        techTooltip.style.left = `${Math.min(window.innerWidth - 300, coords.screenX + 15)}px`;
        techTooltip.style.top = `${Math.max(20, coords.screenY - 70)}px`;
        techTooltip.classList.add('visible');
      } else {
        techTooltip?.classList.remove('visible');
      }
    }

    function onPointerUp() {
      if (draggedNode) {
        draggedNode.isDragged = false;
        sound.playWhoosh();
        draggedNode = null;
      }
    }

    techCanvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    techCanvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Pill to pill gentle collision resolution
    function resolveCollisions() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          if (!n1.visible || !n2.visible) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (n1.radius + n2.radius) * 1.1;

          if (dist < minDist && dist > 0) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;

            if (!n1.isDragged) {
              n1.x -= nx * overlap * 0.5;
              n1.y -= ny * overlap * 0.5;
              n1.vx -= nx * 0.15;
              n1.vy -= ny * 0.15;
            }
            if (!n2.isDragged) {
              n2.x += nx * overlap * 0.5;
              n2.y += ny * overlap * 0.5;
              n2.vx += nx * 0.15;
              n2.vy += ny * 0.15;
            }
          }
        }
      }
    }

    // Animation Loop
    function renderPhysics() {
      tctx.clearRect(0, 0, cWidth, cHeight);

      resolveCollisions();

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(isGravityOn ? 'gravity' : 'zero-g', isGravityOn, vortexMode);
        nodes[i].draw(tctx);
      }

      requestAnimationFrame(renderPhysics);
    }
    renderPhysics();

    // Controls: Filter Categories
    const filterTabs = document.getElementById('techCategoryFilters');
    if (filterTabs) {
      filterTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        sound.playPop();
        filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeCategory = btn.dataset.category;
        let count = 0;

        nodes.forEach(n => {
          if (activeCategory === 'all' || n.category === activeCategory) {
            n.targetScale = 1;
            n.visible = true;
            count++;
          } else {
            n.targetScale = 0;
            n.visible = false;
          }
        });

        if (activePillsCount) {
          activePillsCount.textContent = `${count} Floating Technologies Active`;
        }
      });
    }

    // Gravity Toggle
    const toggleGravityBtn = document.getElementById('toggleGravityBtn');
    if (toggleGravityBtn) {
      toggleGravityBtn.addEventListener('click', () => {
        isGravityOn = !isGravityOn;
        vortexMode = false;
        sound.playWhoosh();
        const textSpan = toggleGravityBtn.querySelector('.text');
        const iconSpan = toggleGravityBtn.querySelector('.icon');
        if (isGravityOn) {
          textSpan.textContent = 'Ball-Pit Gravity';
          iconSpan.textContent = '🍎';
          toggleGravityBtn.style.borderColor = 'var(--accent-primary)';
        } else {
          textSpan.textContent = 'Zero-G Drift';
          iconSpan.textContent = '🪐';
          toggleGravityBtn.style.borderColor = '';
        }
      });
    }

    // Repel / Disperse
    const repelPillsBtn = document.getElementById('repelPillsBtn');
    if (repelPillsBtn) {
      repelPillsBtn.addEventListener('click', () => {
        sound.playChime();
        vortexMode = false;
        nodes.forEach(n => {
          const angle = Math.random() * Math.PI * 2;
          const power = Math.random() * 12 + 6;
          n.vx = Math.cos(angle) * power;
          n.vy = Math.sin(angle) * power;
        });
      });
    }

    // Orbit Vortex
    const vortexPillsBtn = document.getElementById('vortexPillsBtn');
    if (vortexPillsBtn) {
      vortexPillsBtn.addEventListener('click', () => {
        vortexMode = !vortexMode;
        isGravityOn = false;
        sound.playWhoosh();
        if (vortexMode) {
          vortexPillsBtn.style.borderColor = 'var(--accent-primary)';
          vortexPillsBtn.style.background = 'rgba(139, 92, 246, 0.2)';
        } else {
          vortexPillsBtn.style.borderColor = '';
          vortexPillsBtn.style.background = '';
        }
      });
    }

    // Reset Simulation
    const resetPhysicsBtn = document.getElementById('resetPhysicsBtn');
    if (resetPhysicsBtn) {
      resetPhysicsBtn.addEventListener('click', () => {
        sound.playPop();
        isGravityOn = false;
        vortexMode = false;
        if (toggleGravityBtn) {
          toggleGravityBtn.querySelector('.text').textContent = 'Zero-G Drift';
          toggleGravityBtn.querySelector('.icon').textContent = '🪐';
          toggleGravityBtn.style.borderColor = '';
        }
        if (vortexPillsBtn) {
          vortexPillsBtn.style.borderColor = '';
          vortexPillsBtn.style.background = '';
        }

        nodes.forEach((n, idx) => {
          const angle = (idx / nodes.length) * Math.PI * 2 * 3;
          const radiusDist = 40 + (idx / nodes.length) * (Math.min(cWidth, cHeight) * 0.4);
          n.x = cWidth / 2 + Math.cos(angle) * radiusDist;
          n.y = cHeight / 2 + Math.sin(angle) * radiusDist;
          n.vx = (Math.random() - 0.5) * 1.5;
          n.vy = (Math.random() - 0.5) * 1.5;
          n.targetScale = 1;
          n.visible = true;
        });
      });
    }
  }

  // =========================================================================
  // 5. DYNAMIC TYPING TITLE IN HERO
  // =========================================================================
  const dynamicRoleText = document.getElementById('dynamicRoleText');
  if (dynamicRoleText) {
    const roles = [
      'UI/UX Development',
      'Figma Design Systems',
      'Responsive React.js Interfaces',
      'Human-Centered Interaction',
      'Interactive Clickable Prototypes'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        dynamicRoleText.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        dynamicRoleText.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentRole.length) {
        speed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400; // Pause before typing next
      }

      setTimeout(typeLoop, speed);
    }
    setTimeout(typeLoop, 1000);
  }

  // =========================================================================
  // 6. ANIMATED NUMBER COUNTERS (Intersection Observer)
  // =========================================================================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeProgress * target;

            counter.textContent = decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = decimals > 0 ? target.toFixed(decimals) : target;
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsGrid = document.querySelector('.hero-stats-grid');
  if (statsGrid) {
    counterObserver.observe(statsGrid);
  }

  // =========================================================================
  // 7. 3D TILT EFFECT & SPECULAR GLARE ON HOVER
  // =========================================================================
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // =========================================================================
  // 8. SCROLL PROGRESS BAR & ACTIVE NAV HIGHLIGHT
  // =========================================================================
  const progressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (window.scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // Active Section Tracking
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 9. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    sound.playChime();
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 1-Click Copy Handlers
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast('Copied to clipboard!');
      });
    });
  });

  const copyContactQuick = document.getElementById('copyContactQuick');
  if (copyContactQuick) {
    copyContactQuick.addEventListener('click', () => {
      navigator.clipboard.writeText('manalikhunt2323@gmail.com').then(() => {
        showToast('Email address copied: manalikhunt2323@gmail.com');
      });
    });
  }

  // =========================================================================
  // 10. MODALS LOGIC (Case Study, Netflix Demo, Resume, Verification)
  // =========================================================================
  const beautyModal = document.getElementById('beautyModal');
  const netflixModal = document.getElementById('netflixModal');
  const resumeModal = document.getElementById('resumeModal');
  const certModal = document.getElementById('certModal');

  function openModal(modal) {
    if (!modal) return;
    sound.playPop();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    sound.playPop();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close when clicking modal backdrop or close icon
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close')) {
        closeModal(modal);
      }
    });
  });

  // Project Modals Trigger
  document.querySelectorAll('.preview-modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      if (proj === 'beauty') openModal(beautyModal);
      if (proj === 'netflix') openModal(netflixModal);
    });
  });

  // Resume Modal Trigger
  const quickResumeBtn = document.getElementById('quickResumeBtn');
  if (quickResumeBtn) {
    quickResumeBtn.addEventListener('click', () => openModal(resumeModal));
  }

  const copyResumeLinkBtn = document.getElementById('copyResumeLinkBtn');
  if (copyResumeLinkBtn) {
    copyResumeLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('Manali Khunt | UI/UX Developer | manalikhunt2323@gmail.com | +91-9913716507 | linkedin.com/in/manali-khunt').then(() => {
        showToast('Manali Khunt contact details copied!');
      });
    });
  }

  // Certificate Verification Modal Triggers
  const certDetails = {
    'codsoft': {
      title: 'Python Programming Virtual Intern',
      issuer: 'CodSoft • Remote Internship',
      details: 'Verified completion of 4-week Python programming internship in May 2025. Demonstrated core competence in Data Structures, Object-Oriented Programming (OOP), and algorithmic logic.'
    },
    'frontend': {
      title: 'Modern Frontend Development',
      issuer: 'Udemy Verified Credential (2025)',
      details: 'Mastery in React.js, JavaScript ES6+, CSS Flexbox/Grid, and responsive UI components. Applied across 3 capstone production-level dashboard projects.'
    },
    'figma': {
      title: 'Figma for User Interface & UX Design',
      issuer: 'Udemy – Sayman Creative Institute (Sep 2026)',
      details: 'Hands-on certification covering Figma auto-layout, atomic design systems, interactive prototyping, micro-animations, and design-to-development handoffs.'
    }
  };

  document.querySelectorAll('.verify-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const certKey = btn.getAttribute('data-cert');
      const data = certDetails[certKey];
      if (data && certModal) {
        document.getElementById('certModalTitle').textContent = data.title;
        document.getElementById('certModalIssuer').textContent = data.issuer;
        document.getElementById('certModalDetails').textContent = data.details;
        openModal(certModal);
      }
    });
  });

  const closeCertModalBtn = document.getElementById('closeCertModalBtn');
  if (closeCertModalBtn) {
    closeCertModalBtn.addEventListener('click', () => closeModal(certModal));
  }

  // Beauty App Mini Skin Quiz Logic
  const openQuizDemoBtn = document.getElementById('openQuizDemoBtn');
  if (openQuizDemoBtn) {
    openQuizDemoBtn.addEventListener('click', () => {
      openModal(beautyModal);
      const demoEl = document.querySelector('.interactive-demo-card');
      demoEl?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const quizOptions = document.getElementById('quizOptions');
  const quizResult = document.getElementById('quizResult');
  const quizResultText = document.getElementById('quizResultText');
  const resetQuizBtn = document.getElementById('resetQuizBtn');

  if (quizOptions) {
    quizOptions.addEventListener('click', (e) => {
      const optBtn = e.target.closest('.quiz-opt-btn');
      if (!optBtn) return;

      sound.playChime();
      const concern = optBtn.getAttribute('data-concern');
      let rec = '';
      if (concern === 'Hydration') rec = 'Botanical Radiance Serum with Hyaluronic Essence & Rosehip Oil.';
      else if (concern === 'Radiance') rec = 'Vitamin C Revitalizing Spa Elixir & Brightening Daily Veil.';
      else if (concern === 'Calming') rec = 'Centella Soothing Recovery Balm & Chamomile Calming Mist.';
      else rec = 'Niacinamide Pore-Refining Clarifying Treatment & Herbal Toner.';

      quizResultText.textContent = rec;
      quizOptions.classList.add('hidden');
      quizResult.classList.remove('hidden');
    });
  }

  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', () => {
      sound.playPop();
      quizResult.classList.add('hidden');
      quizOptions.classList.remove('hidden');
    });
  }

  // =========================================================================
  // 11. AUDIO & THEME CONTROLS
  // =========================================================================
  const audioToggle = document.getElementById('audioToggle');
  const audioOnIcon = audioToggle?.querySelector('.audio-on-icon');
  const audioOffIcon = audioToggle?.querySelector('.audio-off-icon');

  function updateAudioIcons(muted) {
    if (muted) {
      audioOnIcon?.classList.add('hidden');
      audioOffIcon?.classList.remove('hidden');
    } else {
      audioOnIcon?.classList.remove('hidden');
      audioOffIcon?.classList.add('hidden');
    }
  }
  updateAudioIcons(sound.muted);

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      updateAudioIcons(isMuted);
      showToast(isMuted ? 'Sound FX Muted' : 'Sound FX Enabled');
    });
  }

  // Theme Dropdown & Switcher
  const themeToggle = document.getElementById('themeToggle');
  const themeMenu = document.getElementById('themeMenu');

  if (themeToggle && themeMenu) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('open');
      sound.playPop();
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('open');
    });

    themeMenu.querySelectorAll('.theme-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.getAttribute('data-theme-val');
        document.documentElement.setAttribute('data-theme', val);
        localStorage.setItem('mk_theme', val);
        sound.playChime();
        showToast(`Theme switched to ${opt.textContent.trim()}`);
        themeMenu.classList.remove('open');
      });
    });
  }

  // Restore saved theme
  const savedTheme = localStorage.getItem('mk_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      sound.playPop();
    });

    mobileDrawer.querySelectorAll('.mob-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // =========================================================================
  // 12. CONTACT MESSAGE FORM SUBMISSION (Simulation with Feedback)
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitMessageBtn');
      const senderName = document.getElementById('senderName').value;

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending Message...</span>';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        sound.playChime();
        showToast(`Thank you, ${senderName}! Your message was delivered successfully.`);
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Message Sent! ✨</span>';
          setTimeout(() => {
            submitBtn.innerHTML = `
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            `;
            submitBtn.disabled = false;
          }, 2500);
        }
      }, 900);
    });
  }

  // Year in footer
  const currentYear = document.getElementById('currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

})();
