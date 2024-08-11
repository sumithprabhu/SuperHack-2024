import { Inter } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/navbar/NavigationBar";
import Footer from "@/components/footer/Footer";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RaiseCoin",
  description: "",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <main className="w-full  bg-white ">
        <Toaster position="top-center" reverseOrder={false} />

          <NavigationBar />
          {children}
          <Footer />
        </main>
        </Providers>
      </body>
    </html>
  );
}
