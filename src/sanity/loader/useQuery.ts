import {
  type QueryParams,
  type UseQueryOptions,
  type UseQueryOptionsUndefinedInitial,
  type UseQueryOptionsDefinedInitial,
  type QueryStoreState,
  type WithEncodeDataAttribute,
  useQuery as reactLoaderUseQuery,
} from "@sanity/react-loader";
import { type ClientReturn } from "next-sanity";

const isUndefinedInitial = <TReturn>(
  val: UseQueryOptions<TReturn> | undefined,
): val is UseQueryOptionsUndefinedInitial => val?.initial === undefined;

type ReturnWithoutInitial<
  TQuery extends string,
  TError extends Error = Error,
> = QueryStoreState<ClientReturn<TQuery>, TError> & WithEncodeDataAttribute;

type ReturnWithInitial<
  TQuery extends string,
  TError extends Error = Error,
> = Omit<QueryStoreState<ClientReturn<TQuery>, TError>, "data"> & {
  data: ClientReturn<TQuery>;
} & WithEncodeDataAttribute;

/**
 * Exports to be used in client-only or components that render both server and client
 */
export function useQuery<TQuery extends string, TError extends Error = Error>(
  query: TQuery,
  params?: QueryParams,
  options?: UseQueryOptionsUndefinedInitial,
): ReturnWithoutInitial<TQuery, TError>;
export function useQuery<TQuery extends string, TError extends Error = Error>(
  query: TQuery,
  params?: QueryParams,
  options?: UseQueryOptionsDefinedInitial<ClientReturn<TQuery>>,
): ReturnWithInitial<TQuery, TError>;
export function useQuery<TQuery extends string, TError extends Error = Error>(
  query: TQuery,
  params?: QueryParams,
  options?:
    | UseQueryOptionsUndefinedInitial
    | UseQueryOptionsDefinedInitial<ClientReturn<TQuery>>,
): ReturnWithoutInitial<TQuery, TError> | ReturnWithInitial<TQuery, TError> {
  const snapshot = isUndefinedInitial(options)
    ? reactLoaderUseQuery<ClientReturn<TQuery>, TError>(query, params, options)
    : reactLoaderUseQuery<ClientReturn<TQuery>, TError>(query, params, options);

  // Always throw errors if there are any
  if (snapshot.error) {
    throw snapshot.error as Error;
  }

  return snapshot;
}
