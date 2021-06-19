import { ExprArg } from "faunadb";

export type Query<T> = { ref: ExprArg; data: T };
