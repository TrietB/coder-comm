import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostCard from './PostCard'
import { getPosts } from './postSlice'

function PostList({userId}) {
    const [page, setPage] = useState(1)
    const {currentPagePosts, postsById, totalPosts, isLoading } = useSelector((state) => state.post)
    
    const posts = currentPagePosts.map((postId) => postsById[postId])
    const dispatch = useDispatch()
    useEffect(()=> {
        if(userId) dispatch(getPosts({userId, page}))
    }, [userId, page, dispatch])

  return (
  <>
    {posts.map(post => <PostCard key={post._id} post={post} postId={post._id}/>)}
    <Box sx={{display:'flex', justifyContent: 'center'}}>
    {totalPosts ? ( 
        <LoadingButton
        variant='outlined'
        size='small'
        loading={isLoading}
        onClick={()=> setPage((page)=> page + 1)}
        >Load more</LoadingButton>
        ) : (
        <Typography variant='h6'>No post yet</Typography>
        )}
    </Box>
  </>
  )
}

export default PostList