export interface Hotel {
    name: string;
    location: string;
    rating: number;
    tokenSupply: number;
    mintingPrice: number;
    tokenSymbol: string;
    image: string;
  }
  
  export const mockHotels: Hotel[] = [
    {
      name: "Azure Palace",
      location: "Santorini, Greece",
      rating: 4.9,
      tokenSupply: 1000000,
      mintingPrice: 1.5,
      tokenSymbol: "AZUR",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Emerald Valley Resort",
      location: "Bali, Indonesia",
      rating: 4.8,
      tokenSupply: 1500000,
      mintingPrice: 1.2,
      tokenSymbol: "EMRD",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "The Crimson Peak",
      location: "Aspen, Colorado",
      rating: 4.9,
      tokenSupply: 800000,
      mintingPrice: 2.0,
      tokenSymbol: "CRIM",
      image: "https://images.unsplash.com/photo-1615880342742-6e47ba86b6cf?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Sapphire Bay Hotel",
      location: "Maldives",
      rating: 4.9,
      tokenSupply: 1200000,
      mintingPrice: 1.8,
      tokenSymbol: "SAPH",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1974&auto=format&fit=crop",
    },
    {
        name: "Golden Sands Oasis",
        location: "Dubai, UAE",
        rating: 4.8,
        tokenSupply: 2000000,
        mintingPrice: 1.6,
        tokenSymbol: "GOLD",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    },
  ];