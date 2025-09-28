export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
    selectMenu: {
      slots: {
        content: "min-w-fit",
      },
    },
    select: {
      slots: {
        content: "min-w-fit",
      },
    },
    tabs: {
      slots: {
        trigger: "cursor-pointer",
      },
    },
  },
});
