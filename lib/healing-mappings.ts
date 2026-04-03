export interface SealSound {
  instruments: string[];
  bodyFocus: string;
  description: string;
}

export interface ToneSound {
  style: string;
  description: string;
}

export const SEAL_SOUND_MAP: SealSound[] = [
  { instruments: ['Gong', 'Frame drum'],                          bodyFocus: 'Root, primal',             description: 'Dragon energy calls for deep, primal sound. The gong awakens the origin point — your root centre. Let low, sustained vibrations connect you to the earth beneath you.' },
  { instruments: ['Didgeridoo', 'Overtone singing'],              bodyFocus: 'Throat, breath',           description: 'Wind is the breath of spirit. Breath-based instruments like the didgeridoo channel this energy directly. Focus on your throat and let sound ride on your exhale.' },
  { instruments: ['Crystal bowls (deep)', 'Ocean drum'],          bodyFocus: 'Third eye, dreams',        description: 'Night invites you inward. Deep, resonant crystal bowls open the dreamscape. Let the ocean drum wash over you as you explore your inner visions.' },
  { instruments: ['Tuning forks', 'Chimes'],                      bodyFocus: 'Crown, intention',         description: 'Seed energy is precise and intentional. Tuning forks target specific frequencies with clarity. Set your intention before each strike — the sound carries your purpose.' },
  { instruments: ['Monochord (KOTAMO)', 'Body drums'],            bodyFocus: 'Sacral, kundalini',        description: 'Serpent awakens life force. The monochord sends vibrations directly through the body. Play close to the skin — let the sound move through you, not just around you.' },
  { instruments: ['Tibetan singing bowls', 'Bells'],              bodyFocus: 'Heart, transition',        description: 'Worldbridger moves between realms. Tibetan bowls create a bridge of sound between the physical and spiritual. Focus on your heart space as the tones rise and fall.' },
  { instruments: ['Crystal bowls (hands-on)', 'Body work'],       bodyFocus: 'Hands, healing',           description: 'Hand is the healer. Place crystal bowls near the body and feel the vibration through your palms. Today your hands are instruments themselves — direct sound with touch.' },
  { instruments: ['Crystal bowls (high)', 'Kalimba'],             bodyFocus: 'Solar plexus, harmony',    description: 'Star seeks beauty in sound. High, clear crystal bowls and the gentle kalimba create harmonious patterns. Let the tones arrange themselves — elegance over force.' },
  { instruments: ['Ocean drum', 'Rain stick', 'Water sounds'],    bodyFocus: 'Sacral, emotions',         description: 'Moon energy flows. Water-based instruments mirror your emotional currents. The ocean drum and rain stick let you ride the tides of feeling without drowning in them.' },
  { instruments: ['Singing bowls (warm tones)', 'Harmonium'],     bodyFocus: 'Heart, love',              description: 'Dog opens the heart. Warm, sustained tones from singing bowls create a container of safety and devotion. Let the harmonium breathe love into the room.' },
  { instruments: ['Kalimba', 'Tongue drum', 'Playful percussion'], bodyFocus: 'Throat, play',            description: 'Monkey plays. Today, sound is not serious medicine — it is joyful experiment. The kalimba and tongue drum invite improvisation. Follow delight, not technique.' },
  { instruments: ['Voice/chanting', 'Harmonium'],                 bodyFocus: 'All chakras, free will',   description: 'Human energy lives in the voice. Chant, hum, or tone freely. Your voice is the most personal instrument you have — let it carry your wisdom without rehearsal.' },
  { instruments: ['Didgeridoo', 'Drone instruments'],             bodyFocus: 'Root to crown, expansion', description: 'Skywalker expands beyond limits. Drones create a sonic field that stretches awareness outward. The didgeridoo grounds while it opens — root to crown in a single breath.' },
  { instruments: ['Crystal bowls', 'Tibetan bowls (layered)'],    bodyFocus: 'Third eye, receptivity',   description: 'Wizard receives. Layer multiple bowls and let their interactions create overtones you did not plan. Do not direct — receive what the sound reveals.' },
  { instruments: ['Flute', 'High overtones'],                     bodyFocus: 'Third eye, vision',        description: 'Eagle sees from above. The flute carries your awareness upward. High overtones activate the third eye. Play with eyes closed and notice what images arise.' },
  { instruments: ['Frame drum', 'Djembe', 'Strong rhythm'],       bodyFocus: 'Solar plexus, courage',    description: 'Warrior marches with rhythm. Strong, steady percussion awakens your inner courage. The frame drum and djembe demand presence — be fully here with each strike.' },
  { instruments: ['Monochord', 'Grounding tones'],                bodyFocus: 'Root, earth connection',   description: 'Earth navigates by feeling. The monochord sends vibrations into the body like a compass needle finding true north. Let the low tones anchor you to the present moment.' },
  { instruments: ['Crystal bowls (reflective)', 'Silence'],       bodyFocus: 'Third eye, clarity',       description: 'Mirror reflects. A single crystal bowl tone followed by silence lets you hear what returns to you. Today, the pauses between notes carry as much meaning as the sound.' },
  { instruments: ['Gong (building)', 'Thunder drum'],             bodyFocus: 'All chakras, transformation', description: 'Storm transforms through intensity. Build the gong gradually from whisper to thunder. The storm does not apologise — let the sound crescendo and transform what needs to change.' },
  { instruments: ['Crystal bowls (all)', 'Full sound bath'],      bodyFocus: 'Crown, enlightenment',     description: 'Sun illuminates everything. Today calls for a full sound bath — all bowls, all tones, the complete spectrum. Let light pour through sound into every cell.' },
];

export const TONE_SOUND_MAP: ToneSound[] = [
  { style: 'Single sustained tone',     description: 'Set a clear intention before playing. Begin with one sustained tone and let it establish the field. Everything builds from this point.' },
  { style: 'Two contrasting sounds',    description: 'Explore polarity — play two sounds that contrast each other. High and low, loud and soft. Let the tension between them teach you something.' },
  { style: 'Rhythmic activation',       description: 'Activate with rhythm. Three strikes or pulses to awaken the energy. This is not a day for gentle drones — bring movement into the sound.' },
  { style: 'Structured four-part pattern', description: 'Build a structured sound sequence. Four distinct parts, each grounding the one before it. Form matters today — give the sound a container.' },
  { style: 'Power and resonance',       description: 'Play with full power and let overtones ring completely. Do not dampen — let each strike expand to its fullest natural expression.' },
  { style: 'Balanced rhythmic patterns', description: 'Create balanced, rhythmic patterns. Equal time for sound and silence. The rhythm itself is the medicine — steady, reliable, organising.' },
  { style: 'Sustained channelling',     description: 'Channel and sustain. Find the resonant frequency and hold it at the centre. Let the vibration build until the room itself is humming.' },
  { style: 'Layered harmonics',         description: 'Layer multiple instruments or frequencies. Let them weave together. The harmony between different sounds creates something none could produce alone.' },
  { style: 'Full presence, nine pulses', description: 'Play with full intention and complete presence. Pulse nine times with conscious focus. Each pulse carries your entire awareness.' },
  { style: 'Purest, clearest tone',     description: 'Perfect the tone. Aim for the purest, clearest sound possible. No extras, no embellishment — just the perfect expression of one frequency.' },
  { style: 'Release and decay',         description: 'Release and let go. Strike once and let the note decay naturally. Do not hold, sustain, or control. The dissolving IS the practice.' },
  { style: 'Group or shared practice',  description: 'Share sound with others. This is a day for group practice, community sound bath, or playing for someone who needs it. Sound healing is a gift today.' },
  { style: 'Free improvisation',        description: 'Transcend technique. Free improvisation — surrender to the sound and let it take you where it wants to go. You are not playing the instrument; it is playing you.' },
];
