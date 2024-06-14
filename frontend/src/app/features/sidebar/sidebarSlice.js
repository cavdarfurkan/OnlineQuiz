import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSidebar: false,
  menuItems: [
    {
      index: 0,
      visible: true,
      roles: ["student", "teacher", "admin"],
      title: "Home",
      icon: "house",
      path: "/dashboard",
    },
    {
      index: 1,
      visible: true,
      roles: ["student", "teacher"],
      title: "Courses",
      icon: "school",
      children: [
        {
          index: 8,
          visible: true,
          roles: ["teacher"],
          title: "New Course",
          path: "/courses/new",
        },
        {
          index: 2,
          visible: true,
          roles: ["student", "teacher"],
          title: "List",
          path: "/courses",
        },
        {
          index: 3,
          visible: true,
          roles: ["student"],
          title: "Join",
          path: "/courses/join",
        },
        {
          index: 5,
          visible: false,
          roles: ["teacher"],
          title: "Exams",
        },
      ],
    },
    {
      index: 4,
      visible: false,
      roles: ["student", "teacher"],
      title: "Exams",
      path: "courses/:courseId/exams",
    },
    {
      index: 6,
      visible: false,
      roles: ["teacher"],
      title: "Edit Course",
      path: "/courses/:courseId/edit",
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
