import "./globals.css";

export const metadata = {
  title: "PassaBola",
  description:
    "Sua plataforma para organizar e participar de jogos de futebol.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
