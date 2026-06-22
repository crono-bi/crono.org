<template>
  <div class="maintenance-hero">
    <!-- Background Grid Pattern -->
    <div class="bg-grid"></div>

    <!-- Main Content -->
    <div class="hero-content">
      <img src="/images/crono.webp" alt="Crono" class="hero-logo" />
      <div class="badge">NUEVA VERSIÓN</div>
      
      <div class="hero-title-wrap">
        <transition name="slide-fade" mode="out-in">
          <h1 class="hero-title" :key="currentSlide">
            <span class="slide-line">{{ slides[currentSlide].line1 }}</span><br />
            <span class="slide-line">{{ slides[currentSlide].line2 }}</span><br />
            <span class="gradient-text">{{ slides[currentSlide].highlight }}</span>
          </h1>
        </transition>
        <div class="slide-dots">
          <button
            v-for="(s, i) in slides"
            :key="i"
            class="slide-dot"
            :class="{ active: i === currentSlide }"
            @click="currentSlide = i"
          />
        </div>
      </div>
      
      <p class="hero-subtitle">
        15 de Septiembre de 2026 a las 10:00h
      </p>
      
      <Countdown />
      
      
      <div class="hero-footer">
        Something big is coming from Crono ❤️
      </div>
    </div>
    
    <!-- Gradient Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
</template>

<script>
import Countdown from './Countdown.vue'

export default {
  name: 'MaintenancePage',
  components: { Countdown },
  data() {
    return {
      currentSlide: 0,
      slides: [
        {
          line1: 'VAMOS A CAMBIAR EL MODO',
          line2: 'EN QUE LAS EMPRESAS',
          highlight: 'TRABAJAN CON SUS DATOS'
        },
        {
          line1: 'ESCRÍBELO UNA VEZ.',
          line2: 'CÁRGALO EN',
          highlight: 'CUALQUIER MOTOR SQL'
        },
        {
          line1: 'PATRONES DE CARGA DWH',
          line2: 'CLONE, UPSERT, HISTORY…',
          highlight: 'TODO AUTOMÁTICO'
        },
        {
          line1: 'ECOSISTEMA BI COMPLETO',
          line2: 'DESDE LA ETL',
          highlight: 'A LA PRESENTACIÓN'
        },
        {
          line1: 'ETL, ANÁLISIS Y SEMÁNTICA',
          line2: 'TODO EN',
          highlight: 'UNA SOLA PLATAFORMA'
        }
      ],
      slideTimer: null
    }
  },
  mounted() {
    this.slideTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    }, 4000)
  },
  beforeDestroy() {
    clearInterval(this.slideTimer)
  }
}
</script>

<style scoped>
.maintenance-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a1628;
  overflow: hidden;
}

/* Grid pattern background - mas visible */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 124, 204, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 124, 204, 0.15) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 25s linear infinite;
}

@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

/* Gradient Orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orbFloat 10s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #007bcc 0%, transparent 70%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #00d4ff 0%, transparent 70%);
  bottom: -50px;
  right: -50px;
  animation-delay: 3s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 6s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* ── Hero Content ── */
.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  width: 100%;
  max-width: 820px;
  padding: clamp(1.5rem, 5vw, 3rem) clamp(1.25rem, 6vw, 2.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Logo ── */
.hero-logo {
  display: block;
  width: clamp(120px, 28vw, 220px);
  height: auto;
  margin: 0 auto clamp(1rem, 3vw, 1.5rem) auto;
  filter: brightness(0) invert(1) drop-shadow(0 4px 20px rgba(0, 124, 204, 0.4));
  animation: logoFloat 4s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ── Badge ── */
.badge {
  display: inline-block;
  background: linear-gradient(90deg, #007bcc, #00d4ff);
  color: white;
  padding: 6px 18px;
  border-radius: 50px;
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: clamp(1.25rem, 4vw, 2rem);
  animation: badgePulse 2s ease-in-out infinite;
  box-shadow: 0 4px 15px rgba(0, 124, 204, 0.4);
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* ── Carousel title ── */
.hero-title-wrap {
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  min-height: clamp(130px, 25vw, 200px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-title {
  font-size: clamp(1.6rem, 5.5vw, 3rem);
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.slide-line {
  display: inline;
}

/* ── Dots ── */
.slide-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.75rem;
}

.slide-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 0;
  transition: background 0.3s, transform 0.3s;
  /* Bigger tap target on touch */
  position: relative;
}

.slide-dot::after {
  content: '';
  position: absolute;
  inset: -8px;
}

.slide-dot.active {
  background: #00d4ff;
  transform: scale(1.3);
}

/* ── Transitions ── */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.slide-fade-enter {
  opacity: 0;
  transform: translateY(12px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ── Gradient text ── */
.gradient-text {
  background: linear-gradient(90deg, #00d4ff, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease infinite;
  background-size: 200% auto;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ── Subtitle ── */
.hero-subtitle {
  font-size: clamp(0.9rem, 2.8vw, 1.15rem);
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: clamp(1.25rem, 4vw, 2rem);
  font-weight: 400;
  letter-spacing: 0.01em;
}

/* ── Footer ── */
.hero-footer {
  margin-top: clamp(1.5rem, 5vw, 3rem);
  font-size: clamp(0.78rem, 2vw, 0.9rem);
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.04em;
}

/* ── Orbs: scale down on small screens ── */
@media (max-width: 480px) {
  .orb-1 { width: 220px; height: 220px; top: -60px; left: -80px; }
  .orb-2 { width: 180px; height: 180px; }
  .orb-3 { width: 150px; height: 150px; }
  .bg-grid { background-size: 40px 40px; }
}
</style>
