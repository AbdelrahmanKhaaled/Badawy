import { Award, Building2, CalendarCheck, Camera, Clapperboard, Gem, MapPin, Megaphone, MonitorPlay, Presentation, Settings, Sparkles, Trophy, User, Users, Video, Warehouse, type LucideProps } from "lucide-react";

const map = {
  map: MapPin,
  building: Building2,
  calendar: CalendarCheck,
  clapper: Clapperboard,
  megaphone: Megaphone,
  presentation: Presentation,
  sparkles: Sparkles,
  user: User,
  studio: Warehouse,
  camera: Camera,
  video: Video,
  monitor: MonitorPlay,
  play: MonitorPlay,
  gem: Gem,
  settings: Settings,
  award: Award,
  users: Users,
  trophy: Trophy,
} as const;

export type IconName = keyof typeof map;

export default function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = map[name];
  return <C strokeWidth={1.3} aria-hidden="true" {...props} />;
}
