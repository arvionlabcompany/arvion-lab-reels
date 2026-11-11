import React from "react";
import {Composition} from "remotion";
import {ArvionReel} from "./Video";
import {FPS, W, H, DURATION} from "./config";

export const RemotionRoot: React.FC = () => (
  <Composition id="ArvionReel" component={ArvionReel} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
