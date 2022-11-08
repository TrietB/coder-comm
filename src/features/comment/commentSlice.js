import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";

const initialState = {
    isLoading: false,
    error: null,
    commentsById: {},
    commentsByPosts: {},
    currentPageByPost: {}, 
    totalCommentsByPost: {},
    isEditing: false,
}

const slice = createSlice({
    name: ' comment',
    initialState,
    reducers: {
        startLoading(state){
            state.isLoading = true
        },
        hasError(state,action){
            state.isLoading = false
            state.error = action.payload
        },
        createCommentSuccess(state, action){
            state.isLoading = false
            state.error = null
            console.log(action)
            toast.success('Created new comment')
        },
        getCommentSuccess(state, action) {
            state.isLoading = false
            state.error = null
            console.log(action.payload)
            const {postId , comments, count, page } = action.payload
            comments.forEach(
                (comment) => (state.commentsById[comment._id] = comment)
            )
            state.commentsByPosts[postId] = comments.map((comment)=> comment._id)
            .reverse()
            state.totalCommentsByPost[postId] = count
            state.currentPageByPost[postId] = page
        },
        sendCommentReactionSuccess(state, action) {
            state.isLoading = false;
            state.error = null;
            const { commentId, reactions } = action.payload;
            state.commentsById[commentId].reactions = reactions;
        },
        deleteCommentSuccess(state, action) {
            state.isLoading = false
            state.error = null
            console.log(action.payload)
            const {_id} = action.payload
            state.isLoading = false
            state.error = null
             delete state.commentsByPosts[_id]
             toast.success('Comment removed')
        },
        isEditing(state, action) {
            state.isEditing = true
            state.error = action.payload
            console.log(state.isEditing)

        },
        editCommentSuccess(state,action) {
            state.isEditing = false
            state.isLoading = false
            state.error = null
            const editedComment = action.payload
            console.log( state.commentsByPosts)
            
            state.commentsById[editedComment._id].content = editedComment.content
            toast.success('Comment edited')

        },
        stopEditing(state) {
            state.isEditing = false
        }
        
        }
        
    }
)
export const startEditing = (dispatch) =>{
    dispatch(slice.actions.isEditing())
  }
export const stopEditing = (dispatch) =>{
    dispatch(slice.actions.stopEditing())
}
export const deleteComment = (comment, postId) => async (dispatch) => {
    dispatch(slice.actions.startLoading())
    console.log(comment)
    try {
        const response = await apiService.delete(`/comments/${comment}`)

        dispatch(slice.actions.deleteCommentSuccess(response.data))
        dispatch(getComments({postId}))

    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
        toast.error(error.message);

    }
}

export const createComment = ({postId, content}) => async (dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
        const response = await apiService.post('comments' , {
            postId,
            content,
        })
        dispatch(slice.actions.createCommentSuccess(response.data))
        dispatch(getComments({postId}))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
        toast.error(error.message);

    }
}
export const editComment = ({commentId, postId, content}) => async (dispatch) => {
    dispatch(slice.actions.isEditing(content))
    try {
        console.log({content})
        const response = await apiService.put(`/comments/${commentId}`, {content})

        dispatch(slice.actions.editCommentSuccess(response.data))
        // dispatch(getComments({postId}))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
        toast.error(error.message);

    }
}

export const getComments = ({postId, page =1, limit= COMMENTS_PER_POST}) => async (dispatch) => {
dispatch(slice.actions.startLoading())
try {
    const params = {
        page: page,
        limit: limit,
    }

    const response = await apiService.get(`/posts/${postId}/comments`, {
        params
    })
    dispatch(slice.actions.getCommentSuccess({...response.data, page, postId}))
} catch (error) {
    dispatch(slice.actions.hasError(error.message))
    toast.error(error.message);
    
}
}

export const sendCommentReaction =
  ({ commentId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Comment",
        targetId: commentId,
        emoji,
      });
      dispatch(
        slice.actions.sendCommentReactionSuccess({
          commentId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };



export default slice.reducer