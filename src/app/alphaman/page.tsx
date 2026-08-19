import { Metadata } from "next";
import AlphamanLanding from "./AlphamanLanding";

export const metadata: Metadata = {
  title: "AlphaMan | Premium Masculine Wellness by BISMILLAH",
  description: "AlphaMan - Editorial masculine wellness. Premium fragrance-inspired grooming ritual for modern men. Pago contra entrega disponible.",
  openGraph: {
    title: "AlphaMan | BISMILLAH Wellness",
    description: "Premium masculine wellness designed for the modern man.",
    images: ["/images/alphaman/alphaman-front.png"],
  },
};

export default function AlphamanPage() {
  return <AlphamanLanding />;
}
