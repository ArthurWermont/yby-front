export type CollectorVolumeOption = {
  id: string;
  label: string;
  liters: number;
  description: string;
  image?: string;
};

export const collectorVolumeOptions: CollectorVolumeOption[] = [
  {
    id: "100",
    label: "100 L",
    liters: 100,
    description: "Tambor redondo pequeno",
    image: "/collectors/collector-100.png",
  },
  {
    id: "200",
    label: "200 L",
    liters: 200,
    description: "Bombona azul média",
    image: "/collectors/collector-200.png",
  },
  {
    id: "240",
    label: "240 L",
    liters: 240,
    description: "Contentor com rodas",
    image: "/collectors/collector-240.png",
  },
  {
    id: "500",
    label: "500 L",
    liters: 500,
    description: "Contentor grande com rodas",
    image: "/collectors/collector-500.png",
  },
  {
    id: "1000",
    label: "1000 L",
    liters: 1000,
    description: "Big Bag",
    image: "/collectors/collector-1000.png",
  },
];

export type CollectorVolumeCounts = Record<string, number>;

export const createEmptyCollectorVolumeCounts = (): CollectorVolumeCounts => {
  return collectorVolumeOptions.reduce((acc, option) => {
    acc[option.id] = 0;
    return acc;
  }, {} as CollectorVolumeCounts);
};

export const calculateTotalLiters = (counts: CollectorVolumeCounts): number => {
  return collectorVolumeOptions.reduce((total, option) => {
    return total + (counts[option.id] || 0) * option.liters;
  }, 0);
};
