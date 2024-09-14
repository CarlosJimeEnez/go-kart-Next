
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./ui/live-map"
import Sidebar from "./ui/sidebar"
import LiveMap from "./ui/live-map";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container-fluid">
        <div className="row">

          <div className="col-md-1 d-none d-md-block">
            <Sidebar/>
          </div>         
          
          <div className="col-md-11">
            <div className="container my-5">
              <div className="row g-3 justify-content-start">
                <div className="col-md-6">
                  <LiveMap/>
                </div>
              </div>

            </div>
          </div>
        
        </div>
        <main>{children}</main>
      </body>
    </html>
  )
}