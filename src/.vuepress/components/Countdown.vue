<template>
  <div>
    <div v-if="!finished" class="countdown">
      <div class="countdown-item">
        <span class="countdown-number">{{ formattedDays }}</span>
        <span class="countdown-label">DÍAS</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ formattedHours }}</span>
        <span class="countdown-label">HORAS</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ formattedMinutes }}</span>
        <span class="countdown-label">MIN</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ formattedSeconds }}</span>
        <span class="countdown-label">SEG</span>
      </div>
    </div>
    <div v-else class="countdown-finished">
      <span class="finished-text">¡Ya disponible!</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Countdown',
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDate: null,
      finished: false
    }
  },
  mounted() {
    // PRODUCCIÓN: 15 de Septiembre de 2026 a las 10:00h
    this.targetDate = new Date('2026-09-15T10:00:00')
    
    this.updateCountdown()
    this.timer = setInterval(this.updateCountdown, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  computed: {
    formattedDays() {
      return String(this.days).padStart(2, '0')
    },
    formattedHours() {
      return String(this.hours).padStart(2, '0')
    },
    formattedMinutes() {
      return String(this.minutes).padStart(2, '0')
    },
    formattedSeconds() {
      return String(this.seconds).padStart(2, '0')
    }
  },
  methods: {
    updateCountdown() {
      const now = new Date()
      const diff = this.targetDate - now
      
      if (diff > 0) {
        this.days = Math.floor(diff / (1000 * 60 * 60 * 24))
        this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        this.seconds = Math.floor((diff % (1000 * 60)) / 1000)
      } else {
        this.days = 0
        this.hours = 0
        this.minutes = 0
        this.seconds = 0
        if (!this.finished) {
          this.finished = true
          clearInterval(this.timer)
        }
      }
    }
  }
}
</script>

<style scoped>
.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: clamp(0.6rem, 2.5vw, 1rem) clamp(0.75rem, 3vw, 1.5rem);
  min-width: clamp(56px, 14vw, 80px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.countdown-number {
  font-size: clamp(1.75rem, 7vw, 3rem);
  font-weight: 700;
  color: #fff;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.countdown-label {
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.35rem;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.countdown-separator {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  animation: pulse 1s ease-in-out infinite;
  align-self: flex-start;
  padding-top: clamp(0.5rem, 2vw, 0.8rem);
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.countdown-finished {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #10b981, #00d4ff);
  border-radius: 12px;
  animation: finishedPulse 2s ease-in-out infinite;
}

.finished-text {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@keyframes finishedPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
}

</style>
</file>
