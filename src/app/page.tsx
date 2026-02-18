import HomePage from "./components/HomePage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Accueil",
  description: "Rejoignez la communauté Bitcoin Béninoise. Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin grâce à nos événements, formations et ressources éducatives.",
};

export default function Home() {
  return <HomePage />;
}
