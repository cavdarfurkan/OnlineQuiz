import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSidebar: false,
  menuItems: [
    {
      index: 0,
      visible: true,
      title: "Home",
      icon: "house",
      path: "/dashboard",
    },
    {
      index: 1,
      visible: true,
      title: "Courses",
      icon: "school",
      children: [
        {
          index: 2,
          visible: true,
          title: "List",
          path: "/courses",
        },
        {
          index: 3,
          visible: true,
          title: "Join",
          path: "/courses/join",
        },
      ],
    },
    {
      index: 4,
      visible: false,
      title: "Exams",
      // icon: "",
      path: "courses/:courseId/exams",
    },
  ],
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
    changeMenuItemVisibility: (state, action) => {
      const { index, show } = action.payload;
      state.menuItems = state.menuItems.map((item) => {
        if (item.index === index) {
          return {
            ...item,
            visible: show,
          };
        }
        return item;
      });
    },
    updateMenuItemPath: (state, action) => {
      const { index, path } = action.payload;
      state.menuItems = state.menuItems.map((item) => {
        if (item.index === index) {
          return {
            ...item,
            path,
          };
        }
        return item;
      });
    },
    resetMenuItems: (state) => {
      state.menuItems = initialState.menuItems;
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleSection,
  changeMenuItemVisibility,
  updateMenuItemPath,
  resetMenuItems,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
