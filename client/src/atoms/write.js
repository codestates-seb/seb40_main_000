import { atom } from "recoil";

export const titleState = atom({
  key: "title",
  default: "",
});

export const startDateState = atom({
  key: "startDate",
  default: "",
});

export const endDateState = atom({
  key: "endDate",
  default: "",
});

export const imagesState = atom({
  key: "images",
  default: [],
});

export const contentState = atom({
  key: "content",
  default: "",
});

export const placeState = atom({
  key: "place",
  default: "",
});

export const cityState = atom({
  key: "city",
  default: "",
});

export const districtState = atom({
  key: "district",
  default: "",
});

export const streetState = atom({
  key: "street",
  default: "",
});

export const latState = atom({
  key: "lat",
  default: "",
});

export const lngState = atom({
  key: "lng",
  default: "",
});

export const scoreState = atom({
  key: "score",
  default: "",
});
