import type { ComponentType, ReactNode } from 'react'
import type { JWK, JSONWebKeySet } from 'jose'
import type { Mutation, ResultProps } from '../helpers'

export type ActProps = {
  [K in KeyState]: ActPropsMap[K][2] extends undefined
  ? ActPropsTemplate<K> & { params? :undefined }
  : ActPropsTemplate<K> & { params: ActPropsMap[K][2] } ;
}[KeyState]

interface ActPropsMap {
  'mNew': [JWK, string];
  'mSign': [SignFeedback | string, SignRequest, SignParams];
}

interface ActPropsTemplate<K extends KeyState>
  extends ResultProps<ActPropsMap[K][0]> {
  name: K;
  onAction?(data: ActPropsMap[K][1]): unknown;
  Mutation: ComponentType<Mutation<ActPropsMap[K][0], ActPropsMap[K][1]>>;
}

type KeyState = keyof ActPropsMap

export interface ListProps extends ResultProps<ListResult> {
  children(result: ListResult): ReactNode;
  refetchable: boolean;
  name: 'mKeys';
}

type SignFeedback = { [K in 'jwt' | 'url']: string }

export interface SignParams {
  issuer: string;
  kid: string;
}

export interface SignRequest {
  format: 'yaml' | 'json' | 'plain';
  payload: string;
}

export interface ListResult {
  data?: JSONWebKeySet;
  error: Error | null;
  isLoading: boolean;
}

interface ManagementState<K extends KeyState> {
  feedback: ActPropsMap[K][0];
}

export type MgmtStateMap =
  & {
    [K in KeyState]: Partial<ManagementState<K>>;
  }
  & {
    mKeys: { showDialog?: boolean };
  }
