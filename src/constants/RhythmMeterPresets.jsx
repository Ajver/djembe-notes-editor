import { BeatType } from "./BeatDef"


export const RhythmMeterPresets = {
  "4-4": {
    beatsInBar: 4,
    defaultBeatType: BeatType.SINGLE,
    title: "4 single beats in bar",
  },
  "3-4": {
    beatsInBar: 3,
    defaultBeatType: BeatType.SINGLE,
    title: "3 single beats in bar",
  },
  "8-8": {
    beatsInBar: 4,
    defaultBeatType: BeatType.DOUBLE,
    title: "4 double beats in bar",
  },
  "9-8": {
    beatsInBar: 3,
    defaultBeatType: BeatType.TRIPLET,
    title: "3 triplet beats in bar",
  },
  "12-8": {
    beatsInBar: 4,
    defaultBeatType: BeatType.TRIPLET,
    title: "4 triplet beats in bar",
  },
}
