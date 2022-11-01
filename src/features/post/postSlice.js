
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
    isLoading: false,
    error: null,
    postsById: {},
    currentPagePosts: [],
    isEditing: false,
    editedId: {},
}



const slice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        startLoading(state) {
          state.isLoading = true
        },

        hasError(state, action) {
          state.isLoading = false
          state.error = action.payload
        },
        
        createPostSuccess(state, action) {
          state.isLoading = false
          state.error = null
          const newPost = action.payload
          if(state.currentPagePosts.length % POST_PER_PAGE === 0 )
              state.currentPagePosts.pop()
          state.postsById[newPost._id] = newPost
          state.currentPagePosts.unshift(newPost._id)
        },
        getPostSuccess(state, action) {
          state.isLoading = false
          state.error = null
          const {count, posts} = action.payload
          posts.forEach((post) => {
            state.postsById[post._id] = post;
            if (!state.currentPagePosts.includes(post._id))
              state.currentPagePosts.push(post._id);
          });
          state.totalPosts = count;
        },
        sendPostReactionSuccess(state, action) {
          state.isLoading = false;
          state.error = null;
          const { postId, reactions } = action.payload;
          state.postsById[postId].reactions = reactions;
        },
        deletePostSuccess(state, action) {
          state.isLoading = false
          state.error = null
          const deletedPost = action.payload
            let index = state.currentPagePosts.indexOf(deletedPost._id)
            if( index > -1){
              state.currentPagePosts.splice(index, 1)
            }        
        },
        startEditing(state, action){
          state.isLoading = false
          state.isEditing = true
          
        },
        editSuccess(state, action) {
          state.isEditing = false
          state.error = null
          console.log(action.payload)
          state.editedId = action.payload._id
          // let index = state.currentPagePosts.indexOf(_id)
          // if( index  > -1) {
            //   state.currentPagePosts.splice(index,1)
            // }
            // state.currentPagePosts.forEach((post) => {
            //   console.log(post)
            //   if(post == action.payload._id) {
            //   let index = state.currentPagePosts.indexOf(_id) 
            //     state.currentPagePosts[index] = action.payload._id
            //   }

            // })
            const newPost = action.payload
              
            state.postsById[newPost._id].content = newPost.content
            state.postsById[newPost._id].image = newPost.image


        }
          
          
        }


    }
)

export const startEditing = (dispatch) =>{
  dispatch(slice.actions.startEditing())
}

export const editPost = ({content,image}, postId) => async (dispatch) => {
  dispatch(slice.actions.startEditing())
  try {
    console.log(postId)
    const imageUrl = await cloudinaryUpload(image)
    const response = await apiService.put(`/posts/${postId}`, {
      content,
      image: imageUrl,
  })
    // dispatch(slice.actions.createPostSuccess(response.data))
    dispatch(slice.actions.editSuccess(response.data))
  } catch (error) {

    dispatch(slice.actions.hasError(error.message))
    
  }
}

export const createPost = ({content, image}) => async (dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
        const imageUrl = await cloudinaryUpload(image)
        const response = await apiService.post('/posts', {
            content,
            image: imageUrl,
        })
    
        dispatch(slice.actions.createPostSuccess(response.data))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
    }
}

export const deletePost = ({postId}) => async (dispatch) => {
  dispatch(slice.actions.startLoading())
  try {
    console.log(postId)
    const deleteResponse = await apiService.delete(`/posts/${postId.toString()}`)
    
    dispatch(slice.actions.deletePostSuccess(deleteResponse.data))
  } catch (error) {
    dispatch(slice.actions.hasError(error.message))
  }
}

export const getPosts = ({userId, page, limit = 2}) => async (dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
        const params = {
            page,
            limit,
        }
        const response = await apiService.get(`/posts/user/${userId}`, {
           params
        })
        dispatch(slice.actions.getPostSuccess(response.data))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
    }
}

export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };



export default slice.reducer