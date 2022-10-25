import { Pagination, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { COMMENTS_PER_POST } from '../../app/config';
import CommentCard from './CommentCard';
import { getComments } from './commentSlice'
import LoadingScreen from '../../components/LoadingScreen'

function CommentList({postId}) {
  const dispatch = useDispatch()

  const {
    commentsByPosts,
    commentsById,
    totalComments,
    isLoading,
    currentPage,
  } = useSelector(
    (state) => ({
      commentsByPosts: state.comment.commentsByPosts[postId],
      totalComments: state.comment.totalCommentsByPost[postId],
      currentPage: state.comment.currentPageByPost[postId] || 1,
      commentsById: state.comment.commentsById,
      isLoading: state.comment.isLoading,
    }),
    shallowEqual
  );

  const totalPages = Math.ceil(totalComments / COMMENTS_PER_POST);

  let renderComments;

  if (commentsByPosts) {
    const comments = commentsByPosts.map((commentId) => commentsById[commentId]);
    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    renderComments = <LoadingScreen />;
  }

  useEffect(()=> {
    if(postId) dispatch(getComments({postId}))
  },[postId, dispatch])
  return (
     <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalComments > 1
            ? `${totalComments} comments`
            : totalComments === 1
            ? `${totalComments} comment`
            : "No comment"}
        </Typography>
        {totalComments > COMMENTS_PER_POST && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComments}
    </Stack>
  )
}

export default CommentList