import "./globals.css";
export const metadata = { title: "GPP Fit-out Planner — วางผังร้านยาให้ผ่าน GPP", description: "ผู้ช่วยวางแผนร้านยาตามมาตรฐาน GPP" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <script defer src="https://umami-host-peerapongsms-projects.vercel.app/script.js"
          data-website-id="3f09453d-0b39-443e-8845-5e65611cc58a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
