// ============================================================
//  PORTFOLIO DATA — Single Source of Truth
//  Edit this file OR use admin.html to update your portfolio.
//  Changes here reflect instantly on index.html.
// ============================================================

const PORTFOLIO_DEFAULTS = {
  personal: {
    name: "Menta Suprathik",
    shortName: "Suprathik",
    email: "suprathik973@email.com",
    linkedin: "https://www.linkedin.com/in/mentasuprathik/",
    github: "https://github.com/Suprathik19",
    githubRepos: "https://github.com/Suprathik19?tab=repositories",
    heroDescription: "Passionate about bridging hardware and software through innovative solutions. Specializing in embedded systems, web development, and IoT applications.",
    typingTitles: ["Web Developer", "Embedded System Enthusiast", "AI Explorer"],
    resumeFile: "SuprathikResume.pdf"
  },

  stats: {
    cgpa: "9.23",
    projects: "10+",
    problems: "100+",
    certifications: "3",
    internships: "1"
  },

  education: [
    {
      id: 1,
      degree: "B.Tech in ECE",
      institution: "VIT-AP University, Andhra Pradesh",
      years: "2023 - 2027",
      grade: "CGPA: 9.23/10",
      icon: "fas fa-graduation-cap"
    },
    {
      id: 2,
      degree: "Intermediate",
      institution: "Sri Deepthi Junior College Proddatur, Andhra Pradesh",
      years: "2021 - 2023",
      grade: "Percentage: 98.2%",
      icon: "fas fa-school"
    },
    {
      id: 3,
      degree: "SSC",
      institution: "Gopi Krishna High School Proddatur, Andhra Pradesh",
      years: "2017 - 2020",
      grade: "CGPA: 97.33",
      icon: "fas fa-medal"
    }
  ],

  skills: [
    {
      id: "languages",
      category: "Core Languages",
      icon: "fas fa-code",
      items: [
        { name: "Python",     pct: 90 },
        { name: "Embedded C", pct: 92 },
        { name: "C / C++",    pct: 88 },
        { name: "Java",       pct: 80 }
      ]
    },
    {
      id: "embedded",
      category: "Embedded & IoT",
      icon: "fas fa-microchip",
      items: [
        { name: "STM32 / ARM",            pct: 85 },
        { name: "Arduino",                pct: 95 },
        { name: "IoT / Sensors",          pct: 90 },
        { name: "Protocols (I2C/SPI/UART)", pct: 88 }
      ]
    },
    {
      id: "web",
      category: "Web Development",
      icon: "fas fa-globe",
      items: [
        { name: "React / TS",       pct: 85 },
        { name: "JavaScript (ES6+)", pct: 90 },
        { name: "Node.js",          pct: 80 },
        { name: "HTML5 / CSS3",     pct: 95 }
      ]
    },
    {
      id: "tools",
      category: "Tools & DB",
      icon: "fas fa-tools",
      items: [
        { name: "Git / GitHub",    pct: 92 },
        { name: "MySQL / MongoDB", pct: 85 }
      ]
    }
  ],

  certifications: [
    {
      id: 1,
      name: "Embedded System Design",
      issuer: "Maven Silicon",
      date: "2024",
      description: "Comprehensive training in Digital Electronics, ARM Architecture, and Embedded Protocols.",
      icon: "fas fa-microchip"
    },
    {
      id: 2,
      name: "C Certification",
      issuer: "Applogic Computer Institute",
      date: "June 2023 - Aug 2023",
      description: "In-depth validation of C programming proficiency and memory management mastery.",
      icon: "fas fa-code"
    },
    {
      id: 3,
      name: "Python Certification",
      issuer: "Applogic Computer Institute",
      date: "May 2023 - June 2023",
      description: "Certified expertise in Python scripting, data structures, and automation.",
      icon: "fab fa-python"
    }
  ],

  projects: [
    {
      id: 1,
      name: "AI-Enabled Wearable",
      description: "A low-power STM32 wearable integrating MAX30102 & MPU6050 sensors. Features edge-level decision making for real-time risk classification without cloud dependency.",
      category: "embedded",
      tech: ["STM32", "Edge AI", "IoT", "C/C++"],
      github: "https://github.com/Suprathik19?tab=repositories",
      live: ""
    },
    {
      id: 2,
      name: "StockFlow - Inventory",
      description: "Full-stack inventory dashboard with real-time analytics, role-based access control, and low-stock alerts. Built for scalability and performance.",
      category: "web",
      tech: ["React", "TypeScript", "Tailwind", "Node.js"],
      github: "https://github.com/Suprathik19?tab=repositories",
      live: ""
    },
    {
      id: 3,
      name: "EcoShield - Env Monitor",
      description: "Real-time environmental monitoring system using Arduino. Automates data processing for air quality, temperature, and humidity tracking.",
      category: "embedded",
      tech: ["Arduino", "Embedded C", "Automation"],
      github: "https://github.com/Suprathik19?tab=repositories",
      live: ""
    }
  ]
};

// ============================================================
//  DATA MANAGER — loads saved data from localStorage or defaults
// ============================================================
const PortfolioData = (function () {
  const STORAGE_KEY = "suprathik_portfolio_data";

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep-merge: keep defaults for any missing keys
        return deepMerge(PORTFOLIO_DEFAULTS, parsed);
      }
    } catch (e) {
      console.warn("Portfolio data load error, using defaults.", e);
    }
    return JSON.parse(JSON.stringify(PORTFOLIO_DEFAULTS));
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Portfolio data save error.", e);
      return false;
    }
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return JSON.parse(JSON.stringify(PORTFOLIO_DEFAULTS));
  }

  function deepMerge(defaults, override) {
    const result = JSON.parse(JSON.stringify(defaults));
    for (const key in override) {
      if (Array.isArray(override[key])) {
        result[key] = override[key]; // arrays: override fully
      } else if (typeof override[key] === "object" && override[key] !== null) {
        result[key] = deepMerge(result[key] || {}, override[key]);
      } else {
        result[key] = override[key];
      }
    }
    return result;
  }

  return { load, save, reset };
})();
