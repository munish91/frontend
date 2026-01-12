import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async ({ tab, search } = {}) => {
  const query = `query ($tab: String, $search: String) { tasks(tab: $tab, search: $search) { id name startTime endTime owner tab } }`;
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { tab, search } }),
  });
  const json = await res.json();
  return json.data?.tasks || [];
});

export const createTask = createAsyncThunk('tasks/createTask', async (payload) => {
  const query = `mutation ($name: String!, $startTime: String, $endTime: String, $owner: String, $tab: String) { createTask(name: $name, startTime: $startTime, endTime: $endTime, owner: $owner, tab: $tab) { id name startTime endTime owner tab } }`;
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: payload }),
  });
  const json = await res.json();
  return json.data?.createTask;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, ...payload }) => {
  const query = `mutation ($id: ID!, $name: String, $startTime: String, $endTime: String, $owner: String, $tab: String) { updateTask(id: $id, name: $name, startTime: $startTime, endTime: $endTime, owner: $owner, tab: $tab) { id name startTime endTime owner tab } }`;
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id, ...payload } }),
  });
  const json = await res.json();
  return json.data?.updateTask;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  const query = `mutation ($id: ID!) { deleteTask(id: $id) }`;
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } }),
  });
  const json = await res.json();
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
  state.status = 'succeeded';
        state.list = (action.payload || []).map((it) => {
          if (!it) return it;
          const item = { ...it };
          if (!item.id && item._id) item.id = item._id;
          // normalize startTime/endTime to ISO or null
          if (item.startTime) {
            let val = item.startTime;
            if (typeof val === 'string' && /^\d+$/.test(val)) val = Number(val);
            const sd = new Date(val);
            item.startTime = Number.isNaN(sd.getTime()) ? null : sd.toISOString();
          } else {
            item.startTime = null;
          }
          if (item.endTime) {
            let val = item.endTime;
            if (typeof val === 'string' && /^\d+$/.test(val)) val = Number(val);
            const ed = new Date(val);
            item.endTime = Number.isNaN(ed.getTime()) ? null : ed.toISOString();
          } else {
            item.endTime = null;
          }
          return item;
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload) {
          const raw = action.payload;
          const it = { ...raw };
          if (!it.id && it._id) it.id = it._id;
          if (it.startTime) {
            const sd = new Date(it.startTime);
            it.startTime = Number.isNaN(sd.getTime()) ? null : sd.toISOString();
          } else {
            it.startTime = null;
          }
          if (it.endTime) {
            const ed = new Date(it.endTime);
            it.endTime = Number.isNaN(ed.getTime()) ? null : ed.toISOString();
          } else {
            it.endTime = null;
          }
          state.list.push(it);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (!action.payload) return;
        const raw = action.payload;
        const payload = { ...raw };
        if (!payload.id && payload._id) payload.id = payload._id;
        if (payload.startTime) {
          const sd = new Date(payload.startTime);
          payload.startTime = Number.isNaN(sd.getTime()) ? null : sd.toISOString();
        } else {
          payload.startTime = null;
        }
        if (payload.endTime) {
          const ed = new Date(payload.endTime);
          payload.endTime = Number.isNaN(ed.getTime()) ? null : ed.toISOString();
        } else {
          payload.endTime = null;
        }
        const idx = state.list.findIndex((t) => t.id === payload.id);
        if (idx !== -1) state.list[idx] = payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
