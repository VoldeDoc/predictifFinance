
import Navbar from "@/components/Layout/header/navbar"
import Footer from "./footer/footer"
// import '../../../public/assets/bootstrap/bootstrap.min.css'
// import '../../../public/assets/bootstrap/bootstrap.min.js'
interface Props {
    children: React.ReactNode
    }

export default function LandingPageLayout({ children }: Props) {
  return (
    <>
    <Navbar/>
    <main>
        {children}
    </main>
    <Footer/>
    </>
  )
}
