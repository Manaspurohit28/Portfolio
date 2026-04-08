// src/app/layout.jsx
import './globals.css';

export const metadata = {
  title:       'Manas Purohit — Software Developer',
  description: 'Portfolio of Manas Purohit, Software Developer specializing in Python, ML, and Full Stack development.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}