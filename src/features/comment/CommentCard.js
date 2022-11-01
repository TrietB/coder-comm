import { Avatar, Box, IconButton, ListItemIcon, Menu, MenuItem, Paper, Stack, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import CommentReaction from './CommentReaction'
import { fDate } from "../../utils/formatTime";
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import CommentEditForm from './CommentEditForm';
import { deleteComment, startEditing, stopEditing } from './commentSlice';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';


const ITEM_HEIGHT = 48

function CommentCard({comment, postId}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [edit, setEdit] = useState(true)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  // const handleOpen = () => {
  // setOpen(true);
  // };
  const closeEdit = () => {
    // dispatch(getComments({postId}))
    dispatch(stopEditing)
    setEdit(true)
    console.log(edit)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment._id, postId))
  }
  const handleEdit = () => {
    dispatch(startEditing)
    // dispatch(editComment(comment, postId))
    setEdit(false)
    setAnchorEl(null)

  }

  const handleClose = () => {
    // setEdit(false)
    setAnchorEl(null)
    // dispatch(startEditing)
  }
  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt) && fDate(comment.updatedAt)}
          </Typography>
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        { edit ? (
          <>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
          </Typography>
          <Tooltip title="Options" >
            <div>
              
          <IconButton
          onClick={handleClick}
          >
          <MoreHorizIcon sx={{ fontSize: 30 }} />
          </IconButton>
            </div>
          </Tooltip>
          <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
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
            <MenuItem key='delete'  
            onClick={()=> {window.confirm('Are your sure to delete?') && handleDelete()}}
            divider
            >
            <ListItemIcon>
            <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete 
            </MenuItem>
            <MenuItem key='edit'
            onClick={handleEdit}
            >
            <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
            Edit 
            </MenuItem>
          </Menu>
          
        </>
        ) : 
        (
          <CommentEditForm postId={postId} commentId={comment._id} closeEdit={closeEdit}/>
        )}
        
        
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>
    </Stack>
  )
}

export default CommentCard