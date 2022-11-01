import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab'
import { alpha, Box, Button, Card, Stack,  } from '@mui/material'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, FTextField } from '../../components/form'
import * as Yup from 'yup'
import { editPost } from './postSlice';



const yupSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
  });

const defaultValues = {
    content: "",
    image: '',
};


function PostEdit(props) {
    const dispatch = useDispatch()
    const {isLoading} = useSelector((state)=> state.post)
    const editInput = props.post.content
    console.log(props)

    const fileInput = useRef()

    const handleFile = (e) => {
        const file = fileInput.current.files[0]
        if(file){
            setValue('image', file)
        }
    }

    const methods = useForm({
        resolver: yupResolver(yupSchema),
        defaultValues,
    })

    const {handleSubmit, reset, setValue, formState: {isSubmitting}} = methods

    const onSubmit = (data) => {
      if (window.confirm('Are you sure you wish to edit')){
          console.log(data, props.postId)
          dispatch(editPost(data, props.postId)).then(()=> reset())
          props.handleClose()
        }
    }
  return (
    <Card sx={{p: 3}}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
            <FTextField
            name='content'
            multiline
            fullWidth
            rows={4}
            placeholder={editInput}
            // value={editInput}
            // onChange={(e)=>handleChange(e)}
            sx={{
                '& fieldset': {
                    borderWidth: '1px !important',
                    borderColor: alpha("#919EAB", 0.32)
                }
            }}
            />
            <input type='file' ref={fileInput} onChange={handleFile}/>
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <LoadingButton
                type='submit'
                variant='contained'
                size='small'
                loading={isSubmitting || isLoading}
                >
                    Post
                </LoadingButton>
                <Button sx={{ml: 2}}
                variant='contained'
                size='small'
                onClick={()=>props.handleClose()}
                >Cancel
                </Button>
            </Box>
        </Stack>
    </FormProvider>
    </Card>
  )
}

export default PostEdit