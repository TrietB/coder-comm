import React, { useRef } from 'react'
import {FormProvider, FTextField} from '../../components/form'
import {useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { alpha, Box, Card, Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useDispatch, useSelector } from 'react-redux'
import {createPost} from './postSlice'

const yupSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
  });

const defaultValues = {
    content: "",
    image: '',
};

function PostForm() {
    const dispatch = useDispatch()
    const {isLoading} = useSelector((state)=> state.post)

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
       dispatch(createPost(data)).then(()=> reset())
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
                    placeholder='Share what you are thinking here...'
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
                    </Box>
                </Stack>
            </FormProvider>
        </Card>
 
    )
}

export default PostForm