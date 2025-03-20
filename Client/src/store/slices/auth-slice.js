export const createAuthSlice = (set) => ({
  userInfo: undefined, //state
  setUserInfo: (userInfo) => set({ userInfo }), // set method 
});
