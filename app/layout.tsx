import "./globals.css";

export const metadata = {
  title: "Auricular Acupoints Map (Educational)",
  description: "Educational auricular acupoints visualization (click to highlight)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
