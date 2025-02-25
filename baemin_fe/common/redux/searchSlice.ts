import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  results: string[];
}

const initialState: SearchState = {
  results: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<string[]>) => {
      state.results = action.payload;
    },
  },
});

export const { setResults } = searchSlice.actions;
export default searchSlice.reducer;
