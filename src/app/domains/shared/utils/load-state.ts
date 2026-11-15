import { OperatorFunction, catchError, map, of, startWith } from 'rxjs';

/** Estado de una petición asíncrona, pensado para consumirse como signal. */
export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error' };

/** Convierte un observable en un flujo de `LoadState` (loading → success | error). */
export function toLoadState<T>(): OperatorFunction<T, LoadState<T>> {
  return source =>
    source.pipe(
      map(data => ({ status: 'success', data }) as LoadState<T>),
      catchError(() => of<LoadState<T>>({ status: 'error' })),
      startWith<LoadState<T>>({ status: 'loading' })
    );
}
