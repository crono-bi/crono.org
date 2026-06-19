<template>
  <div class="maintenance-hero">
    <!-- Background Grid Pattern -->
    <div class="bg-grid"></div>

    <!-- Main Content -->
    <div class="hero-content">
      <img src="/images/crono.webp" alt="Crono" class="hero-logo" />
      <div class="badge">NUEVA VERSIÓN</div>
      
      <h1 class="hero-title">
        VAMOS A CAMBIAR EL MODO<br>
        EN QUE LAS EMPRESAS<br>
        <span class="gradient-text">TRABAJAN CON SUS DATOS</span>
      </h1>
      
      <p class="hero-subtitle">
        15 de Septiembre de 2026 a las 10:00h
      </p>
      
      <Countdown />
      
      <div class="features-preview">
        <div class="feature-item">
          <div class="feature-icon">&#127912;</div>
          <span>Nuevo Diseño</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">&#9889;</div>
          <span>Más Rápido</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">&#128640;</div>
          <span>Playground</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">&#9881;&#65039;</div>
          <span>Multi-Engine</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">&#128274;</div>
          <span>Más Seguro</span>
        </div>
      </div>
      
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
  components: {
    Countdown
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

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 2rem;
}

.hero-logo {
  display: block;
  width: 240px;
  height: auto;
  margin: 0 auto 1.5rem auto;
  filter: brightness(0) invert(1) drop-shadow(0 4px 20px rgba(0, 124, 204, 0.4));
  animation: logoFloat 4s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.badge {
  display: inline-block;
  background: linear-gradient(90deg, #007bcc, #00d4ff);
  color: white;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 2rem;
  animation: badgePulse 2s ease-in-out infinite;
  box-shadow: 0 4px 15px rgba(0, 124, 204, 0.4);
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(90deg, #00d4ff, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease infinite;
  background-size: 200% auto;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  font-weight: 400;
}

.features-preview {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 3rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
}

.feature-icon {
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.hero-footer {
  margin-top: 3rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .hero-logo { width: 140px; margin-bottom: 1rem; }
  .hero-title { font-size: 1.75rem; }
  .hero-footer { margin-top: 2rem; font-size: 0.8rem; }
  .features-preview { gap: 1rem; flex-wrap: wrap; }
  .feature-item { font-size: 0.8rem; }
  .feature-icon { width: 40px; height: 40px; font-size: 1.2rem; }
  .orb-1, .orb-2 { width: 200px; height: 200px; }
}
</style>
