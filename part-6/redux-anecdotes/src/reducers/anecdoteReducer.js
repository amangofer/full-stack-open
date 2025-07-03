import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },

    setAnecdotes(state, action) {
      return action.payload;
    },
    updateAnecdotes(state, action) {
      return state
        .map((anecdote) =>
          anecdote.id === action.payload.id ? action.payload : anecdote,
        )
        .sort((a, b) => b.votes - a.votes);
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes.sort((a, b) => b.votes - a.votes)));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createAnecdotes(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteFor = (anecdote) => {
  return async (dispatch) => {
    const voted = { ...anecdote, votes: anecdote.votes + 1 };
    const response = await anecdoteService.updateVote(anecdote.id, voted);
    dispatch(updateAnecdotes(response));
  };
};

export default anecdoteSlice.reducer;
