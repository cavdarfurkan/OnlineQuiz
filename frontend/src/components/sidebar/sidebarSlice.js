import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSidebar: false,
  expandedSections: {},
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.showSidebar = true;
    },
    closeSidebar: (state) => {
      state.showSidebar = false;
    },
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    toggleSection: (state, action) => {
      const { index } = action.payload;
      state.expandedSections[index] = !state.expandedSections[index];
    },
  },
});

export const { toggleSidebar, openSidebar, closeSidebar, toggleSection } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;

// const toggleSection = (index) => {
//   setExpandedSections(prevState => ({
//    ...prevState,
//     [index]:!prevState[index]
//   }));
// };
