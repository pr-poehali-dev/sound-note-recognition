import { PitchDetector } from 'pitchy';

export interface DetectedNote {
  note: string;
  frequency: number;
  octave: number;
  clarity: number;
}

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function frequencyToNote(frequency: number): DetectedNote | null {
  if (frequency < 20 || frequency > 4200) {
    return null;
  }

  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const noteIndex = Math.round(noteNum) + 69;
  const octave = Math.floor(noteIndex / 12) - 1;
  const noteName = noteNames[noteIndex % 12];
  
  const expectedFreq = 440 * Math.pow(2, (noteIndex - 69) / 12);
  const centsDiff = 1200 * Math.log2(frequency / expectedFreq);
  const clarity = Math.max(0, 1 - Math.abs(centsDiff) / 50);

  return {
    note: noteName,
    frequency: Math.round(frequency * 10) / 10,
    octave,
    clarity: Math.round(clarity * 100) / 100
  };
}

export class AudioPitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private detector: PitchDetector<Float32Array> | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrame: number | null = null;
  private buffer: Float32Array | null = null;

  async start(onPitchDetected: (note: DetectedNote | null) => void): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        } 
      });

      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      const bufferLength = this.analyser.fftSize;
      this.buffer = new Float32Array(bufferLength);
      
      this.detector = PitchDetector.forFloat32Array(bufferLength);
      this.detector.minVolumeDecibels = -30;

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);

      const detectPitch = () => {
        if (!this.analyser || !this.buffer || !this.detector) return;

        this.analyser.getFloatTimeDomainData(this.buffer);
        
        const [frequency, clarity] = this.detector.findPitch(
          this.buffer, 
          this.audioContext!.sampleRate
        );

        if (frequency && clarity > 0.9) {
          const note = frequencyToNote(frequency);
          if (note && note.clarity > 0.7) {
            onPitchDetected(note);
          } else {
            onPitchDetected(null);
          }
        } else {
          onPitchDetected(null);
        }

        this.animationFrame = requestAnimationFrame(detectPitch);
      };

      detectPitch();
    } catch (error) {
      console.error('Error starting pitch detection:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.detector = null;
    this.buffer = null;
  }

  getVolume(): number {
    if (!this.analyser || !this.buffer) return 0;
    
    this.analyser.getFloatTimeDomainData(this.buffer);
    
    let sum = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      sum += this.buffer[i] * this.buffer[i];
    }
    
    const rms = Math.sqrt(sum / this.buffer.length);
    return Math.min(1, rms * 10);
  }
}
