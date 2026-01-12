import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';
import tasksReducer from '../features/tasks/tasksSlice';

export default configureStore({
  reducer: {
    users: usersReducer,
    tasks: tasksReducer,
  },
});