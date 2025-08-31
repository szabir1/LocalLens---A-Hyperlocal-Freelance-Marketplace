const currentUser = JSON.parse(localStorage.getItem("currentUser"));

export const INITIAL_STATE = {
  userId: currentUser?._id || currentUser?.id, // ✅ works with _id or id
  title: "",
  cat: "",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revisionNumber: 0,
  features: [],
  price: 0,
};

export const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: ["price", "deliveryTime", "revisionNumber"].includes(
          action.payload.name
        )
          ? Number(action.payload.value) // ✅ convert numbers properly
          : action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter((feature) => feature !== action.payload),
      };
    default:
      return state;
  }
};
