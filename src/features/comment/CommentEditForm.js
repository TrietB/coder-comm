import {  Box, Button,  Stack, TextField } from '@mui/material'
import { useConfirm } from 'material-ui-confirm';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {  editComment, } from './commentSlice';



function CommentEditForm({commentId, closeEdit}) {
    const [content, setContent] = useState('')
    const dispatch = useDispatch()
    const confirm = useConfirm()
    const handleSubmit = (e) => {
        e.preventDefault()
      confirm({ description: "Edit this comment?" })
      .then((e) => {
        // e.preventDefault()
        dispatch(editComment({commentId, content}))
        setContent('')
        closeEdit()
      })
      .catch(() => {
        // e.preventDefault()

      });
    }
    
  return (
    <form 
    onSubmit={handleSubmit}
    >
      <Stack direction="column" alignItems="center">
        {/* <Avatar src={user.avatarUrl} alt={user.name} /> */}
        <TextField
          fullWidth
          size="small"
          value={content}
          placeholder={content}
          onChange={(event) => setContent(event.target.value)}
          sx={{
            ml: 2,
            mr: 1,
            "& fieldset": {
              borderWidth: `1px !important`,
              borderColor: (theme) =>
                `${theme.palette.grey[500_32]} !important`,
            },
          }}
        />
        <Box display='flex' justifyContent='space-between' sx={{mt:1}}>
        <Button
          type='submit'
          variant='contained'
          size='small'
          >
          Edit
        </Button>
        <Button sx={{ml:2}}
          variant='contained'
          color='error'
          size='small'
          onClick={()=>closeEdit()}
          >Cancel
        </Button>
        </Box>
      </Stack>
    </form>
  )
}

export default CommentEditForm