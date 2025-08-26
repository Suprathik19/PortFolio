# Alex Johnson - ECE Portfolio (Vanilla Version)

This is a vanilla HTML, CSS, and JavaScript version of the ECE portfolio website with a violet and white color theme.

## Files Structure

```
portfolio-vanilla/
├── index.html          # Main HTML structure
├── styles.css          # All styling including violet theme and dark mode
├── script.js           # JavaScript functionality
├── profile-photo.jpg   # Profile photo (replace with your own)
└── README.md           # This file
```

## Features

### 🎨 Design Features
- **Violet Color Theme**: Custom OKLCH color palette for precise violet theming
- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects, transitions, and scroll-triggered animations
- **Modern UI**: Glass morphism effects, gradient backgrounds, and polished styling

### 🔧 Interactive Features
- **Smooth Scrolling Navigation**: Click navigation links to smoothly scroll to sections
- **Contact Form**: Fully functional form with validation and success feedback
- **Resume Download**: Download resume as text file (customize the content)
- **Dark Mode Toggle**: Persistent theme switching with localStorage
- **Responsive Mobile Menu**: Works on all screen sizes
- **Keyboard Navigation**: Full keyboard accessibility support

### 📱 Sections Included
1. **Hero Section**: Large title, subtitle, call-to-action buttons, and circular profile photo
2. **About Me**: Personal background, focus areas, and achievement cards
3. **Technical Skills**: Four categories with list-style formatting and violet bullet points
4. **Certifications**: Large rectangular certification cards
5. **Projects**: Featured project showcase with tech badges
6. **Contact**: Personal information buttons and contact form
7. **Footer**: Simple footer with social links

## Customization Guide

### 🖼️ Replace Profile Photo
1. Replace `profile-photo.jpg` with your own photo
2. Make sure it's square (e.g., 400x400px) for best results
3. Keep the same filename or update the `src` attribute in `index.html`

### ✏️ Update Personal Information
Edit these sections in `index.html`:

**Hero Section** (lines ~214-226):
```html
<h1 class="hero-title">Your Name</h1>
<div class="hero-subtitle">Your Title</div>
<p class="hero-description">Your description...</p>
```

**Contact Information** (lines ~577-601):
```html
<a href="mailto:your.email@example.com" class="contact-button">
<a href="https://linkedin.com/in/yourprofile" class="contact-button">
<a href="https://github.com/yourusername" class="contact-button">
```

**Skills** (lines ~382-442):
Update the skill lists in each category

**Certifications** (lines ~460-507):
Replace with your actual certifications

**Projects** (lines ~522-548):
Update with your real projects

### 🎨 Customize Colors
The violet theme is defined in CSS custom properties at the top of `styles.css`:

```css
:root {
    --violet-600: oklch(0.585 0.163 302.5);
    --violet-700: oklch(0.515 0.160 302.5);
    /* etc. */
}
```

To change the color:
1. Visit [OKLCH Color Picker](https://oklch.com/)
2. Pick your desired color
3. Replace the OKLCH values in the CSS

### ⚙️ Customize Resume Content
Edit the resume content in `script.js` (lines ~108-152):

```javascript
const resumeContent = `YOUR NAME
Your Title

CONTACT INFORMATION
Email: your.email@example.com
// ... rest of your content
`;
```

## How to Use

### 🌐 Local Development
1. Download all files to a folder
2. Open `index.html` in any modern web browser
3. That's it! No server required.

### 🚀 Deployment Options
- **GitHub Pages**: Upload to a GitHub repository and enable GitHub Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your Git repository to Vercel
- **Web Hosting**: Upload files via FTP to any web hosting service

### 📧 Contact Form Setup
The contact form currently simulates submission. To make it functional:

1. **Using Formspree**:
   - Sign up at [Formspree.io](https://formspree.io/)
   - Replace the form action: `<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`

2. **Using Netlify Forms**:
   - Add `netlify` attribute to form: `<form netlify>`
   - Deploy to Netlify

3. **Custom Backend**:
   - Update the `handleSubmit` function in `script.js` to send data to your server

## Browser Support
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- All modern mobile browsers

## Font Dependencies
The portfolio uses Google Fonts:
- **Inter**: Main UI font
- **Playfair Display**: Serif font for headings (if needed)

These are loaded from Google Fonts CDN in the HTML head.

## Icon Dependencies
- **Font Awesome 6**: For all icons
- Loaded from CDN, no local installation required

## Performance Features
- Optimized CSS with minimal unused styles
- Efficient JavaScript with event delegation
- Intersection Observer for scroll animations
- Debounced resize handling
- Smooth scrolling with native CSS

## Accessibility Features
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus indicators
- High contrast colors
- Screen reader friendly

## License
Feel free to use this code for your own portfolio. No attribution required, but appreciated!

## Credits
- Built with vanilla HTML, CSS, and JavaScript
- Icons by Font Awesome
- Fonts by Google Fonts
- Color system using OKLCH color space
- Inspired by modern design principles

---

**Note**: Remember to replace all placeholder content with your actual information before using this portfolio publicly!