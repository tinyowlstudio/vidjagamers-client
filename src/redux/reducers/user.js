import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, token: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUserField: (state, action) => {
      //only updates fields specified
      const { field, value } = action.payload;
      state.user[field] = value;
    },
    addFavoriteGame: (state, action) => {
      const gameID = action.payload.gameID;
      state.user.favoriteGames.push(gameID);
    },
    deleteFavoriteGame: (state, action) => {
      const deletedGame = action.payload.gameID;
      state.user.favoriteGames = state.user.favoriteGames.filter(
        //filter takes all the games that are set to true
        //so all games that dont match the ID of the game to be deleted
        //then all the true games replace favorite games
        (gameID) => gameID !== deletedGame
      );
    },
  },
});

export const { setUser, updateUserField, addFavoriteGame, deleteFavoriteGame } = userSlice.actions;
export default userSlice.reducer;
