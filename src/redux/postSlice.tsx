/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface PostsState {
  posts: Post[];
  status: string;
  currentPost: Post | null; // Add this line

  error: null | string | undefined;
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: "",
  currentPost: null,
};

interface Post {
  id: string;
  fname: string;
  lname: string;
  gender: string;
  dob: string;
  interests: [];
  email: string;
  phone: string;
  address: string;
  pincode: string;
  image: string;
  region: string;
}

// thunkers

export const fetchAllPosts = createAsyncThunk("posts/", async () => {
  const res = await axios.get("http://localhost:3000/posts");
  return res.data;
});

export const deletePostApi = createAsyncThunk(
  "posts/delete",
  async (id: string) => {
    await axios.delete(`http://localhost:3000/posts/${id}`);
    return id;
  }
);

export const createPostApi = createAsyncThunk(
  "posts/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3000/posts", data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePostApi = createAsyncThunk(
  "posts/update",
  async ({
    data,
    id,
  }: {
    data: {
      fname: string;
      lname: string;
      email: string;
      dob: string;
      interests: string | string[];
      gender: string;
      address: string;
      phone: string;
      image: string;
      region: string;
    };
    id: string | undefined;
  }) => {
    const res = await axios.put(`http://localhost:3000/posts/${id}`, data);
    console.log(res.data);
    return res.data;
  }
);

export const getPostById = createAsyncThunk("/posts/id", async (id: string) => {
  const res = await axios.get(`http://localhost:3000/posts/${id}`);
  console.log(res.data);
  return res.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // addPost: (state, action: PayloadAction<Post>) => {
    //   state.posts.push(action.payload);
    // },
    // deletePost: (state, action: PayloadAction<{ id: number }>) => {
    //   state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    // },
    // updatePost: (state, action: PayloadAction<Post>) => {
    //   const index = state.posts.findIndex(
    //     (post) => post.id === action.payload.id
    //   );
    //   if (index !== -1) {
    //     state.posts[index] = action.payload;
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllPosts.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllPosts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.posts = action.payload;
      state.error = null;
    });

    builder.addCase(fetchAllPosts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // delete
    builder.addCase(deletePostApi.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(deletePostApi.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    });

    builder.addCase(deletePostApi.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Create
    builder.addCase(createPostApi.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(createPostApi.fulfilled, (state, action) => {
      state.posts = [...state.posts, action.payload];
      state.error = null;
    });

    builder.addCase(createPostApi.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // update

    builder.addCase(updatePostApi.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });

    builder.addCase(updatePostApi.fulfilled, (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload.data;
      }
    });

    // get post by id

    builder.addCase(getPostById.pending, (state) => {
      state.status = "pending";
      state.error = null;
    });

    builder.addCase(getPostById.fulfilled, (state, action) => {
      state.currentPost = action.payload;
      state.error = null;
    });

    builder.addCase(getPostById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

// export const { addPost, updatePost } = postsSlice.actions;

export default postsSlice.reducer;
