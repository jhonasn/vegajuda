import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Loading from 'components/loading'
import Banner from 'components/banner'
import Category from '../category'
import api from './api'

export default () => {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    (async () => setCategories(await api.load()))()
  }, [])

  if (!categories) return <Loading />

  return (
    <>
      <Banner
        title="Lista de produtos veganos"
        imgName="vegan"
        isFullWidth
      />
      <Container fixed>
        {categories && categories.map((c, idx) => (
          <Category key={c.id} data={c} />
        ))}
      </Container>
    </>
  )
}
