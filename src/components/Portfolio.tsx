import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import {
  Menu,
  X,
  Mail,
  ExternalLink,
  Code2,
  Download,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Loader2,
  Github,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confetti from 'canvas-confetti';
import { FaWhatsapp } from 'react-icons/fa';

// --- Types & Interfaces ---

interface Project {
  title: string;
  description: string;
  tags: string[];
  category: "Frontend" | "Backend" | "Full Stack";
  demoLink?: string;
  sourceLink?: string;
  image: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

interface Skill {
  name: string;
  icon: string;
}

// --- Données Optimisées (Orientées Bénéfices Clients) ---

const skills: Skill[] =[
  { name: "React & Next.js", icon: "https://skillicons.dev/icons?i=react,nextjs" },
  { name: "Node.js & NestJS", icon: "https://skillicons.dev/icons?i=nodejs,nestjs" },
  { name: "PostgreSQL & MongoDB", icon: "https://skillicons.dev/icons?i=postgres,mongo" },
  { name: "Git & Docker", icon: "https://skillicons.dev/icons?i=git,docker" },
];

const projects: Project[] =[
  {
    title: "Boutique POS",
    // Copywriting: Focus sur le problème résolu (gestion) et le bénéfice (analyse financière)
    description: "Solution complète de point de vente. Permet aux gérants de digitaliser leurs ventes, d'éditer des factures PDF et de suivre leur rentabilité en temps réel.",
    tags:["React", "TypeScript", "Tailwind", "Node.js"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/Gio-Boutique",
    image: "https://i.ibb.co/nsB0kthk/Shared-Screenshot.jpg"
  },
  {
    title: "Taskflow",
    description: "Outil de productivité conçu pour éliminer la friction dans la gestion de projet. Interface ultra-fluide pour organiser et accomplir ses tâches au quotidien.",
    tags: ["React", "Tailwind"],
    category: "Frontend",
    demoLink: "https://georgiovigni-dev-tech.github.io/taskflow/",
    sourceLink: "https://github.com/georgiovigni-dev-tech/taskflow",
    image: "https://i.ibb.co/v4ksT4b8/Shared-Screenshot.jpg"
  },
  {
    title: "Ocrprint",
    description: "SaaS intelligent extrayant automatiquement le texte depuis des images (OCR). Fait gagner des heures de saisie manuelle grâce à la conversion PDF automatisée.",
    tags:["Node.js", "Express", "Tesseract.js", "React"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/OCRPrint-",
    image: "https://i.ibb.co/LDwnc3JG/Shared-Screenshot.jpg"
  }
];

const experiences: Experience[] =[
  {
    company: "2CL SERVICES",
    role: "Développeur Web",
    period: "Fév. 2025 - Présent",
    description: "Création d'architectures web robustes (React/Next.js) et mise en place d'un outil de supervision réseau pour optimiser la disponibilité du parc informatique."
  },
  {
    company: "TPAPY",
    role: "Développeur Full Stack",
    period: "Juil. - Oct. 2024",
    description: "Développement d'une plateforme e-commerce performante sous Laravel et conception d'interfaces dynamiques générant une meilleure rétention utilisateur."
  },
  {
    company: "TPAPY",
    role: "Intégrateur Web",
    period: "Juil. - Oct. 2023",
    description: "Intégration pixel-perfect de maquettes Figma en PHP/Bootstrap. Focus sur le responsive design pour garantir une expérience mobile irréprochable."
  }
];

// --- Composant Principal ---

const Portfolio: React.FC = () => {
  const[isMenuOpen, setIsMenuOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const[isSending, setIsSending] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (itemName: string) => {
    let targetId = 'home';

    switch (itemName) {
      case 'Accueil': targetId = 'home'; break;
      case 'À propos': targetId = 'about'; break;
      case 'Compétences': targetId = 'competences'; break;
      case 'Projets': targetId = 'projets'; break;
      case 'Expériences': targetId = 'experiences'; break;
      case 'Contact': targetId = 'contact'; break;
      default: targetId = 'home';
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors:['#8b5cf6', '#d946ef', '#ffffff']
    });

    toast.success("Téléchargement de mon CV en cours !", {
      position: "top-right", 
      theme: "dark",
      autoClose: 3000
    });
  };

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSending(true);

    const SERVICE_ID = 'service_2zxgywd'; 
    const TEMPLATE_ID = 'template_iy2f6zp'; 
    const PUBLIC_KEY = 'nvS4Lg5Z5St1xXmGR'; 

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY })
      .then(
        () => {
          toast.success("Demande envoyée ! Je vous réponds sous 24h.", {
            theme: "dark",
            position: "top-right",
            autoClose: 5000
          });
          formRef.current?.reset(); 
        },
        (error) => {
          console.error('FAILED...', error.text);
          toast.error("Une erreur est survenue. N'hésitez pas à m'écrire sur WhatsApp.", {
            theme: "dark",
            position: "top-right"
          });
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  const navItems =['Accueil', 'À propos', 'Compétences', 'Projets', 'Expériences', 'Contact'];

  return (
    <div className="min-h-screen bg-[#0f0715] text-gray-200 font-sans selection:bg-violet-500 selection:text-white relative">
      <ToastContainer position="top-right" style={{ zIndex: 9999, marginTop: '60px' }} />

      {/* --- Bouton WhatsApp Flottant (CRO: Réduit la friction de contact) --- */}
      <a 
        href="https://wa.me/2290191142478?text=Bonjour%20Georgio,%20j'ai%20un%20projet%20dont%20j'aimerais%20te%20parler." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:bg-[#20bd5a] transition-all z-50 flex items-center justify-center group"
        aria-label="Me contacter sur WhatsApp"
      >
        <FaWhatsapp size={28} />
        <span className="absolute right-full mr-4 bg-[#1a0b2e] border border-violet-900/50 text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
          Réponse rapide
        </span>
      </a>

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-40 bg-[#0f0715]/90 backdrop-blur-md border-b border-violet-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="shrink-0 cursor-pointer" onClick={() => handleNavClick('Accueil')}>
              <span className="text-2xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
                Georgio<span className="text-white">.V</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center">
              <div className="ml-10 flex items-baseline space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className="hover:text-violet-400 transition-colors px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
              {/* CRO: Mini CTA direct dans la navigation */}
              <button 
                onClick={scrollToContact}
                className="ml-6 px-4 py-2 bg-violet-600/20 text-violet-400 border border-violet-500/50 hover:bg-violet-600 hover:text-white rounded-lg text-sm font-bold transition-all"
              >
                Démarrer un projet
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#1a0b2e] border-b border-violet-900/50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  {item}
                </button>
              ))}
              <button 
                onClick={() => { scrollToContact(); setIsMenuOpen(false); }}
                className="w-full mt-2 bg-violet-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"
              >
                Discutons de votre projet
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- Header / Hero (CRO: Focus sur la promesse et l'appel à l'action) --- */}
      <section id="home" className="pt-24 pb-12 md:pt-40 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row text-center items-center gap-12 min-h-[90vh]">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative order-1 md:order-2">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 group">
            <div className="absolute inset-0 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
            <img 
              src="https://i.ibb.co/4R6BFQh3/IMG-20251227-134143.jpg" 
              alt="Georgio Vignizogbin - Développeur" 
              className="relative w-full h-full object-cover rounded-full border-4 border-violet-500/30 shadow-2xl z-10"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left space-y-6 order-2 md:order-1">
          {/* CRO: Accroche client-centric */}
          <h2 className="text-sm md:text-base text-violet-400 font-semibold tracking-wide uppercase flex items-center justify-center md:justify-start gap-2">
            <span className="w-8 h-px bg-violet-400"></span>
            Expertise Technique & Fiabilité
          </h2>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Je transforme vos idées en <br className="hidden md:block"/>
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-violet-400 text-transparent bg-clip-text font-extrabold pb-2">
              applications rentables.
            </span>
          </h1>

          {/* CRO: On explique concrètement la valeur ajoutée */}
          <p className="text-gray-400 max-w-lg mx-auto md:mx-0 text-lg leading-relaxed">
            Je suis Georgio, Développeur Full Stack. J'aide les entreprises et entrepreneurs à construire des solutions web performantes, scalables et intuitives pour automatiser leur croissance.
          </p>
          
          {/* CRO: CTA Primaire (Action) + Secondaire (Réassurance) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
            <button
              onClick={scrollToContact}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-violet-600/30 hover:scale-105"
            >
              Parlez-moi de votre projet <ArrowRight size={20} />
            </button>
            <a
              href="/cv.pdf"
              download="CV_Georgio_Vignizogbin.pdf"
              onClick={handleDownloadCV}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-violet-500/50 hover:bg-violet-900/30 text-white px-8 py-4 rounded-full font-medium transition-all"
            >
              <Download size={20} />
              Voir mon CV
            </a>
          </div>

          {/* CRO: Social Proof / Trust badges pour rassurer en 5 secondes */}
          <div className="flex items-center justify-center md:justify-start gap-6 pt-6 text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" /> Dispo immédiatement
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-violet-400" /> Réponse sous 24h
            </div>
          </div>
        </div>
      </section>

      {/* --- À propos (CRO: Pourquoi moi ?) --- */}
      <section id="about" className="py-20 bg-[#13091e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="border-b-4 border-violet-500 pb-2">Pourquoi travailler avec moi ?</span>
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3">
                <div className="rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)] rotate-3 hover:rotate-0 transition-transform duration-500 border border-violet-500/20 relative">
                  <div className="absolute inset-0 bg-violet-900/10 mix-blend-overlay"></div>
                  <img src="https://i.ibb.co/Dfrcytgn/Generated-Image-October-31-2025-2-49-AM.png" alt="Georgio - Code" className="w-full h-auto object-cover" />
                </div>
            </div>
            <div className="w-full md:w-2/3 space-y-6">
                <h3 className="text-2xl font-semibold text-white">Un partenaire technique pour votre réussite</h3>
                
                {/* Copywriting: orienté bénéfice. Ce que ça lui rapporte à lui */}
                <p className="text-gray-400 leading-relaxed text-lg">
                  Plus qu'un simple exécutant, j'agis comme un partenaire pour votre projet. Mon objectif n'est pas seulement d'écrire du code, mais de <strong className="text-violet-300 font-medium">résoudre vos problèmes business</strong> grâce à la technologie.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Spécialisé dans l’écosystème JavaScript/TypeScript et PHP, je conçois des applications robustes capables d'évoluer avec votre entreprise. J'accorde une importance primordiale à l'expérience de vos utilisateurs finaux et à la sécurité de vos données (Clean Code, architectures scalables).
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div className="flex items-start gap-3 bg-[#1a0b2e] p-4 rounded-xl border border-violet-900/30">
                    <Code2 className="text-violet-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-medium">Code Maintenable</h4>
                      <span className="text-sm text-gray-500">Pour réduire vos coûts futurs</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-[#1a0b2e] p-4 rounded-xl border border-violet-900/30">
                    <MapPin className="text-violet-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-medium">Basé au Bénin</h4>
                      <span className="text-sm text-gray-500">Collaboration 100% remote fluide</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Compétences --- */}
      <section id="competences" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="border-b-4 border-violet-500 pb-2">Les outils au service de vos idées</span>
            </h2>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              Je maîtrise une stack technologique moderne pour vous garantir des applications rapides, sécurisées et prêtes pour l'avenir.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div key={skill.name} className="bg-[#1a0b2e] p-6 rounded-xl border border-violet-900/30 hover:border-violet-500 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:-translate-y-2 flex flex-col items-center justify-center gap-4 text-center group cursor-default">
                <div className="h-16 w-full flex items-center justify-center">
                    <img 
                        src={skill.icon} 
                        alt={skill.name} 
                        className="h-14 w-auto drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                    {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Projets --- */}
      <section id="projets" className="py-20 bg-[#13091e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="border-b-4 border-violet-500 pb-2">Ils m'ont fait confiance</span>
            </h2>
            <p className="text-gray-400 max-w-2xl text-center">
              Découvrez comment j'ai aidé d'autres entreprises à digitaliser leurs processus à travers des cas d'usage concrets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project, index) => (
              <div key={index} className="group flex flex-col bg-[#1a0b2e] rounded-xl overflow-hidden border border-violet-900/30 hover:border-violet-500/50 transition-all hover:shadow-2xl hover:shadow-violet-900/20 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-violet-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`text-white text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-lg ${
                        project.category === 'Frontend' ? 'bg-blue-600/80 border-blue-400/50' :
                        project.category === 'Backend' ? 'bg-emerald-600/80 border-emerald-400/50' :
                        'bg-violet-600/80 border-violet-400/50'
                    }`}>
                        {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-grow leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-violet-900/40 text-violet-300 rounded-md border border-violet-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between gap-3">
                    {project.sourceLink && project.sourceLink !== "#" && (
                      <a 
                        href={project.sourceLink} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 px-3 rounded-lg border border-violet-600 text-violet-400 hover:bg-violet-600 hover:text-white transition-all text-sm font-medium"
                      >
                        <Github size={16} /> Code Source
                      </a>
                    )}
                    
                    {project.demoLink && project.demoLink !== "#" && (
                      <a 
                        href={project.demoLink} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all text-sm font-medium shadow-lg shadow-violet-900/30"
                      >
                        <ExternalLink size={16} /> Voir en direct
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length > 3 && (
            <div className="flex justify-center items-center mt-12 gap-2">
                <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#1a0b2e] border border-violet-900/30 text-gray-300 hover:text-white hover:border-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === number
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                            : 'bg-[#1a0b2e] border border-violet-900/30 text-gray-400 hover:text-white hover:border-violet-500'
                        }`}
                    >
                        {number}
                    </button>
                ))}

                <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#1a0b2e] border border-violet-900/30 text-gray-300 hover:text-white hover:border-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
          )}
        </div>
      </section>

      {/* --- Expériences --- */}
      <section id="experiences" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="border-b-4 border-violet-500 pb-2">Mon Parcours</span>
          </h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-violet-600 before:to-transparent">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-violet-500 bg-[#0f0715] shadow-[0_0_15px_rgba(139,92,246,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <ChevronRight size={20} className="text-violet-400" />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1a0b2e] p-6 rounded-xl border border-violet-900/30 shadow-lg hover:border-violet-500/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <span className="font-bold text-white text-lg">{exp.company}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-violet-900/40 text-violet-300 border border-violet-800 rounded self-start sm:self-auto whitespace-nowrap">{exp.period}</span>
                  </div>
                  <div className="text-fuchsia-400 font-medium mb-3">{exp.role}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact (CRO: Machine à conversion finale) --- */}
      <section id="contact" className="py-24 bg-[#13091e] border-t border-violet-900/20 relative overflow-hidden">
        {/* Décors en arrière-plan pour le focus */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prêt à <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">concrétiser votre projet ?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Que vous ayez une idée précise en tête ou besoin d'un accompagnement technique, discutons-en. Je vous réponds avec une analyse technique sous 24 heures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Bloc contact direct (rassure le client et propose une alternative) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#1a0b2e] p-6 rounded-2xl border border-violet-900/30">
                <h3 className="text-white font-bold text-lg mb-4">Mes coordonnées</h3>
                <a href="mailto:votre-email@exemple.com" className="flex items-center gap-4 text-gray-400 hover:text-violet-400 transition-colors mb-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#0f0715] flex items-center justify-center border border-violet-900/50 group-hover:border-violet-500">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm">Envoyez-moi un email</span>
                </a>
                <a href="https://wa.me/2290191142478" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-[#25D366] transition-colors mb-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#0f0715] flex items-center justify-center border border-violet-900/50 group-hover:border-[#25D366]">
                    <FaWhatsapp size={18} />
                  </div>
                  <span className="text-sm">(+229) 01 91 14 24 78</span>
                </a>
              </div>

              <div className="bg-linear-to-br from-violet-900/40 to-[#1a0b2e] p-6 rounded-2xl border border-violet-500/30">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Zap className="text-amber-400" size={20} /> Processus simple
                </h4>
                <ol className="text-sm text-gray-400 space-y-3 mt-4">
                  <li className="flex gap-2"><span className="text-violet-400 font-bold">1.</span> Vous me décrivez votre besoin.</li>
                  <li className="flex gap-2"><span className="text-violet-400 font-bold">2.</span> J'analyse et propose une solution.</li>
                  <li className="flex gap-2"><span className="text-violet-400 font-bold">3.</span> Nous validons et commençons !</li>
                </ol>
              </div>
            </div>

            {/* Formulaire orienté UX */}
            <div className="lg:col-span-2">
              <form 
                ref={formRef}
                onSubmit={sendEmail}
                className="bg-[#1a0b2e] p-8 rounded-2xl border border-violet-900/30 shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Comment vous appelez-vous ?</label>
                    <input 
                      type="text" 
                      name="user_name"
                      id="name" 
                      required
                      className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-gray-600"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Votre adresse email</label>
                    <input 
                      type="email" 
                      name="user_email"
                      id="email" 
                      required
                      className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-gray-600"
                      placeholder="jean@entreprise.com"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Le sujet de votre message</label>
                  <input 
                    type="text" 
                    name="subject"
                    id="subject" 
                    required
                    className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-gray-600"
                    placeholder="Refonte de mon site web, Création d'application..."
                  />
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Détails du projet</label>
                  <textarea 
                    name="message"
                    id="message" 
                    rows={5} 
                    required
                    className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-gray-600 resize-y"
                    placeholder="Expliquez-moi brièvement vos objectifs, vos défis et ce que vous attendez de moi..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSending}
                  className="w-full bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="animate-spin" size={24} /> Envoi en cours...
                    </>
                  ) : (
                    <>
                      Obtenir mon estimation gratuite <Mail size={24} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <CheckCircle size={12} /> Vos données restent strictement confidentielles.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#0a0410] py-8 border-t border-violet-900/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Georgio Vignizogbin. Développé avec passion.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Note: Petite astuce pour importer "Zap" de lucide-react (utilisé dans le Contact)
const Zap = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default Portfolio;