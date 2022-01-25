import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../Point";
import { pointBy } from "../../../Point";
import { MessageType } from "../MessageType";

export type Particle = {
  readonly id: MessageType.SVC_PARTICLE;
  readonly name: "SVC_PARTICLE";

  readonly fields: {
    readonly origin: Point;
    readonly direction: Point;
  };
};

export const particle: B.BufferParser<Particle> = pipe(
  P.struct({
    // TODO AlliedMods does not scaling, hlviewer says 1/8
    origin: pointBy(
      pipe(
        B.int16_le,
        P.map((a) => a / 8)
      )
    ),

    // TODO AlliedMods says 1/16, hlviewer does not scale
    // TODO Value must be [-128, 127]
    direction: pointBy(B.int8_le),

    count: B.uint8_le,
    color: B.uint8_le,
  }),

  P.map((fields) => ({
    id: MessageType.SVC_PARTICLE,
    name: "SVC_PARTICLE",
    fields,
  }))
);
