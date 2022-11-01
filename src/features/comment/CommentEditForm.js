import {  Box, Button,  Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {  editComment, } from './commentSlice';



function CommentEditForm({commentId, closeEdit}) {
    const [content, setContent] = useState('')
    const dispatch = useDispatch()
    const handleSubmit = (e) => {
      if (window.confirm('Are you sure you wish to edit')){

        e.preventDefault()
        dispatch(editComment({commentId, content}))
        // dispatch(getComments({postId, content}))
        console.log(commentId)
        setContent('')
        closeEdit()
      }
      else{
        e.preventDefault()

      }
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
        <Box display='flex' justifyContent= 'space-evenly'>
        <Button
          type='submit'
          variant='contained'
          size='small'
        >
          Edit
        </Button>
        <Button 
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