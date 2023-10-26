import { Sound } from "../../helpers/playing/Sound"

const sounds = {
  "B": new Sound("assets/sound/Djembe_bass.wav"),
  "T": new Sound("assets/sound/Djembe_tone.wav"),
  "S": new Sound("assets/sound/Djembe_slap.wav"),
  "G": new Sound("assets/sound/Djembe_ghost.wav"),
}


export function playNote(noteSymbol) {
  const sound = sounds[noteSymbol]
  if (sound) {
    sound.play()
  }
}