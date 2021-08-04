import type { Either } from "fp-ts/lib/Either";
import { left, right } from "fp-ts/lib/Either";
import type { Stream } from "./Stream";

export type ParseResult<I, A> = Either<ParseFailure, ParseSuccess<I, A>>;

export type ParseFailure = Error;

export type ParseSuccess<I, A> = {
  readonly value: A;
  readonly next: Stream<I>;
};

export const success: <I, A>(
  value: A,
  input: Stream<I>,
  next: number
) => ParseResult<I, A> = (value, input, next) =>
  right({ value, next: { ...input, cursor: next } });

export const failure: <I, A = never>(e: Error) => ParseResult<I, A> = (e) =>
  left(e);