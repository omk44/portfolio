import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronRight,
  Download,
  Code,
  Briefcase,
  Award,
  User,
  Terminal,
  GraduationCap,
  Trophy,
  Heart,
  Target
} from 'lucide-react';

import { personalInfo, skills, experience, projects, certificates, education, achievements, hobbies, problemSolving } from './data.js';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'resume', 'projects', 'certificates'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="bg-mesh"></div>

      <nav className="glass-panel">
        {['home', 'resume', 'projects', 'certificates'].map((item) => (
          <a
            key={item}
            href={`#${item}`}
            className={activeSection === item ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(item);
            }}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </a>
        ))}
      </nav>

      <main>
        {/* HERO SECTION */}
        <section id="home" className="section container" style={{ minHeight: '100vh', paddingTop: '120px' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="hero-layout"
          >
            <div className="hero-content">
              <motion.span variants={itemVariants} className="badge" style={{ marginBottom: '24px' }}>
                <Terminal size={14} style={{ display: 'inline', marginRight: '6px' }} />
                {personalInfo.title}
              </motion.span>

              <motion.h1 variants={itemVariants} className="hero-title">
                Crafting <span className="text-gradient">digital</span><br />
                experiences for the <span className="text-gradient-accent">future.</span>
              </motion.h1>

              <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px' }}>
                {personalInfo.description}
              </motion.p>

              <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => scrollTo('projects')}>
                  View My Work <ChevronRight size={18} />
                </button>
                <a href={personalInfo.github} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  <Github size={18} /> GitHub
                </a>
                <a href={personalInfo.linkedin} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  <Linkedin size={18} /> LinkedIn
                </a>
              </motion.div>
            </div>

            {personalInfo.imageUrl && (
              <motion.div variants={itemVariants} className="hero-image-container">
                <div style={{
                  width: '100%',
                  maxWidth: '350px',
                  aspectRatio: '1/1',
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                  overflow: 'hidden',
                  border: '4px solid var(--glass-border)',
                  boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
                  padding: '8px',
                  background: 'var(--glass-bg)',
                  animation: 'morph 8s ease-in-out infinite'
                }}>
                  <style>{`
                     @keyframes morph {
                       0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                       50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
                       100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                     }
                   `}</style>
                  <img src={personalInfo.imageUrl} alt={personalInfo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* RESUME / ABOUT SECTION */}
        <section id="resume" className="section container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', justifyContent: 'center' }}>
              <User size={32} color="var(--accent-1)" />
              <h2 className="section-title" style={{ marginBottom: 0 }}>Resume & Skills</h2>
            </div>

            <div className="resume-grid">
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Briefcase size={24} color="var(--accent-2)" />
                  Experience
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {experience.map((job, i) => (
                    <div key={i} style={{ borderLeft: '2px solid var(--glass-border)', paddingLeft: '24px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-1)' }}></div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{job.role}</h4>
                      <div style={{ color: 'var(--accent-3)', fontSize: '0.9rem', marginBottom: '8px' }}>{job.company} | {job.year}</div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{job.desc}</p>
                    </div>
                  ))}
                </div>

                {/* EDUCATION */}
                <h3 style={{ fontSize: '1.5rem', marginTop: '48px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GraduationCap size={24} color="var(--accent-2)" />
                  Education
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {education.map((edu, i) => (
                    <div key={i} style={{ borderLeft: '2px solid var(--glass-border)', paddingLeft: '24px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-1)' }}></div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{edu.degree}</h4>
                      <div style={{ color: 'var(--accent-3)', fontSize: '0.9rem', marginBottom: '8px' }}>{edu.institution} | {edu.duration}</div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{edu.details}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '48px' }}>
                  <a href={personalInfo.resumeUrl} download className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                    <Download size={18} /> Download CV
                  </a>
                </div>
              </div>

              <div>
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Code size={24} color="var(--accent-2)" />
                    Tech Stack
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* ACHIEVEMENTS */}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={24} color="var(--accent-2)" />
                  Achievements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                  {achievements.map((ach, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '24px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{ach.icon}</span> {ach.title}
                      </h4>
                      <div style={{ color: 'var(--accent-1)', fontSize: '0.85rem', marginBottom: '12px' }}>{ach.platform}</div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{ach.desc}</p>
                    </div>
                  ))}
                </div>

                {/* PROBLEM SOLVING */}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Target size={24} color="var(--accent-2)" />
                  Problem Solving
                </h3>
                <div className="problem-solving-grid">
                  {problemSolving.map((ps, i) => (
                    <a key={i} href={ps.link} target="_blank" rel="noreferrer" className="glass-card" style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.5rem' }}>{ps.icon}</span>
                        <ExternalLink size={14} color="var(--text-secondary)" />
                      </div>
                      <h4 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginTop: '8px' }}>{ps.platform}</h4>
                      <div style={{ color: 'var(--accent-1)', fontSize: '0.9rem', fontWeight: 500 }}>{ps.solved} Solved</div>
                    </a>
                  ))}
                </div>

                {/* HOBBIES */}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Heart size={24} color="var(--accent-2)" />
                  Hobbies & Interests
                </h3>
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <div className="hobbies-grid">
                    {hobbies.map((hobby, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '1.2rem' }}>{hobby.icon}</span> {hobby.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="section container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', justifyContent: 'center' }}>
              <Terminal size={32} color="var(--accent-1)" />
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Projects</h2>
            </div>

            <div className="projects-grid">
              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  className="glass-card flex flex-col"
                  style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}
                  whileHover={{ y: -8 }}
                >
                  <div style={{ width: '100%', height: '180px', borderRadius: '12px', background: `linear-gradient(45deg, ${project.color}, transparent)`, marginBottom: '24px', overflow: 'hidden', position: 'relative' }}>
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: 0.9 }} />
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 600 }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', flexGrow: 1 }}>{project.desc}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {project.tags.map(tag => <span key={tag} style={{ fontSize: '0.8rem', color: 'var(--accent-1)' }}>#{tag}</span>)}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                    {project.liveLink && project.liveLink !== "#" ? (
                      <a href={project.liveLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    ) : project.localSetup ? (
                      <a href={project.sourceLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                        <Download size={16} /> Run Locally
                      </a>
                    ) : null}

                    <a href={project.sourceLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                      <Github size={16} /> Source
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CERTIFICATES SECTION */}
        <section id="certificates" className="section container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', justifyContent: 'center' }}>
              <Award size={32} color="var(--accent-1)" />
              <h2 className="section-title" style={{ marginBottom: 0 }}>Certifications</h2>
            </div>

            <div className="certificates-grid">
              {certificates.map((cert, i) => (
                <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {cert.icon}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{cert.name}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{cert.issuer} • {cert.date}</p>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-1)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                        View Certificate <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '40px 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>Let's build the future.</h2>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href={`mailto:${personalInfo.email}`} style={{ color: 'var(--text-secondary)' }}><Mail size={24} /></a>
              <a href={personalInfo.github} style={{ color: 'var(--text-secondary)' }}><Github size={24} /></a>
              <a href={personalInfo.linkedin} style={{ color: 'var(--text-secondary)' }}><Linkedin size={24} /></a>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} {personalInfo.name}. Designed & Built with React & Framer Motion.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
