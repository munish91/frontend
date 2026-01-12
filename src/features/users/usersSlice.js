import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query { users { id name email } }` }),
  });
  const json = await res.json();
  return json.data?.users || [];
});

export const createUser = createAsyncThunk('users/createUser', async ({ name, email }) => {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation ($name: String!, $email: String!) { createUser(name: $name, email: $email) { id name email } }`,
      variables: { name, email },
    }),
  });
  const json = await res.json();
  return json.data?.createUser;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(createUser.fulfilled, (state, action) => { if (action.payload) state.list.push(action.payload); });
  },
});

export default usersSlice.reducer;
