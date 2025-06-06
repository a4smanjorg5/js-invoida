export type Mutation<R, D> = ErrorResult
  & {
    data?: R;
    isPending: boolean;
    mutate(data: D): void;
  }

export type ErrorResult =
  | { isError: true; error: Error }
  | { isError: false; error: null }

export interface ResultProps<T, E = Error> {
  onSuccess?(data: T): void;
  onError?(data: E): void;
}

export type TransitionHandlers = {
  [K in
    | 'onEnter'
    | 'onEntering'
    | 'onEntered'
    | 'onExit'
    | 'onExiting'
    | 'onExited'
  ]?: VoidFunction;
}
