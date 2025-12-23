import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout";
import { StyledComponentsRegistry, ThemeProvider } from "@/lib/styles";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
        <AuthProvider>
          <StyledComponentsRegistry>
            <ThemeProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ThemeProvider>
          </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
