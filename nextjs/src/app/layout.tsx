import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout";
import { StyledComponentsRegistry, ThemeProvider } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Pagine Azzurre - Marketplace Italiano",
  description: "Pagine Azzurre - VALorizzatore del AZione COncordata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
