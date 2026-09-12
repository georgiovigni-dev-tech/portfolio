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
  Monitor,
  Layout,
  Palette,
  Sparkles,
  Search,
  Smartphone,
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

// --- Données sources conservées ---

const skills: Skill[] = [
  { name: "React & Next.js", icon: "https://skillicons.dev/icons?i=react,nextjs" },
  { name: "Node.js & NestJS", icon: "https://skillicons.dev/icons?i=nodejs,nestjs" },
  { name: "PostgreSQL & MongoDB", icon: "https://skillicons.dev/icons?i=postgres,mongo" },
  { name: "Git & Docker", icon: "https://skillicons.dev/icons?i=git,docker" },
];

const projects: Project[] = [
  {
    title: "DIGIMARQ",
    description: "Application web permettant la vente de produits digitaux et de produits physiques.",
    tags: ["React", "Next.js", "Supabase"],
    category: "Full Stack",
    demoLink: "https://ecommerce-saas-delta.vercel.app/",
    image: "https://i.ibb.co/rRXCzPj2/p1.jpg"
  },
  {
    title: "CV Builder",
    description: "Cette application permet de créer facilement un CV moderne et professionnel en renseignant ses informations, son parcours, ses compétences et ses centres d’intérêt, avec une prévisualisation avant téléchargement.",
    tags: ["Next.js", "Daisy UI", "jsPDF"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/cvbuilder",
    image: "https://i.ibb.co/4n8Cfd5K/395883310-98902bf8-195d-4633-b2e3-9d28b8da84d0.png"
  },
  {
    title: "Etrack",
    description: "Application de gestion de budget qui permet aux utilisateurs de suivre leurs budgets, d’enregistrer des transactions, de visualiser des statistiques et de gérer leurs dépenses de façon claire et intuitive.",
    tags: ["Next.js", "Prisma", "SQLite"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/etrack",
    image: "https://i.ibb.co/DP2k28HN/387284609-fa5fd13b-8b02-423b-9419-6b465cda0b1c.png"
  }
];

const experiences: Experience[] = [
  {
    company: "2CL SERVICE",
    role: "Stagiaire Développeur Web",
    period: "Fév. 2025 – Déc. 2025",
    description: "Mise en place des applications web privées de l'entreprise, développement du système de supervision des ressources internes des machines sur réseau local et mise en place de la plateforme de formation de l'entreprise."
  },
  {
    company: "TPAPY",
    role: "Stagiaire Développeur Web",
    period: "Juil. 2024 – Sept. 2024",
    description: "Développement d'applications web avec les frameworks Laravel et Flask, et initiation/développement mobile avec Flutter."
  },
  {
    company: "TPAPY",
    role: "Stagiaire Développeur Web",
    period: "Juil. 2023 – Sept. 2023",
    description: "Intégration d'interfaces web dynamiques et prise en main du framework Bootstrap."
  }
];

// Capsules au bas du Hero (fidèles aux badges de la maquette)
const heroDockPills = [
  { name: "Wireframing", icon: Layout },
  { name: "Web App", icon: Monitor },
  { name: "UX Design", icon: Sparkles },
  { name: "UI Design", icon: Palette },
  { name: "User Research", icon: Search },
  { name: "Mobile App Design", icon: Smartphone },
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
      colors: ['#f97316', '#fbbf24', '#ffffff']
    });

    toast.success("Téléchargement du CV initié !", {
      position: "top-center",
      theme: "dark",
      autoClose: 3000
    });
  };

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
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
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
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
    <div className="min-h-screen bg-[#0a0807] text-slate-100 font-sans selection:bg-orange-500 selection:text-black relative overflow-x-hidden antialiased">
      <ToastContainer position="bottom-right" style={{ zIndex: 9999 }} />

      {/* Texture subtile en points */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Bouton WhatsApp Flottant */}
      <a
        href="https://wa.me/2290191142478?text=Bonjour%20Georgio,%20j'ai%20un%20projet%20dont%20j'aimerais%20te%20parler."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#128c7e] hover:bg-[#075e54] text-white p-4 rounded-full shadow-2xl transition-transform duration-300 hover:scale-105 z-50 flex items-center justify-center border border-white/10"
        aria-label="Me contacter sur WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>

      {/* ========================================================= */}
      {/* --- HERO SECTION : STRICTEMENT CONFORME À LA MAQUETTE --- */}
      {/* ========================================================= */}
      <section id="home" className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#0c0908] pt-6 pb-6">
        
        {/* Glow & dégradé studio chaud en arrière-plan */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(194,65,12,0.42)_0%,rgba(100,35,10,0.2)_45%,transparent_75%)] blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0908]/70 via-transparent to-[#0c0908]" />
        </div>

        {/* --- NAVIGATION --- */}
        <header className="relative z-30 max-w-7xl mx-auto w-full px-6 sm:px-10">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Style JAXON STEEL */}
            <div
              className="cursor-pointer text-white tracking-wider text-lg sm:text-xl font-bold uppercase select-none"
              onClick={() => handleNavClick('Accueil')}
            >
              GEORGIO <span className="italic font-light text-slate-300">VIGNI</span>
            </div>

            {/* Menu central capsule en verre dépoli */}
            <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-[#16120f]/75 backdrop-blur-md px-3 py-1.5 shadow-xl">
              {navItems.filter(item => item !== 'Contact').map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-slate-300 hover:text-white hover:bg-white/5 text-xs sm:text-sm font-light px-4 py-2 rounded-full transition-all duration-200"
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Bouton pilule "Get in Touch" */}
            <div className="hidden md:block">
              <button
                onClick={scrollToContact}
                className="rounded-full border border-white/20 bg-black/40 hover:bg-white/10 hover:border-white/40 text-xs sm:text-sm text-white px-6 py-2.5 transition-all duration-300"
              >
                Me contacter
              </button>
            </div>

            {/* Hamburger mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 rounded-2xl bg-[#140f0c] border border-white/10 p-5 space-y-3 shadow-2xl backdrop-blur-xl">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="block w-full text-left text-sm text-slate-300 hover:text-white py-2"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* --- ZONE CENTRALE : NOM COMPLET EN ARRIÈRE-PLAN + PORTRAIT + TEXTE GAUCHE + CTA GLOW DROITE --- */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 my-auto flex-1 flex flex-col justify-center">
          
          {/* NOM COMPLET DERRIÈRE : GEORGIO VIGNIZOGBIN */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center select-none pointer-events-none z-0 px-2 overflow-hidden"
          >
            <span className="text-[7.2vw] sm:text-[7vw] md:text-[6.8vw] lg:text-[6.5vw] font-black tracking-tight text-[#6f5649]/35 uppercase whitespace-nowrap leading-none transition-all">
              GEORGIO VIGNIZOGBIN
            </span>
          </div>

          {/* Composition du sujet et des éléments latéraux */}
          <div className="relative w-full flex items-center justify-center">
            
            {/* Portrait centré */}
            <div className="relative z-10 w-[270px] sm:w-[340px] md:w-[400px] lg:w-[440px] h-[380px] sm:h-[470px] md:h-[530px] lg:h-[580px] shrink-0">
              <img
                src="https://i.ibb.co/Q7LjMxBZ/Firefly-Remove-Background.png"
                alt="Georgio Vignizogbin"
                className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.04]"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                }}
              />
            </div>

            {/* Texte informatif à gauche (reprise exacte de vos informations) */}
            <div className="hidden md:block absolute left-4 lg:left-8 bottom-20 lg:bottom-80 z-20 max-w-[280px] lg:max-w-[340px] space-y-4">
              <p className="text-white text-sm lg:text-[15px] font-normal leading-relaxed tracking-normal">
                Développeur Full Stack. J'aide les entreprises à automatiser leurs processus métiers et à matérialiser leurs idées à travers des applications robustes et scalables.
              </p>
              <button
                onClick={handleDownloadCV}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                <Download size={13} /> Télécharger mon CV
              </button>
            </div>

            {/* Bouton CTA à droite avec le halo néon orange radiant exact */}
            <div className="hidden md:block absolute right-4 lg:right-10 bottom-20 lg:bottom-90 z-20">
              <div className="relative group">
                {/* Lueur intense et rayonnante */}
                <div className="absolute -inset-3 bg-gradient-to-r rounded-3xl blur-2xl opacity-85 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 rounded-2xl blur-lg" />

                {/* Bouton blanc rectangulaire arrondi */}
                <button
                onClick={scrollToContact}
                className="relative px-8 py-4 bg-white hover:bg-slate-100 text-black text-sm font-semibold rounded-2xl shadow-none -translate-y-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                Réserver un appel gratuit
              </button>

              </div>
            </div>

          </div>

          {/* Affichage Mobile pour le texte et le bouton */}
          <div className="md:hidden relative z-20 mt-3 flex flex-col items-center text-center space-y-5">
            <p className="text-slate-200 text-xs sm:text-sm max-w-xs font-light leading-relaxed">
              Développeur Full Stack. J'aide les entreprises à automatiser leurs processus métiers et à matérialiser leurs idées à travers des applications robustes et scalables.
            </p>

            <div className="relative w-full max-w-xs">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur-lg opacity-85" />
              <button
                onClick={scrollToContact}
                className="relative w-full py-3.5 bg-white text-black font-semibold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                Réserver un appel gratuit <ArrowRight size={15} />
              </button>
            </div>

            <button
              onClick={handleDownloadCV}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
            >
              <Download size={13} /> Télécharger mon CV
            </button>
          </div>

        </div>

        {/* --- DOCK INFÉRIEUR : CAPSULES FLOTTANTES IDENTIQUES À LA MAQUETTE --- */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-4">
          <div className="flex items-center justify-start lg:justify-center gap-3 overflow-x-auto no-scrollbar py-2">
            {heroDockPills.map((pill, index) => {
              const IconComponent = pill.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#171310]/90 border border-white/10 hover:border-orange-500/40 backdrop-blur-md shrink-0 shadow-lg transition-all duration-300 group cursor-default"
                >
                  <IconComponent size={16} className="text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs sm:text-sm text-slate-200 font-normal whitespace-nowrap">
                    {pill.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* --- SECTION : À PROPOS --- */}
      <section id="about" className="relative py-28 border-t border-white/5 bg-[#0b0906]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Image de profil */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-start">
              <div className="relative aspect-4/5 w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 p-3 bg-white/[0.01]">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-orange-500/50 z-10" />
                <img
                  src="https://i.ibb.co/Dfrcytgn/Generated-Image-October-31-2025-2-49-AM.png"
                  alt="Georgio Vignizogbin"
                  className="w-full h-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </div>

            {/* Contenu textuel d'origine conservé */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-tight">
                  Une approche axée sur les résultats business
                </h2>
              </div>

              <div className="space-y-6 text-slate-400 font-light text-lg leading-relaxed">
                <p>
                  Plus qu'un simple exécutant, j'interviens comme un partenaire technique. Mon rôle est de comprendre vos problématiques commerciales pour y apporter une solution technique robuste, minimisant la maintenance future et maximisant votre efficacité.
                </p>
                <p>
                  Spécialisé dans l'écosystème JavaScript/TypeScript moderne (React, Next.js, Node.js) et PHP, je structure des architectures prêtes à absorber votre croissance. Mon engagement s'articule autour de la rigueur du code, de la protection des données et de l'expérience utilisateur finale.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION : COMPÉTENCES & OUTILS --- */}
      <section id="competences" className="py-28 border-t border-white/5 bg-[#0d0a08]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Outils & écosystèmes</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center justify-center p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-orange-500/25 transition-all duration-300 group text-center"
              >
                <div className="h-20 w-20 flex items-center justify-center mb-4">
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="h-10 w-auto opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION : PROJETS --- */}
      <section id="projets" className="py-28 border-t border-white/5 bg-[#0b0906]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Projets</h2>
            </div>
            <p className="text-slate-400 font-light max-w-sm text-sm">
              Découvrez quelques réalisations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {currentProjects.map((project, index) => {
              const isLargeCard = index === 0 && currentPage === 1;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col justify-between group transition-all duration-500 bg-[#110d09]/60 hover:bg-[#171009]/80 border border-white/5 hover:border-orange-500/20 rounded-3xl p-6 sm:p-8 ${
                    isLargeCard ? 'lg:col-span-12 xl:col-span-8' : 'lg:col-span-6 xl:col-span-4'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/5 bg-[#08070a]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/80 border border-white/10 text-slate-300 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-light text-white tracking-tight group-hover:text-orange-300 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-light leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[11px] text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="h-px bg-white/5 w-full" />

                    <div className="flex items-center gap-6">
                      {project.sourceLink && project.sourceLink !== "#" && (
                        <a
                          href={project.sourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group/link"
                        >
                          <Github size={14} />
                          <span>Code source</span>
                          <ArrowRight size={11} className="transform -rotate-45 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                        </a>
                      )}
                      {project.demoLink && project.demoLink !== "#" && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors group/link"
                        >
                          <ExternalLink size={14} />
                          <span>Voir la démo</span>
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
                className="p-3 rounded-full border border-white/10 hover:border-white/30 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Page précédente"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs text-slate-500">
                PAGE {currentPage} SUR {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full border border-white/10 hover:border-white/30 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Page suivante"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION : EXPÉRIENCES --- */}
      <section id="experiences" className="py-28 border-t border-white/5 bg-[#0d0a08]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Expériences acquises</h2>
          </div>

          <div className="divide-y divide-white/5">
            {experiences.map((exp, index) => (
              <div key={index} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start first:pt-0 last:pb-0">
                <div className="md:col-span-3 text-xs text-slate-500 uppercase tracking-wider pt-1">
                  {exp.period}
                </div>
                <div className="md:col-span-4">
                  <h4 className="text-lg font-medium text-white">{exp.company}</h4>
                  <p className="text-xs text-orange-400 mt-1 uppercase tracking-wider">{exp.role}</p>
                </div>
                <div className="md:col-span-5 text-sm text-slate-400 font-light leading-relaxed">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION : CONTACT --- */}
      <section id="contact" className="py-28 border-t border-white/5 bg-[#0a0806] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Informations de contact direct */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-none mb-6">
                  Prêt à lancer <br />votre projet ?
                </h2>
                <p className="text-slate-400 font-light text-base leading-relaxed max-w-sm">
                  Que vous ayez un cahier des charges structuré ou simplement une idée émergente, formalisons ensemble votre projet sous 24h.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-orange-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Email</span>
                    <a href="mailto:georgiovignizogbin@gmail.com" className="text-sm text-slate-300 hover:text-white transition-colors">
                      georgiovignizogbin@gmail.com
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-orange-400">
                    <FaWhatsapp size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">WhatsApp</span>
                    <a href="https://wa.me/2290191142478" target="_blank" rel="noreferrer" className="text-sm text-slate-300 hover:text-white transition-colors">
                      (+229) 01 91 14 24 78
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire EmailJS */}
            <div className="lg:col-span-7">
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs text-slate-400">Nom ou entreprise</label>
                    <input
                      type="text"
                      name="user_name"
                      id="name"
                      required
                      className="w-full bg-white/[0.02] border border-white/10 text-white px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs text-slate-400">Adresse email</label>
                    <input
                      type="email"
                      name="user_email"
                      id="email"
                      required
                      className="w-full bg-white/[0.02] border border-white/10 text-white px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Votre adresse email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-xs text-slate-400">Objet du projet</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="w-full bg-white/[0.02] border border-white/10 text-white px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Refonte de plateforme, application SaaS..."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs text-slate-400">Détails & objectifs</label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    required
                    className="w-full bg-white/[0.02] border border-white/10 text-white px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-y"
                    placeholder="Expliquez-moi vos objectifs, vos défis et le calendrier souhaité..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-white hover:bg-slate-100 text-black text-sm font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(249,115,22,0.35)] cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="animate-spin" size={15} /> Transmission en cours...
                    </>
                  ) : (
                    <>
                      Envoyer<Mail size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-12 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Georgio Vignizogbin. Tous droits réservés.
          </p>
          <div className="text-[10px] text-slate-600 uppercase tracking-widest">
            Georgio Vignizogbin
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;