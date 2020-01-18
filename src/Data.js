let initialItems = [
  {
    description: "Nice boats. 50% off. wow.",
    price: 10000,
    inventory: 10,
    image: "/boat.png",
    id: "asewq",
    sellerId: "ewio"
  },
  {
    id: "wqwasq",
    description: "Lawn chairs",
    price: 50,
    inventory: 100,
    image: "/lawnchair.jpg",
    sellerId: "xcvb"
  },
  {
    description: "Pad for kids.",
    price: 50,
    inventory: 20,
    image: "/kpad.jpg",
    id: "kidaa",
    sellerId: "kpad"
  },
  {
    description: "Nice shoes.",
    price: 100,
    inventory: 10,
    image: "/shoes.jpg",
    id: "shoeee",
    sellerId: "nike"
  },
  {
    description: "Nice shoes for girls.",
    price: 100,
    inventory: 80,
    image: "/fShoes.jfif",
    id: "fshoee",
    sellerId: "nike"
  }
];
let initialSellers = [
  {
    id: "ewio",
    name: "Jack Frost",
    rating: "5 stars"
  },
  {
    id: "xcvb",
    name: "Hank Green",
    rating: "2 stars"
  },
  {
    id: "kpad",
    name: "Kid pad",
    rating: "5 stars"
  },
  {
    id: "nike",
    name: "Nike sports",
    rating: "5 stars"
  }
];
let reviews = [
  {
    rid: "rw001",
    reviewer: "bob",
    itemId: "fshoee",
    contents: "beatiful shoes!"
  },
  {
    rid: "rw002",
    reviewer: "sue",
    itemId: "kidaa",
    contents: "good pad!"
  },
  {
    rid: "rw003",
    reviewer: "karl",
    itemId: "asewq",
    contents: "Best boat in the world"
  },
  {
    rid: "rw004",
    reviewer: "sue",
    itemId: "wqwasq",
    contents: "Damaged chair"
  },
  {
    rid: "rw005",
    reviewer: "bob",
    itemId: "shoeee",
    contents: "Shoes hurt"
  },
  {
    rid: "rw006",
    reviewer: "sue",
    itemId: "shoeee",
    contents: "Shoes not bad"
  }
];

export { initialItems, initialSellers, reviews };
