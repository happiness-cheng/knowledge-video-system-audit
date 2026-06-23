import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import {
  findAudioSegment,
  sceneFrames,
  spec,
  TRANSITION_FRAMES,
} from "../utils/videoData";
import { audioTimingPathToStaticPath } from "../utils/mediaPaths";

export const AudioTrackLayer: React.FC = () => (
  <>
    {spec.scenes.flatMap((scene, index) => {
      const sceneFrame = sceneFrames[index];
      const adjustedFrom = sceneFrame.startFrame - index * TRANSITION_FRAMES;
      let segmentOffsetFrames = 0;
      const segmentIds = scene.audioSegmentIds ?? [scene.id];

      return segmentIds.map((segmentId) => {
        const segment = findAudioSegment(segmentId);
        const durationFrames = segment
          ? Math.round(segment.duration * spec.meta.fps)
          : sceneFrame.durationFrames;
        const staticPath = audioTimingPathToStaticPath(
          segment?.filePath ?? `audio/voiceover/${segmentId}.mp3`,
        );
        const from = adjustedFrom + segmentOffsetFrames;
        segmentOffsetFrames += durationFrames;

        return (
          <Sequence
            key={`audio-${scene.id}-${segmentId}`}
            from={from}
            durationInFrames={durationFrames}
          >
            <Audio src={staticFile(staticPath)} volume={1} />
          </Sequence>
        );
      });
    })}
  </>
);
