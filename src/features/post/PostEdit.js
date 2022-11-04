import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab'
import { alpha, Box, Button, Card, Stack,  } from '@mui/material'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, FTextField, FUploadImage } from '../../components/form'
import * as Yup from 'yup'
import { editPost } from './postSlice';
import { useConfirm } from 'material-ui-confirm';



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
    const confirm = useConfirm()
    console.log(props)



    const methods = useForm({
        resolver: yupResolver(yupSchema),
        defaultValues,
    })

    const {handleSubmit, reset, setValue, formState: {isSubmitting}} = methods
    const handleDrop = useCallback(
        (acceptedFiles) => {
          const file = acceptedFiles[0];
    
          if (file) {
            setValue(
              "image",
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            );
          }
        },
        [setValue]
      );

    const onSubmit = (data) => {
    //   if (window.confirm('Are you sure you wish to edit')){
    //       console.log(data, props.postId)
    //       dispatch(editPost(data, props.postId)).then(()=> reset())
    //       props.handleClose()
    //     }
        confirm({ description: "Edit this post?" })
      .then(() => {
        dispatch(editPost(data, props.postId)).then(()=> reset())
        props.handleClose()
      })
      .catch(() => {
        /* ... */
        console.log('Cancel')
      });
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
            <FUploadImage
            name="image"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleDrop}
          />
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