// Web Audio API ambient high-altitude wind & radio telemetry synthesizer
class AlpineSoundscape {
  constructor() {
    this.ctx = null;
    this.noiseNode = null;
    this.filterNode = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Create pink noise buffer for realistic alpine wind
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    // Resonant low-pass filter to emulate howling ridge winds
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(280, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // Master volume gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
  }

  toggle() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      if (!this.hasStarted) {
        this.noiseNode.start(0);
        this.hasStarted = true;
      }
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 1.2);
      this.isPlaying = true;
    } else {
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      this.isPlaying = false;
    }
    return this.isPlaying;
  }

  // Modulate wind intensity based on scroll altitude
  updateAltitude(progress) {
    if (!this.ctx || !this.isPlaying || !this.filterNode) return;
    // Higher altitude = higher frequency cutoff & wind howling
    const freq = 200 + progress * 550;
    this.filterNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
  }

  playClick() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }
}

export const soundscape = new AlpineSoundscape();
