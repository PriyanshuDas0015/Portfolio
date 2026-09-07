import { projects } from './projects';
import { skills } from './skills';
import { journey } from './journey';
import { services } from './services';
import { site } from './socialLinks';
export const defaults = {
  projects,
  skills,
  journey,
  services,
  resume: null,
  certificates: [],
  education: [
    {
      institution: 'SRM University',
      degree: 'Bachelor of Technology',
      field: 'Computer Science and Engineering',
      location: 'Sonipat, Haryana',
      expectedGraduation: 'August 2027',
      coursework: [
        'Data Structures and Algorithms',
        'Object-Oriented Programming',
        'Database Management Systems',
        'Operating Systems',
      ],
    },
  ],
  settings: {
    hero: {
      smallLabel: '// FRONTEND DEVELOPER',
      name: 'Priyanshu Das',
      mainRole: 'Frontend Developer',
      headline: 'I build modern, responsive and meaningful web experiences.',
      shortDescription: 'Frontend Developer | Computer Science Undergraduate',
      longDescription:
        "I'm a Computer Science undergraduate and Frontend Developer passionate about web development, building real-world projects and creating digital solutions that make an impact.",
      availabilityText: 'Open to opportunities',
      availabilityOn: true,
      primaryCta: 'View My Projects',
      secondaryCta: 'Contact Me',
      primaryTarget: '#projects',
      secondaryTarget: '#contact',
      badges: [],
    },
    about: {
      sectionLabel: '01. About Me',
      heading: 'More than just a developer.',
      description:
        "I'm Priyanshu, a Computer Science undergraduate and Frontend Developer who enjoys turning ideas into thoughtful digital experiences. From crafting clean interfaces to solving real-world problems, I learn best by building. Every project is a chance to explore, improve and create something meaningful.",
      quote: 'Better solutions for a brighter tomorrow.',
      description2: '',
      features: [
        { title: 'Focused', subtitle: 'On learning', icon: 'focus' },
        { title: 'Problem Solver', subtitle: 'Solution oriented', icon: 'lightbulb' },
        { title: 'Always', subtitle: 'Building', icon: 'hammer' },
        { title: 'Open', subtitle: 'To opportunities', icon: 'arrow' },
      ],
    },
    socialLinks: { github: site.github, linkedin: site.linkedin, email: site.email, other: [] },
    contactInfo: {
      email: site.email,
      phone: '',
      location: site.location,
      heading: "Let's create something amazing.",
      subheading: "Have a project in mind or just want to say hi? I'd love to hear from you.",
    },
    sections: [
      ['about', 'About', true, 1],
      ['skills', 'Skills', true, 2],
      ['projects', 'Projects', true, 3],
      ['experience', 'Experience', true, 4],
      ['education', 'Education', false, 5],
      ['certificates', 'Certificates', true, 6],
      ['services', 'Services', false, 7],
      ['resume', 'My Resume', true, 8],
      ['contact', 'Contact', true, 9],
    ].map(([key, label, inNavbar, displayOrder]) => ({
      key,
      label,
      visible: true,
      inNavbar,
      displayOrder,
    })),
    identity: {
      siteName: 'Priyanshu Das Portfolio',
      logoText: 'PD',
      browserTitle: 'Priyanshu Das | Frontend Developer',
      metaDescription: 'Portfolio of Priyanshu Das, Frontend Developer.',
      faviconUrl: '',
      footerText: 'Designed and built by Priyanshu Das.',
      copyrightYear: null,
    },
    seo: {
      title: 'Priyanshu Das | Frontend Developer',
      description: 'Portfolio projects, skills and contact information for Priyanshu Das.',
      ogTitle: 'Priyanshu Das | Frontend Developer',
      ogDescription: 'Explore the work of Priyanshu Das.',
      ogImage: '',
    },
    announcement: { enabled: false, text: '', link: '' },
  },
};
