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
  Github,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  MessageSquare,
  Send
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

// ============================================================
// DONNÉES — Textes réécrits avec un angle orienté BÉNÉFICES CLIENT
// Chaque description met en avant le RÉSULTAT pour l'utilisateur final,
// pas juste la techno utilisée.
// ============================================================

const skills: Skill[] = [
  { name: "React & Next.js", icon: "https://skillicons.dev/icons?i=react,nextjs" },
  { name: "Node.js & NestJS", icon: "https://skillicons.dev/icons?i=nodejs,nestjs" },
  { name: "PostgreSQL & MongoDB", icon: "https://skillicons.dev/icons?i=postgres,mongo" },
  { name: "Git & Docker", icon: "https://skillicons.dev/icons?i=git,docker" },
];

const projects: Project[] = [
  {
    title: "Boutique POS",
    // AVANT: Description technique → APRÈS: Problème résolu + bénéfice
    description: "Application de point de vente qui aide les commerçants à gérer leurs ventes, générer des reçus PDF et suivre leur performance financière en temps réel.",
    tags: ["React", "TypeScript", "Tailwind", "Recharts", "Node.js"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/Gio-Boutique",
    image: "https://i.ibb.co/nsB0kthk/Shared-Screenshot.jpg"
  },
  {
    title: "Taskflow",
    // Accent mis sur le bénéfice utilisateur (productivité)
    description: "Interface intuitive de gestion de tâches conçue pour booster la productivité : ajoutez, organisez et complétez vos tâches en un clic.",
    tags: ["React js", "Tailwind"],
    category: "Frontend",
    demoLink: "https://georgiovigni-dev-tech.github.io/taskflow/",
    sourceLink: "https://github.com/georgiovigni-dev-tech/taskflow",
    image: "https://i.ibb.co/v4ksT4b8/Shared-Screenshot.jpg"
  },
  {
    title: "Ocrprint",
    // Description orientée solution + workflow utilisateur
    description: "Solution de digitalisation de documents : uploadez une image, le texte est extrait automatiquement (OCR), éditable et exportable en PDF propre.",
    tags: ["Node.js", "Express", "SQLite", "Tesseract.js", "React"],
    category: "Full Stack",
    sourceLink: "https://github.com/georgiovigni-dev-tech/OCRPrint-",
    image: "https://i.ibb.co/LDwnc3JG/Shared-Screenshot.jpg"
  },
];

const experiences: Experience[] = [
  {
    company: "2CL SERVICES",
    role: "Développeur Web Full Stack",
    period: "Fév. — Mai 2025",
    // Description orientée résultats
    description: "Développement d'une application de supervision de machines en réseau local (Python). Création d'applications web modernes et performantes avec React, Node.js et Next.js."
  },
  {
    company: "TPAPY",
    role: "Développeur Web Full Stack",
    period: "Juil. — Oct. 2024",
    description: "Participation au développement d'une plateforme E-commerce (Laravel). Développement d'applications web dynamiques avec Flask et intégration d'APIs."
  },
  {
    company: "TPAPY",
    role: "Développeur Web Frontend",
    period: "Juil. — Oct. 2023",
    description: "Développement d'applications web avec PHP/Bootstrap. Intégration pixel-perfect de maquettes Figma en interfaces responsive."
  }
];

// ============================================================
// DONNÉES DE PREUVE SOCIALE — Chiffres clés affichés après le Hero
// Les chiffres rassurent et crédibilisent. Même modestes, ils montrent
// que vous êtes actif et que vous livrez.
// ============================================================
const trustStats = [
  { value: "3+", label: "Projets livrés", icon: <CheckCircle2 size={20} /> },
  { value: "2+", label: "Ans d'expérience", icon: <Clock size={20} /> },
  { value: "100%", label: "Engagement qualité", icon: <Zap size={20} /> },
  { value: "24h", label: "Temps de réponse", icon: <MessageSquare size={20} /> },
];

// --- Composant Principal ---

const Portfolio: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // ============================================================
  // NUMÉRO WHATSAPP — Centralisé ici pour faciliter la modification
  // Format international sans espaces ni caractères spéciaux
  // ============================================================
  const whatsappNumber = "2290191142478";
  // TODO: Remplacez par votre vraie adresse email
  const contactEmail = "georgiovignizogbin@gmail.com";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour Georgio, j'ai vu votre portfolio et j'aimerais discuter d'un projet.")}`;
  
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

  // ============================================================
  // SCROLL VERS CONTACT — Fonction réutilisable pour tous les CTA
  // Centraliser ce scroll permet d'avoir un seul point de conversion
  // ============================================================
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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
          // ============================================================
          // CONFETTI AU SUCCÈS — Récompense émotionnelle pour le visiteur
          // Renforce le sentiment positif après l'envoi du message
          // ============================================================
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#8b5cf6', '#d946ef', '#ffffff']
          });
          toast.success("Message envoyé avec succès ! Je vous réponds sous 24h. 🚀", {
            theme: "dark",
            position: "top-right",
            autoClose: 5000
          });
          formRef.current?.reset(); 
        },
        (error) => {
          console.error('FAILED...', error.text);
          toast.error("Une erreur est survenue. Contactez-moi directement sur WhatsApp.", {
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

      {/* ============================================================
          NAVBAR — Ajout d'un CTA visible "Me contacter" sur desktop
          Un bouton d'action dans la nav augmente significativement le taux
          de conversion car il est TOUJOURS visible pendant le scroll.
          ============================================================ */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f0715]/90 backdrop-blur-md border-b border-violet-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="shrink-0 cursor-pointer" onClick={() => handleNavClick('Accueil')}>
              <span className="text-2xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
                Georgio<span className="text-white">.dev</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center">
              <div className="flex items-baseline space-x-6">
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
              {/* CTA NAVBAR — Bouton d'action toujours visible */}
              <button
                onClick={scrollToContact}
                className="ml-6 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                Discutons <ArrowRight size={14} />
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
              {/* CTA mobile dans le menu hamburger */}
              <button
                onClick={() => { scrollToContact(); setIsMenuOpen(false); }}
                className="w-full mt-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-all flex items-center justify-center gap-2"
              >
                Discutons de votre projet <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================
          HERO SECTION — Optimisée pour capter l'attention en < 5 secondes
          
          Structure de conversion :
          1. Accroche émotionnelle (sous-titre violet)
          2. Nom = crédibilité personnelle
          3. Titre de fonction = positionnement clair
          4. Proposition de valeur = bénéfice pour le client
          5. Double CTA = choix sans friction
          
          AVANT: "Passionné par la création..." (centré sur moi)
          APRÈS: "Vous avez une idée ? Je la transforme en..." (centré sur le client)
          ============================================================ */}
      <section id="home" className="pt-20 pb-12 md:pt-40 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row text-center items-center gap-12">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <img 
              src="https://i.ibb.co/4R6BFQh3/IMG-20251227-134143.jpg" 
              alt="Georgio Vignizogbin — Développeur Web Full Stack" 
              className="relative w-full h-full object-cover rounded-full border-4 border-violet-500/30 shadow-2xl z-10"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          {/* Accroche orientée CLIENT — pose le problème/désir dès la première ligne */}
          <h2 className="text-xl text-violet-400 font-semibold tracking-wide">
            Vous avez un projet web ? Je le construis.
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Georgio Vignizogbin
          </h1>
          
          <div className="text-2xl md:text-3xl font-bold text-gray-300 md:h-12 flex justify-center md:justify-start items-center">
             <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-violet-400 text-transparent bg-clip-text text-3xl md:text-5xl font-extrabold pb-2">
                Développeur Full Stack
              </span>
          </div>

          {/* Proposition de valeur claire : QUOI + POUR QUI + COMMENT */}
          <p className="text-gray-400 max-w-lg mx-auto md:mx-0 text-lg leading-relaxed">
            Je conçois des <span className="text-white font-medium">applications web sur mesure</span>, 
            modernes et performantes pour les entrepreneurs, startups et PME. 
            De l'idée au déploiement — vous vous concentrez sur votre business, 
            <span className="text-violet-400 font-medium"> je m'occupe du reste</span>.
          </p>

          {/* ============================================================
              DOUBLE CTA — Stratégie de conversion éprouvée :
              - CTA principal (violet plein) = action prioritaire → Contact
              - CTA secondaire (outline) = action alternative → CV
              Le visiteur a TOUJOURS un chemin vers l'action.
              ============================================================ */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={scrollToContact}
              className="cursor-pointer flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-violet-600/20 active:scale-95"
            >
              <Mail size={20} />
              Discutons de votre projet
            </button>
            <a
              href="/cv.pdf"
              download="CV_Georgio_Vignizogbin.pdf"
              onClick={handleDownloadCV}
              className="cursor-pointer flex items-center gap-2 border border-violet-500/50 hover:border-violet-400 text-violet-400 hover:text-white px-6 py-3 rounded-full font-medium transition-all active:scale-95"
            >
              <Download size={20} />
              Télécharger mon CV
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          BARRE DE CONFIANCE (Trust Bar) — Section ajoutée
          
          Pourquoi : Les chiffres concrets rassurent instantanément.
          Même des métriques modestes (3+ projets) montrent que vous êtes
          actif et professionnel. "24h de temps de réponse" est une promesse
          concrète qui réduit l'anxiété du visiteur.
          
          Design : Suit exactement le thème existant (bg, border, colors)
          ============================================================ */}
      <section className="py-8 border-y border-violet-900/20 bg-[#0f0715]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustStats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="flex justify-center text-violet-400 mb-1">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          À PROPOS — Réécriture complète orientée CLIENT
          
          AVANT : "Développeur web passionné..." (centré sur moi)
          APRÈS : Structure problème → solution → preuve
          
          Le visiteur doit se dire : "C'est exactement la personne qu'il me faut"
          ============================================================ */}
      <section id="about" className="py-20 bg-[#13091e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="border-b-4 border-violet-500 pb-2">Pourquoi travailler avec moi</span>
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
             <div className="w-full md:w-1/3">
                <div className="rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300 border border-violet-500/20">
                  <img src="https://i.ibb.co/Dfrcytgn/Generated-Image-October-31-2025-2-49-AM.png" alt="Georgio au travail" className="w-full h-auto object-cover" />
                </div>
             </div>
             <div className="w-full md:w-2/3 space-y-6">
                <h3 className="text-2xl font-semibold text-white">
                  Un développeur qui comprend vos objectifs business
                </h3>
                {/* Paragraphe 1 : Empathie + positionnement */}
                <p className="text-gray-400 leading-relaxed">
                  Vous avez besoin d'une application web qui <span className="text-white">fonctionne, convertit et évolue</span> avec votre activité — 
                  pas juste d'un site "joli". C'est exactement ce que je fais : je transforme vos besoins métier en solutions techniques concrètes.
                </p>
                {/* Paragraphe 2 : Compétences + rassurance */}
                <p className="text-gray-400 leading-relaxed">
                  Spécialisé dans l'écosystème <span className="text-violet-400 font-medium">React, Node.js et Next.js</span>, 
                  je développe des applications complètes — du frontend au backend — avec un code propre, 
                  maintenable et pensé pour la scalabilité. Chaque projet est livré avec un accompagnement personnalisé 
                  et une communication transparente.
                </p>
                {/* Points clés visuels — scannable rapidement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <Code2 className="text-violet-400 shrink-0" />
                    <span>Code propre & maintenable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="text-violet-400 shrink-0" />
                    <span>Applications performantes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-violet-400 shrink-0" />
                    <span>Abomey-Calavi, Bénin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-violet-400 shrink-0" />
                    <span className="text-green-400 font-medium">✅ Disponible immédiatement</span>
                  </div>
                </div>

                {/* CTA dans la section About — rappel d'action */}
                <div className="pt-4">
                  <button
                    onClick={scrollToContact}
                    className="cursor-pointer inline-flex items-center gap-2 text-violet-400 hover:text-white font-medium transition-colors group"
                  >
                    Parlons de votre projet 
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Compétences --- */}
      <section id="competences" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="border-b-4 border-violet-500 pb-2">Mes Compétences</span>
          </h2>
          {/* Sous-titre ajouté — contextualise les compétences pour le client */}
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Les technologies que j'utilise pour construire des applications rapides, fiables et évolutives.
          </p>
          
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="border-b-4 border-violet-500 pb-2">Projets Récents</span>
          </h2>
          {/* Sous-titre orienté résultats */}
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Des applications concrètes qui résolvent de vrais problèmes. Chaque projet est une preuve de ce que je peux construire pour vous.
          </p>
          
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

          {/* Pagination */}
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

          {/* ============================================================
              CTA APRÈS PROJETS — Moment clé de conversion
              Le visiteur vient de voir vos projets (preuve). C'est LE moment
              pour lui proposer l'action. "Vous voulez quelque chose de similaire ?"
              ============================================================ */}
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-4">Vous avez un projet similaire en tête ?</p>
            <button
              onClick={scrollToContact}
              className="cursor-pointer inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-violet-600/20 active:scale-95"
            >
              Demander un devis gratuit <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* --- Expériences --- */}
      <section id="experiences" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="border-b-4 border-violet-500 pb-2">Expériences</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Chaque mission m'a permis de renforcer mon expertise technique et ma capacité à livrer des résultats concrets.
          </p>
          
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

      {/* ============================================================
          BANNIÈRE CTA — Section de transition avant le formulaire
          
          Rôle : Créer un "moment de décision" clair.
          Le visiteur a vu : votre profil, vos compétences, vos projets, 
          votre expérience. Il est maintenant à son pic de confiance.
          
          Cette bannière lui dit : "C'est maintenant, passez à l'action."
          ============================================================ */}
      <section className="py-16 bg-gradient-to-r from-violet-900/30 via-fuchsia-900/20 to-violet-900/30 border-y border-violet-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à donner vie à votre projet ?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Que ce soit une application web, un site vitrine ou un outil métier, 
            je suis disponible pour en discuter. <span className="text-violet-400 font-medium">Premier échange gratuit et sans engagement.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToContact}
              className="cursor-pointer flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-violet-600/30 active:scale-95 text-lg"
            >
              <Mail size={20} />
              M'envoyer un message
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-green-600/20 active:scale-95 text-lg"
            >
              <FaWhatsapp size={20} />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT — Section optimisée pour la conversion
          
          Améliorations :
          1. Titre orienté action (pas juste "Contactez-moi")
          2. Promesse concrète ("Je réponds sous 24h")
          3. Formulaire avec labels orientés conversation
          4. Alternatives de contact (WhatsApp + Email direct) sous le form
          5. Confetti au succès d'envoi (récompense émotionnelle)
          ============================================================ */}
      <section id="contact" className="py-20 bg-[#13091e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="border-b-4 border-violet-500 pb-2">Lancez votre projet</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
            Décrivez-moi votre projet ou votre besoin. <span className="text-violet-400 font-medium">Je vous réponds personnellement sous 24h</span> avec des premières pistes concrètes.
          </p>

          <form 
            ref={formRef}
            onSubmit={sendEmail}
            className="space-y-6 bg-[#1a0b2e] p-8 rounded-2xl border border-violet-900/30 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Votre nom</label>
                <input 
                  type="text" 
                  name="user_name"
                  id="name" 
                  required
                  className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Votre email</label>
                <input 
                  type="email" 
                  name="user_email"
                  id="email" 
                  required
                  className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="jean@entreprise.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Type de projet</label>
              <input 
                type="text" 
                name="subject"
                id="subject" 
                required
                className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Ex: Application web, site vitrine, outil interne..."
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Décrivez votre besoin</label>
              <textarea 
                name="message"
                id="message" 
                rows={4} 
                required
                className="w-full bg-[#0f0715] border border-violet-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Parlez-moi de votre projet, vos objectifs, vos délais..."
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
                  Envoyer mon message <Send size={20} />
                </>
              )}
            </button>
          </form>

          {/* ============================================================
              ALTERNATIVES DE CONTACT — Crucial pour la conversion
              
              Tous les visiteurs ne veulent pas remplir un formulaire.
              Offrir WhatsApp + Email direct couvre tous les profils :
              - Les pressés → WhatsApp
              - Les formels → Email
              - Les prudents → Formulaire
              ============================================================ */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-6">— Ou contactez-moi directement —</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#1a0b2e] border border-green-600/30 hover:border-green-500 text-green-400 hover:text-green-300 px-6 py-3 rounded-xl transition-all"
              >
                <FaWhatsapp size={20} />
                <span className="font-medium">WhatsApp : (+229) 01 91 14 24 78</span>
              </a>
              <a
                href={`mailto:${contactEmail}?subject=Projet%20web%20—%20Demande%20de%20devis`}
                className="flex items-center gap-3 bg-[#1a0b2e] border border-violet-600/30 hover:border-violet-500 text-violet-400 hover:text-violet-300 px-6 py-3 rounded-xl transition-all"
              >
                <Mail size={20} />
                <span className="font-medium">{contactEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER — Enrichi avec liens de contact
          Dernier point de contact pour le visiteur qui scrolle jusqu'en bas.
          ============================================================ */}
      <footer className="bg-[#0a0410] py-10 border-t border-violet-900/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
                Georgio<span className="text-white">.dev</span>
              </span>
              <p className="text-gray-500 text-sm mt-1">
                Développeur Full Stack — Disponible pour vos projets
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={22} />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="text-gray-400 hover:text-violet-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
              <a
                href="https://github.com/georgiovigni-dev-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={22} />
              </a>
            </div>
          </div>
          <div className="border-t border-violet-900/20 mt-6 pt-6 text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Georgio Vignizogbin — Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================================
          BOUTON WHATSAPP FLOTTANT — Toujours visible
          
          C'est l'un des éléments les plus importants pour la conversion.
          Il offre un canal de contact INSTANTANÉ, sans friction.
          Le visiteur peut vous contacter à tout moment de sa navigation.
          
          Position : en bas à droite, z-index élevé pour rester au-dessus.
          Animation pulse pour attirer l'attention subtilement.
          ============================================================ */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/30 transition-all hover:scale-110 active:scale-95 animate-bounce"
        aria-label="Contacter sur WhatsApp"
        style={{ animationDuration: '2s', animationIterationCount: '3' }}
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
};

export default Portfolio;