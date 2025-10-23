import { AuthProvider } from "@/app/context/AuthContext";
import { ToastProvider } from "@/app/context/ToastContext";
import { NotificationProvider } from "@/app/context/NotificationContext";
import { ChatProvider } from "@/app/context/ChatContext";
import "./globals.css";

export const metadata = {
  title: "PassaBola",
  description:
    "Sua plataforma para organizar e participar de jogos de futebol.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <ChatProvider>
              <ToastProvider>{children}</ToastProvider>
            </ChatProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
