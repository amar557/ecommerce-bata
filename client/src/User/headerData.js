/**
 * Static nav groups. "Accessories" children are rendered in Header from the Accessory API.
 * Super Sale links go to /products with offer + optional gender filters.
 */
export const categoriesArray = [
  // {
  //   title: "Bags",
  //   link: "/bags",
  //   children: [
  //     { title: "Red Label", link: "/bags/red-label" },
  //     { title: "Prive", link: "/bags/prive" },
  //     { title: "Power", link: "/bags/power" },
  //     { title: "NorthStar", link: "/bags/northstar" },
  //     { title: "Laptop Bags", link: "/bags/laptop-bags" },
  //     { title: "B-first", link: "/bags/b-first" },
  //     { title: "School Bags", link: "/bags/school-bags" },
  //   ],
  // },
  {
    title: "Accessories",
    link: "/products",
    /** Header.jsx fills dropdown from GET /api/nav (accessory catalog) */
    dynamicAccessories: true,
  },
  {
    title: "Super Sale",
    link: "/products?offer=true",
    children: [
      { title: "Men", link: "/products?gender=male&offer=true" },
      { title: "Women", link: "/products?gender=female&offer=true" },
      { title: "Kids", link: "/products?gender=kids&offer=true" },
    ],
  },
  // {
  //   title: "Bata Club",
  //   link: "/bata-club",
  // },
  // {
  //   title: "B-mag",
  //   link: "/b-mag",
  // },
  // {
  //   title: "Bata Industrials",
  //   link: "/bata-industrials",
  //   children: [
  //     {
  //       title: "About",
  //       link: "/about",
  //     },
  //     {
  //       title: "Collection",
  //       link: "/collection",
  //     },
  //   ],
  // },
];
