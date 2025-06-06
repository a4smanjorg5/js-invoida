import { useMemo } from 'react'
import { type AppComponents } from '@a4smanjorg5/invoida-components/App'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useAppUrl } from '../helpers'

const HttpAct: AppComponents['HttpAct'] = ({ name: sectName, params, ...props }) => {
  const appUrl = useAppUrl(sectName)
  const url = useMemo(() => appUrl + (
    sectName == 'mSign' ? (
      params.kid + (
        (params.issuer || '') && ('?iss=' + encodeURIComponent(params.issuer))
      )
    ) : ''
  ), [appUrl, sectName, params])
  const mutation = useMutation({
    mutationFn: (data: never) => Promise.resolve(
      typeof props.onAction == 'function'
      ? props.onAction(data)
      : data
    ).then(data => axios.post(
      url, data,
      { headers: { 'Content-Type': (
        sectName == 'mNew'
        ? 'text/plain'
        : 'application/json'
      ) } }
    ).then(resp => resp.data)),
    mutationKey: [sectName],
    onSuccess: props.onSuccess as VoidFunction,
    onError: props.onError,
  })

  return <props.Mutation {...mutation} />
}

export default HttpAct
