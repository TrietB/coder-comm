import React, {  useState } from 'react'
import {
    Box,
    Link,
    Card,
    Stack,
    Avatar,
    Typography,
    CardHeader,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link as RouterLink } from "react-router-dom";
import CommentList from '../comment/CommentList';
import CommentForm from '../comment/CommentForm';
import PostReaction from './PostReaction';
import { fDate } from '../../utils/formatTime';
import { useDispatch } from 'react-redux';
import { deletePost, startEditing } from './postSlice';
import PostEdit from './PostEdit';
// import useAuth from '../../hooks/useAuth';
import { useConfirm } from 'material-ui-confirm';

const ITEM_HEIGHT = 48

function PostCard({post, postId}) {
  const [isEditing, setIsEditing] = useState(true)
  const dispatch = useDispatch()
  // const {user} = useAuth()
  const confirm = useConfirm()
  // const [id , setId] = useState(editedId)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    console.log(isEditing)
    setIsEditing(true)
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // if (window.confirm('Are you sure you wish to edit')){
    //   dispatch(deletePost({postId}))
    //   dispatch(getPosts(user._id, 1))
    //   setAnchorEl(null)
    // }
    confirm({ description: "Are you sure to delete this post?" })
    .then(() => {
      dispatch(deletePost({postId}))
      // dispatch(getPosts(user._id, 1))
      setAnchorEl(null)
    })
    .catch(() => {
      console.log('cancel')
    });
  }

  const handleEdit = () => {
    dispatch(startEditing)
    // setId(true)
    setIsEditing(false)
    setAnchorEl(null)
  }




  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <>
          <IconButton
          onClick={handleClick}
          size='small'
          >
            <MoreVertIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <Menu
        // id="long-menu"
        // MenuListProps={{
        //   'aria-labelledby': 'long-button',
        // }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
          <MenuItem key='delete'  onClick={handleDelete}>
            Delete
          </MenuItem>
          <MenuItem key='edit' onClick={handleEdit}>
            Edit
          </MenuItem>
      </Menu>
          </>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        { isEditing ? (
        <>
          <Typography>{post.content}</Typography>

          {post.image && (
            <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
            >
              <img src={post.image} alt="post" />
            </Box>
         
          )}
        </>) : (
          <PostEdit postId={postId} handleClose={handleClose} post={post}/>
          
         )}

         
        

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  )
}

export default PostCard