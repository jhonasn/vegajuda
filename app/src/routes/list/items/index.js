import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Loading from 'components/loading'
import InfiniteScroll from 'components/infinite-scroll'
import Category from '../category'
import CardItem from '../card-item'
import api from './api'
import categoryApi from '../categories/api'

export default () => {
  // TODO: add floating button to go top
  const { categoryId } = useParams()

  const [category, setCategory] = useState(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getMoreItems = async () => {
    setIsLoading(true)

    const lastId = (items.slice().pop() || {}).id
    const nextItems = await api.loadNext(categoryId, lastId)

    if (nextItems.length) setItems([...items, ...nextItems])

    setIsLoading(false)

    return !nextItems.length
  }

  useEffect(() => {
    (async () => setCategory(await categoryApi.get(categoryId)))()
    getMoreItems()
    window.scrollTo(0, 0)
    // disable annoying react-hooks/exhaustive-deps getMoreItems as dependency
    // eslint-disable-next-line
  }, [categoryId])

  if (!category) return <Loading />

  return (
    <>
      {isLoading && <Loading />}
      <Category data={category} isBanner />
      <Container fixed>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          {items.map((i, idx) => (
              <Grid item xs={12} key={idx}>
                <CardItem
                  item={i}
                  link={`/options/${i.categoryId}/${i.id}`}
                />
              </Grid>
          ))}
        </Grid>
      </Container>
      <InfiniteScroll
        onBottomReached={getMoreItems}
        noMoreItemsMessage="Fim dos items dessa categoria"
      />
    </>
  )
}
