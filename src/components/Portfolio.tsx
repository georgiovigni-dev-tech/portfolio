import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import {
  Menu,
  X,
  Mail,
  ExternalLink,
  Download,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Github,
  ArrowRight,
  CheckCircle,
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
    description: "Solution complète de point de vente. Permet aux gérants de digitaliser leurs ventes, d'éditer des factures PDF et de suivre leur rentabilité en temps réel.",
    tags: ["React", "TypeScript", "Tailwind", "Node.js"],
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
    tags: ["Node.js", "Express", "Tesseract.js", "React"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/OCRPrint-",
    image: "https://i.ibb.co/LDwnc3JG/Shared-Screenshot.jpg"
  }
];

const experiences: Experience[] = [
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

const Portfolio: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
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
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#7c3aed', '#c084fc', '#ffffff']
    });

    toast.success("Téléchargement du CV initié !", {
      position: "top-center",
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
          toast.success("Message envoyé ! Je vous réponds sous 24h.", {
            theme: "dark",
            position: "bottom-right",
            autoClose: 5000
          });
          formRef.current?.reset();
        },
        (error) => {
          console.error('FAILED...', error.text);
          toast.error("Erreur de transmission. Vous pouvez m'écrire sur WhatsApp.", {
            theme: "dark",
            position: "bottom-right"
          });
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  const navItems = ['Accueil', 'À propos', 'Compétences', 'Projets', 'Expériences', 'Contact'];

  return (
    <div className="min-h-screen bg-[#09040f] text-slate-100 font-sans selection:bg-violet-500 selection:text-white relative overflow-x-hidden antialiased">
      <ToastContainer position="bottom-right" style={{ zIndex: 9999 }} />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/2290191142478?text=Bonjour%20Georgio,%20j'ai%20un%20projet%20dont%20j'aimerais%20te%20parler."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#128c7e] hover:bg-[#075e54] text-white p-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 z-50 flex items-center justify-center"
        aria-label="Me contacter sur WhatsApp"
      >
        <FaWhatsapp size={25} />
      </a>

      {/* --- Header / Navigation --- */}
      <nav className="fixed top-0 w-full z-40 bg-[#09040f]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="cursor-pointer font-semibold text-lg tracking-wider" onClick={() => handleNavClick('Accueil')}>
              GEORGIO<span className="text-violet-500">.V</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className="text-slate-400 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                onClick={scrollToContact}
                className="px-5 py-2 text-xs font-mono uppercase tracking-widest border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 text-white rounded-none transition-all duration-300"
              >
                Démarrer un projet
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#09040f] border-b border-white/5 px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-slate-300 hover:text-white block text-sm font-mono uppercase tracking-wider w-full text-left py-2"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => { scrollToContact(); setIsMenuOpen(false); }}
              className="w-full text-center border border-violet-500/30 text-violet-400 font-mono text-xs uppercase tracking-widest py-3 hover:bg-violet-500/5 transition-colors"
            >
              Discutons de votre projet
            </button>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 max-w-7xl mx-auto px-6 sm:px-8 min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
              Je conçois des <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200">systèmes web</span> performants.
            </h1>

            <p className="text-slate-400 text-lg max-w-xl font-light leading-relaxed">
              Développeur Full Stack. J'aide les entreprises à automatiser leurs processus métiers et à matérialiser leurs idées à travers des applications robustes et scalables.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={scrollToContact}
                className="flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-200 px-8 py-4 text-xs font-mono uppercase tracking-widest transition-all duration-300"
              >
                Lancer un projet <ArrowRight size={14} />
              </button>
              <a
                href="/cv.pdf"
                download="CV_Georgio_Vignizogbin.pdf"
                onClick={handleDownloadCV}
                className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white px-8 py-4 text-xs font-mono uppercase tracking-widest transition-all duration-300"
              >
                <Download size={14} /> Télécharger mon CV
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="hidden md:block relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Cadre fin minimaliste asymétrique */}
              <div className="absolute inset-0 border border-violet-500/30 translate-x-3 translate-y-3 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0"></div>

              <img
                src="https://i.ibb.co/4R6BFQh3/IMG-20251227-134143.jpg"
                alt="Georgio Vignizogbin"
                className="relative w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- À propos / Philosophie --- */}
      <section id="about" className="py-24 border-t border-white/5 bg-[#0b0614]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Image de profil à gauche */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-start">
              <div className="relative aspect-4/5 w-full max-w-sm border border-white/10 bg-white/1 p-3">
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-violet-500/40"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-violet-500/40"></div>
                  <img
                    src="https://i.ibb.co/Dfrcytgn/Generated-Image-October-31-2025-2-49-AM.png"
                    alt="Georgio Vignizogbin"
                    className="w-full h-full object-cover hover:grayscale transition-all duration-700"
                  />
              </div>
            </div>

            {/* Contenu texte à droite */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-3">Philosophie</span>
                <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-tight">
                  Une approche axée sur les <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">résultats business</span>
                </h2>
              </div>

              <div className="space-y-6 text-slate-400 font-light text-lg leading-relaxed">
                <p>
                  Plus qu’un simple exécutant, j’interviens comme un partenaire technique. Mon rôle est de comprendre vos problématiques commerciales pour y apporter une solution technique robuste, minimisant la maintenance future et maximisant votre efficacité.
                </p>
                <p>
                  Spécialisé dans l’écosystème JavaScript/TypeScript moderne (React, Next.js, Node.js) et PHP, je structure des architectures prêtes à absorber votre croissance. Mon engagement s'articule autour de la rigueur du code, de la protection des données et de l'expérience utilisateur finale.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Compétences --- */}
      <section id="competences" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-3">Stack Technique</span>
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Outils & Écosystèmes</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center justify-center p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-violet-500/20 transition-all duration-300 group text-center"
              >
                <div className="h-20 w-20  flex items-center justify-center mb-4">
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="h-10 w-auto opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Projets --- */}
      <section id="projets" className="py-24 border-t border-white/5 bg-[#0b0614]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-3">Sélection de Travaux</span>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Solutions Déployées</h2>
            </div>
            <p className="text-slate-400 font-light max-w-sm text-sm">
              Découvrez des cas d'usage concrets axés sur la digitalisation des ventes et l'automatisation.
            </p>
          </div>

          {/* Grille de projets asymétrique et éditoriale */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {currentProjects.map((project, index) => {
              const isLargeCard = index === 0 && currentPage === 1;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col justify-between group transition-all duration-500 bg-[#110a1c]/30 hover:bg-[#110a1c]/60 border border-white/5 hover:border-white/10 p-6 sm:p-8 ${
                    isLargeCard ? 'lg:col-span-12 xl:col-span-8' : 'lg:col-span-6 xl:col-span-4'
                  }`}
                >
                  <div className="space-y-6">
                    {/* Image Block */}
                    <div className="relative aspect-video overflow-hidden border border-white/5 bg-[#09040f]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#09040f]/90 border border-white/10 text-slate-300 text-[9px] font-mono uppercase tracking-wider px-2.5 py-1">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Typography */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-light text-white tracking-tight group-hover:text-violet-300 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-light leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Metadata and Elegant Interactive Rows */}
                  <div className="space-y-6 pt-6 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="h-px bg-white/5 w-full"></div>

                    <div className="flex items-center gap-6">
                      {project.sourceLink && project.sourceLink !== "#" && (
                        <a
                          href={project.sourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors group/link"
                        >
                          <Github size={13} />
                          <span>Code Source</span>
                          <ArrowRight size={11} className="transform -rotate-45 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                        </a>
                      )}
                      {project.demoLink && project.demoLink !== "#" && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors group/link"
                        >
                          <ExternalLink size={13} />
                          <span>Live Demo</span>
                          <ArrowRight size={11} className="transform -rotate-45 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {projects.length > 3 && (
            <div className="flex justify-center items-center mt-16 gap-3">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-mono text-slate-500">
                PAGE {currentPage} SUR {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- Parcours / Expériences --- */}
      <section id="experiences" className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-3">Parcours Professionnel</span>
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Expériences acquises</h2>
          </div>

          <div className="divide-y divide-white/5">
            {experiences.map((exp, index) => (
              <div key={index} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start first:pt-0 last:pb-0">
                <div className="md:col-span-3 text-xs font-mono text-slate-500 uppercase tracking-widest pt-1">
                  {exp.period}
                </div>
                <div className="md:col-span-4">
                  <h4 className="text-lg font-medium text-white">{exp.company}</h4>
                  <p className="text-xs font-mono text-violet-400 mt-1 uppercase tracking-wider">{exp.role}</p>
                </div>
                <div className="md:col-span-5 text-sm text-slate-400 font-light leading-relaxed">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section id="contact" className="py-24 border-t border-white/5 bg-[#0b0614] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Colonne d'informations */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-3">Contact</span>
                <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-none mb-6">
                  Prêt à lancer <br />votre projet ?
                </h2>
                <p className="text-slate-400 font-light text-base leading-relaxed max-w-sm">
                  Que vous ayez un cahier des charges structuré ou simplement une idée émergente, formalisons ensemble votre projet sous 24h.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-white/5 bg-white/[0.01] flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-slate-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Email direct</span>
                    <a href="mailto:georgiovignizogbin@gmail.com" className="text-sm font-mono text-slate-300 hover:text-white transition-colors">
                      georgiovignizogbin@gmail.com
                    </a>
                  </div>
                </div>

                <div className="p-4 border border-white/5 bg-white/[0.01] flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-slate-400">
                    <FaWhatsapp size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">WhatsApp direct</span>
                    <a href="https://wa.me/2290191142478" target="_blank" rel="noreferrer" className="text-sm font-mono text-slate-300 hover:text-white transition-colors">
                      (+229) 01 91 14 24 78
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de contact moderne */}
            <div className="lg:col-span-7">
              <form
                ref={formRef}
                onSubmit={sendEmail}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-slate-400">Nom ou Entreprise</label>
                    <input
                      type="text"
                      name="user_name"
                      id="name"
                      required
                      className="w-full bg-white/[0.02] border border-white/10 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-slate-400">Adresse Email</label>
                    <input
                      type="email"
                      name="user_email"
                      id="email"
                      required
                      className="w-full bg-white/2 border border-white/10 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="jean@entreprise.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-widest text-slate-400">Objet du projet</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="w-full bg-white/[0.02] border border-white/10 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="Refonte de plateforme, Application SaaS..."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-slate-400">Détails & Objectifs</label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    required
                    className="w-full bg-white/[0.02] border border-white/10 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-y"
                    placeholder="Expliquez-moi brièvement vos objectifs, vos défis et le calendrier souhaité..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-white hover:bg-slate-200 text-black font-mono text-xs uppercase tracking-widest py-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> Transmission en cours...
                    </>
                  ) : (
                    <>
                      Obtenir une estimation gratuite <Mail size={14} />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] font-mono text-slate-500 flex items-center justify-center gap-2">
                  <CheckCircle size={10} /> Vos données restent strictement confidentielles.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#05020a] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-slate-600">
            © {new Date().getFullYear()} Georgio Vignizogbin.
          </p>
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Tout droit réservé
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;