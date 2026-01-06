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
  Calendar,
  Loader2,
  Github 
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

// --- Données ---

const skills: Skill[] = [
  { name: "React & Next.js", icon: "https://skillicons.dev/icons?i=react,nextjs" },
  { name: "Node.js & NestJS", icon: "https://skillicons.dev/icons?i=nodejs,nestjs" },
  { name: "PostgreSQL & MongoDB", icon: "https://skillicons.dev/icons?i=postgres,mongo" },
  { name: "Git & Docker", icon: "https://skillicons.dev/icons?i=git,docker" },
];

const projects: Project[] = [
  {
    title: "Boutique POS",
    description: "Une application conçue pour les petites et moyennes boutiques permettant la gestion des ventes, l'impression de reçus PDF et l'analyse financière.",
    tags: ["React", "TypeScript", "Tailwind", "Recharts",  "Node.js"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/Gio-Boutique",
    image: "https://i.ibb.co/nsB0kthk/Shared-Screenshot.jpg"
  },
  {
    title: "Taskflow",
    description: "Application de gestion de tâches avec interface intuitive permettant d'ajouter, d'accomplir et de supprimer des tâches.",
    tags: ["React js", "Tailwind"],
    category: "Frontend",
    demoLink: "https://georgiovigni-dev-tech.github.io/taskflow/",
    sourceLink: "https://github.com/georgiovigni-dev-tech/taskflow",
    image: "https://i.ibb.co/v4ksT4b8/Shared-Screenshot.jpg"
  },
  {
    title: "Ocrprint",
    description: "Application web Full Stack permettant de convertir des images en documents PDF, avec extraction automatique de texte (OCR) et possibilité d'édition avant export",
    tags: ["Node.js", "Express", "SQLite", "Tesseract.js", "React"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/OCRPrint-",
    image: "https://i.ibb.co/LDwnc3JG/Shared-Screenshot.jpg"
  },
  //   {
  //   title: "Ocrprint.tsx",
  //   description: "Système d'authentification robuste avec JWT, Refresh Tokens, 2FA et gestion des rôles utilisateurs.",
  //   tags: ["Node.js", "Express", "MongoDB", "Redis"],
  //   category: "Backend",
  //   sourceLink: "https://github.com",
  //   image: "https://placehold.co/600x400/1e1b4b/ffffff?text=Backend:+Auth+API"
  // }
];

const experiences: Experience[] = [
  {
    company: "2CL SERVICES",
    role: "Développeur Web Stagiaire",
    period: "20 Février - 20 Mai 2025",
    description: "Mise en place d'application web full stack de supervision des machines dans un réseau local avec Python. Création des applications web modernes avec React Js, Node Js, Next Js."
  },
  {
    company: "TPAPY",
    role: "Développeur Web Stagiaire",
    period: "10 Juillet - 10 Octobre 2024",
    description: "Participation au développement d'application web Ecommerce avec Laravel. Développement d'application web dynamique avec Flask."
  },
    {
    company: "TPAPY",
    role: "Développeur Web Stagiaire",
    period: "02 Juillet - 02 Octobre 2023",
    description: "Participation au développement d'application web avec PHP et Bootstrap. Intégration de maquettes Figma pixel-perfect."
  }
];

// --- Composant Principal ---

const Portfolio: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  
  // CORRECTION IMPORTANTE :
  // Si on réduit le nombre de projets et que l'utilisateur est resté sur la page 2,
  // ce useEffect le ramène automatiquement à la page 1 pour éviter l'écran vide.
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleDownloadCV = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#d946ef', '#ffffff'] 
    });

    toast.success("Téléchargement réussi !", {
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
          toast.success("Message envoyé avec succès ! Je vous répondrai bientôt.", {
            theme: "dark",
            position: "top-right",
            autoClose: 5000
          });
          formRef.current?.reset(); 
        },
        (error) => {
          console.error('FAILED...', error.text);
          toast.error("Une erreur est survenue. Veuillez réessayer plus tard.", {
            theme: "dark",
            position: "top-right"
          });
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  const navItems = ['Accueil', 'À propos', 'Compétences', 'Projets', 'Expériences', 'Contact'];

  return (
    <div className="min-h-screen bg-[#0f0715] text-gray-200 font-sans selection:bg-violet-500 selection:text-white">
      
      <ToastContainer position="top-right" style={{ zIndex: 9999, marginTop: '60px' }} />

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f0715]/90 backdrop-blur-md border-b border-violet-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="shrink-0 cursor-pointer" onClick={() => handleNavClick('Accueil')}>
              <span className="text-2xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
                Georgio<span className="text-white">.Vignizogbin</span>
              </span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
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
            </div>
          </div>
        )}
      </nav>

      {/* --- Header / Hero --- */}
      <section id="home" className="pt-20 pb-12 md:pt-40 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row text-center items-center gap-12">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <img 
              src="https://i.ibb.co/4R6BFQh3/IMG-20251227-134143.jpg" 
              alt="Profile" 
              className="relative w-full h-full object-cover rounded-full border-4 border-violet-500/30 shadow-2xl z-10"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-xl text-violet-400 font-semibold tracking-wide">Bonjour, je suis</h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Georgio Vignizogbin
          </h1>
          
          <div className="text-2xl md:text-3xl font-bold text-gray-300 md:h-12 flex justify-center md:justify-start items-center">
             <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-violet-400 text-transparent bg-clip-text text-3xl md:text-5xl font-extrabold pb-2">
                Développeur Full Stack
              </span>
          </div>

          <p className="text-gray-400 max-w-lg mx-auto md:mx-0 text-lg leading-relaxed">
            Passionné par la création d'expériences web modernes, interactives et performantes. Transformons vos idées en réalité digitale.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a
              href="/cv.pdf"
              download="CV_Georgio_Vignizogbin.pdf"
              onClick={handleDownloadCV}
              className="cursor-pointer flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-violet-600/20 active:scale-95"
            >
              <Download size={20} />
              Télécharger mon CV
            </a>
          </div>
        </div>
      </section>

      {/* --- À propos --- */}
      <section id="about" className="py-20 bg-[#13091e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="border-b-4 border-violet-500 pb-2">À propos de moi</span>
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
             <div className="w-full md:w-1/3">
                <div className="rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300 border border-violet-500/20">
                  <img src="https://i.ibb.co/Dfrcytgn/Generated-Image-October-31-2025-2-49-AM.png" alt="About Me" className="w-full h-auto object-cover" />
                </div>
             </div>
             <div className="w-full md:w-2/3 space-y-6">
                <h3 className="text-2xl font-semibold text-white">Qui suis-je ?</h3>
                <p className="text-gray-400 leading-relaxed">
                  Développeur web passionné, j’ai construit mon parcours autour de la conception et du développement d’applications web performantes.                </p>
                <p className="text-gray-400 leading-relaxed">
                  Spécialisé dans l’écosystème Full Stack (React, Node.js, PHP), je conçois et développe des applications évolutives et orientées performance. J’accorde une attention particulière à l’expérience utilisateur (UX), à la logique métier côté backend ainsi qu’à la qualité, la maintenabilité et la scalabilité du code. En veille technologique constante, je relève avec exigence des défis techniques à forte valeur ajoutée.</p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <Code2 className="text-violet-400" />
                    <span>Clean Code</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-violet-400" />
                    <span>Abomey-Calavi, Bénin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-violet-400" />
                    <span>Immédiatement Disponible</span>
                  </div>
                    <div className="flex items-center gap-3">
                    <FaWhatsapp className="text-violet-500 text-xl" />
                    <span>(+229) 0191142478</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Compétences --- */}
      <section id="competences" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="border-b-4 border-violet-500 pb-2">Mes Compétences</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div key={skill.name} className="bg-[#1a0b2e] p-6 rounded-xl border border-violet-900/30 hover:border-violet-500 transition-all hover:shadow-lg hover:shadow-violet-900/20 hover:-translate-y-1 flex flex-col items-center justify-center gap-4 text-center group">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="border-b-4 border-violet-500 pb-2">Projets Récents</span>
          </h2>
          
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
                    <span className={`text-white text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${
                        project.category === 'Frontend' ? 'bg-blue-600/70 border-blue-400/50' :
                        project.category === 'Backend' ? 'bg-emerald-600/70 border-emerald-400/50' :
                        'bg-violet-600/70 border-violet-400/50'
                    }`}>
                        {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 h-16 overflow-hidden">
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
                    {/* Lien Github s'il existe */}
                    {project.sourceLink && project.sourceLink !== "#" && (
                      <a 
                        href={project.sourceLink} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center gap-2 py-2 px-3 rounded-lg border border-violet-600 text-violet-400 hover:bg-violet-900/30 hover:text-white transition-all text-sm font-medium"
                      >
                        <Github size={16} /> Code
                      </a>
                    )}
                    
                    {/* Lien Demo s'il existe */}
                    {project.demoLink && project.demoLink !== "#" && (
                      <a 
                        href={project.demoLink} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center gap-2 py-2 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-all text-sm font-medium shadow-lg shadow-violet-900/30"
                      >
                        <ExternalLink size={16} /> Demo
                      </a>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls - Affichée UNIQUEMENT si plus de 3 projets */}
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
            <span className="border-b-4 border-violet-500 pb-2">Expériences</span>
          </h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-violet-600 before:to-transparent">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-violet-500 bg-[#0f0715] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <ChevronRight size={20} className="text-violet-400" />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1a0b2e] p-6 rounded-xl border border-violet-900/30 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-lg">{exp.company}</span>
                    <span className="text-xs font-semibold px-2 py-1 bg-violet-900/50 text-violet-300 rounded">{exp.period}</span>
                  </div>
                  <div className="text-fuchsia-400 font-medium mb-2">{exp.role}</div>
                  <p className="text-gray-400 text-sm">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section id="contact" className="py-20 bg-[#13091e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <span className="border-b-4 border-violet-500 pb-2">Contactez-moi</span>
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Un projet en tête ou simplement envie de discuter ? Remplissez le formulaire ci-dessous.
          </p>

          <form 
            ref={formRef}
            onSubmit={sendEmail}
            className="space-y-6 bg-[#1a0b2e] p-8 rounded-2xl border border-violet-900/30 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                <input 
                  type="text" 
                  name="user_name"
                  id="name" 
                  required
                  className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  name="user_email"
                  id="email" 
                  required
                  className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Objet</label>
              <input 
                type="text" 
                name="subject"
                id="subject" 
                required
                className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Objet de votre message"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea 
                name="message"
                id="message" 
                rows={4} 
                required
                className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Votre message..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className="w-full bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-violet-900/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer le message <Mail size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#0a0410] py-8 border-t border-violet-900/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">
            © 2026 Georgio Vignizogbin 
            <br />
            Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;