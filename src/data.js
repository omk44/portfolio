// This is your data file. 
// Whenever you want to add a new project, certificate, or experience, just update this file.
// The website will automatically update with the new data.

export const personalInfo = {
    name: "Om",
    title: "Software Engineer | ML & .NET Enthusiast",
    subtitle: "Crafting digital experiences for the future.",
    description: "I am a 6th-semester student at Dharmsinh Desai University on a forward-looking path to becoming a top-tier software engineer. I specialize in Python and full-stack .NET Core development (WebAPI), building robust, clean systems. I have a deep passion for Machine Learning, and while my core focus is software development, I also have a keen interest in System Design and DevOps.",
    email: "omkapadiya34@gmail.com",
    github: "https://github.com/omk44",
    linkedin: "https://www.linkedin.com/in/om-kapadiya-58423b287/",
    resumeUrl: "/resume.pdf", // Put your resume.pdf in the 'public' folder
    imageUrl: "/oms.jpeg" // Add your photo here
};

export const skills = [
    'JavaScript (ES6+)', 'React.js', 'Next.js', 'Node.js',
    'SqLite', 'PostgreSQL', 'Docker', '.NET Core', '.net framework', 'C#', 'java', 'Django', 'Python',
    'Git', 'GitLab',
    // Add new skills here
];

export const experience = [
    {
        role: "Intern Software Developer",
        company: "Arishti Dev",
        year: "May,2025 - January,2026",
        desc: "Leading the development of next-gen web applications using React & modern JS ecosystems."
    }
];

export const projects = [
    {
        title: "Aegis (CVE-Based Host Vulnerability Scanner)",
        desc: "A vulnerability scanner with real-time notifications via Celery and Redis. Uses ML-based anomaly detection to secure hosts.",
        tags: ["Python", "Django", "Celery", "Redis", "ML", "Docker"],
        color: "rgba(99, 102, 241, 0.2)",
        liveLink: "",
        localSetup: true,
        sourceLink: "https://github.com/omk44/Automated-CVE-based-Host-Vulnerability-Scanner", // Add your GitHub repository link here
        imageUrl: "/Aegis.png" // Add your image to public/ folder and reference it here, e.g. "/aegis.png"
    },
    {
        title: "LedgerLink",
        desc: "Smart handling system for local shops. Manages daily customer transactions by scanning unique IDs and sends email receipts automatically.",
        tags: [".NET Core", "MVC", "PostgreSQL", "C#"],
        color: "rgba(236, 72, 153, 0.2)",
        liveLink: "https://ledgerlink-app.onrender.com", // Add live link if available, otherwise it will just show Source
        sourceLink: "https://github.com/omk44/LedgerLink",
        imageUrl: "/LedgerLink.png" // Add your image to public/ folder and reference it here, e.g. "/ledgerlink.png"
    },
    {
        title: "OptiDoc",
        desc: "Scalable MERN-stack booking system designed for high-traffic multi-specialist and government hospitals. Features real-time notifications, a comprehensive admin dashboard for managing staff and appointments, and dedicated doctor portals.",
        tags: ["MERN", "MongoDB", "Express.js", "React", "Node.js", "Real-Time"],
        color: "rgba(139, 92, 246, 0.2)",
        liveLink: "https://opti-doc.vercel.app",
        sourceLink: "https://github.com/omk44/OptiDoc", // Add your GitHub repository link here
        imageUrl: "/OptiDoc.png" // Add your image to public/ folder and reference it here, e.g. "/optidoc.png"
    }
];

export const certificates = [
    {
        name: "Programming in Java",
        issuer: "NPTEL",
        date: "Jan - April 2025",
        icon: "☕",
        link: "/npteljava.pdf" // Put npteljava.pdf in the 'public' folder
    },
    {
        name: "Code Clash 2.0",
        issuer: "Competition",
        date: "14th February 2025",
        icon: "⚔️",
        link: "/codeclash.png" // Put npteljava.pdf in the 'public' folder

    },
    {
        name: "Code Quest",
        issuer: "GDG Groups",
        date: "14th December 2024",
        icon: "💻",
        link: "/codequest.png"
    }
];

export const education = [
    {
        degree: "B.Tech in Computer Engineering",
        institution: "Dharmsinh Desai University",
        duration: "Class of 2027 (Currently in 6th Semester)",
        details: "Current CGPA: 7.98. Focusing on software development, full-stack technologies, and machine learning."
    }
];

export const achievements = [
    {
        title: "Competitive Programming",
        platform: "LeetCode & Others",
        desc: "Regularly solving algorithmic problems to strengthen data structures and logical reasoning capabilities.",
        icon: "💻"
    }
];

export const problemSolving = [
    {
        platform: "LeetCode",
        link: "https://leetcode.com/u/omk34/", // Add your exact LeetCode profile link here
        solved: "150+", // Update with your exact solved count
        icon: "💻"
    }

];

export const hobbies = [
    { name: "Photography", icon: "📸" },
    { name: "Traveling", icon: "✈️" },
    { name: "Reading", icon: "📚" },
    { name: "Trekking", icon: "🥾" },
    { name: "Exploring ML Models", icon: "🤖" },
    { name: "System Design", icon: "�️" }
];
