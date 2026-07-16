export type CollectorVolumeOption = {
  id: string;
  label: string;
  liters: number;
  description: string;
  image?: string;
};

export const collectorVolumeOptions: CollectorVolumeOption[] = [
  {
    id: "50",
    label: "50 L",
    liters: 50,
    description: "Coletor pequeno",
    image: "/collectors/collector-50.png",
  },
  {
    id: "200",
    label: "200 L",
    liters: 200,
    description: "Tambor médio",
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
    id: "550",
    label: "550 L",
    liters: 550,
    description: "Coletor grande",
    image: "/collectors/collector-550.png",
  },
  {
    id: "1000",
    label: "1000 L",
    liters: 1000,
    description: "Big coletor",
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
