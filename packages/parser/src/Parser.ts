import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import * as P from "parser-ts/lib/Parser";
import { success } from "./ParseResult";
import { stream } from "./Stream";

export * from "parser-ts/lib/Parser";

export const skip = <I>(offset: number): P.Parser<I, void> =>
  pipe(
    P.withStart(P.of<I, number>(offset)),
    P.chain(([offset, i]) => seek(i.cursor + offset))
  );

export const seek =
  <I = any>(cursor: number): P.Parser<I, void> =>
  (i) =>
    success(undefined, i, stream(i.buffer, cursor));

// HACK Not stack safe, not even a little
export const manyN: <I, A>(fa: P.Parser<I, A>, n: number) => P.Parser<I, A[]> =
  (fa, n) => pipe(A.replicate(n, fa), A.sequence(P.Applicative));

// HACK Not stack safe, not even a little
// export const take: <I>(n: number) => P.Parser<I, I[]> = (n) =>
//   manyN(P.item(), n);

export const take = <I>(length: number): P.Parser<I, I[]> =>
  pipe(
    P.withStart(P.of<I, number>(length)),
    P.map(([length, i]) => i.buffer.slice(i.cursor, i.cursor + length)),
    P.apFirst(skip(length))
  );

export const logPositions: <I, A>(fa: P.Parser<I, A>) => P.Parser<I, A> =
  (fa) => (i) =>
    pipe(
      fa(i),
      E.map((a) => {
        console.log(
          `result: ${
            typeof a.value === "object" && a.value != null
              ? JSON.stringify(a.value)
              : a.value
          }, before: ${i.cursor}, after: ${a.next.cursor}`
        );

        return a;
      })
    );

export const struct = sequenceS(P.Applicative);

export const tuple = sequenceT(P.Applicative);
