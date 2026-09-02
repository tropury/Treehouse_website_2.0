"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

/**
 * SoundToggle — ambient atmosphere control.
 *
 * Toggles a soft, procedurally-generated ambient drone using the Web
 * Audio API (no asset required). Sits in the top-right corner. The
 * setting persists across the session via sessionStorage and respects
 * autoplay policies (only starts after a user gesture, which the toggle
 * itself provides).
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    master: GainNode;
    oscillators: OscillatorNode[];
    lfo?: OscillatorNode;
    lfoGain?: GainNode;
  } | null>(null);

  // Restore preference.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("th-sound") === "on") {
        // Note: actual playback requires a user gesture, so we only
        // reflect the intent; the user must click to resume.
        setOn(true);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const start = () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Two detuned oscillators form a soft, warm drone.
    const freqs = [110, 110.5, 220];
    const oscillators = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 2 ? "triangle" : "sine";
      osc.frequency.value = f;
      const gain = ctx.createGain();
      gain.gain.value = i === 2 ? 0.04 : 0.08;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      return osc;
    });

    // Slow LFO modulates master gain for a breathing effect.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.015;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    // Fade in.
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);

    nodesRef.current = { master, oscillators, lfo, lfoGain };
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;
    const now = ctx.currentTime;
    nodes.master.gain.cancelScheduledValues(now);
    nodes.master.gain.setValueAtTime(nodes.master.gain.value, now);
    nodes.master.gain.linearRampToValueAtTime(0, now + 0.6);
    setTimeout(() => {
      nodes.oscillators.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      try {
        nodes.lfo?.stop();
      } catch {
        /* ignore */
      }
      ctx.close();
      ctxRef.current = null;
      nodesRef.current = null;
    }, 700);
  };

  const toggle = () => {
    if (on) {
      stop();
      setOn(false);
      try {
        sessionStorage.setItem("th-sound", "off");
      } catch {
        /* ignore */
      }
    } else {
      start();
      setOn(true);
      try {
        sessionStorage.setItem("th-sound", "on");
      } catch {
        /* ignore */
      }
    }
  };

  // Allow the command palette (or other UI) to trigger the toggle via a
  // custom window event.
  useEffect(() => {
    if (!ready) return;
    const onToggle = () => toggle();
    window.addEventListener("th-toggle-sound", onToggle);
    return () => window.removeEventListener("th-toggle-sound", onToggle);
  }, [ready, on]);

  if (!ready) return null;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute ambient sound" : "Play ambient sound"}
      data-cursor="link"
      data-cursor-label={on ? "mute" : "sound"}
      className="group fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/70 bg-white/70 text-zinc-600 backdrop-blur-md transition-colors duration-300 hover:border-th-blue hover:text-th-blue md:right-8 md:top-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.8 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Equalizer bars when playing */}
      {on ? (
        <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="w-[2px] rounded-full bg-th-blue"
              animate={{ height: [4, 12, 6, 10, 4] }}
              transition={{
                duration: 1.2 + i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </span>
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
      <Volume2 className="sr-only" />
    </motion.button>
  );
}
