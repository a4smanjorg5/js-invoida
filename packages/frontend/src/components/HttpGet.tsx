import { type ComponentType, useEffect, useState } from 'react'
import { type AppComponents } from '@a4smanjorg5/invoida-components/App'
import Loading from '@a4smanjorg5/invoida-components/Loading'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAppUrl } from '../helpers'

type ListProps = typeof HttpGet extends ComponentType<infer P> ? P : never

const HttpGet: AppComponents['HttpGet'] = ({ name: sectName, refetchable, children, ...rest }) => {
  const url = useAppUrl(sectName)
  const [refetch, setRefetch] = useState(false)
  const { data, error, isFetching, isLoading } = useQuery({
    refetchOnWindowFocus: refetchable,
    ...rest,
    queryFn: process,
    queryKey: [sectName, url, refetch],
  })

  useEffect(() => {
    if (refetchable) {
      setRefetch(s => !s)
    }
  }, [refetchable])

  if (isLoading) {
    return <Loading />
  }

  return children({
    data, error,
    isLoading: isFetching,
  })
}

export default HttpGet

const process = ({ queryKey: [, url] }: {
  queryKey: [ListProps['name'], string, unknown];
}) => axios.get(url).then(resp => resp.data)
