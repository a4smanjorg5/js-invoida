import { type AppComponents } from '@a4smanjorg5/invoida-components/App'
import { useMutation } from '@tanstack/react-query'

const Verifier: AppComponents['Verifier'] = props => {
  const mutation = useMutation({
    mutationFn: (jws: Parameters<typeof props.onVerify>[0]) => props.onVerify(jws, new URL(props.certsURL)),
    mutationKey: [props.name],
    onMutate: props.onAction,
    onSuccess: props.onSuccess,
    onError: props.onError,
  })

  return <props.VerifyAct {...mutation} />
}

export default Verifier
