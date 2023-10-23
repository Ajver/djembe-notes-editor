import { BeatType } from "./BeatDef"


export const RhythmMeterPresets = {
  "4-4": {
    beatsInBar: 4,
    defaultBeatType: BeatType.SINGLE,
  },
  "3-4": {
    beatsInBar: 3,
    defaultBeatType: BeatType.SINGLE,
  },
  "8-4": {
    beatsInBar: 4,
    defaultBeatType: BeatType.DOUBLE,
  },
  "9-8": {
    beatsInBar: 3,
    defaultBeatType: BeatType.TRIPLET,
  },
  "12-8": {
    beatsInBar: 4,
    defaultBeatType: BeatType.TRIPLET,
  },
}