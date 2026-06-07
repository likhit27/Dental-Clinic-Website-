import { FloatingCtas } from './components/layout/FloatingCtas';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { About } from './components/sections/About';
import { Accolades } from './components/sections/Accolades';
import { Appointment } from './components/sections/Appointment';
import { Gallery } from './components/sections/Gallery';
import { Hero } from './components/sections/Hero';
import { PatientInfo } from './components/sections/PatientInfo';
import { Services } from './components/sections/Services';
import { Testimonials } from './components/sections/Testimonials';
import { navLinks } from './data/siteContent';
import { useActiveSection } from './hooks/useActiveSection';

const sectionIds = navLinks.map((link) => link.id);

function App() {
  const activeSection = useActiveSection(sectionIds);

  return (
    <>
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Services />
        <PatientInfo />
        <Testimonials />
        <Accolades />
        <Gallery />
        <Appointment />
      </main>
      <Footer />
      <FloatingCtas activeSection={activeSection} />
    </>
  );
}

export default App;
