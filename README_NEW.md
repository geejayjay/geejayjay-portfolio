# GeeJayJay Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern React Stack**: Built with React 18, TypeScript, and Vite for fast development
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Custom UI components with Radix UI primitives
- **Contact Form**: Integrated with EmailJS for direct contact functionality
- **Smooth Animations**: Framer Motion for beautiful transitions
- **3D Elements**: Three.js integration for enhanced visual experience

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Tailwind Animate
- **Build Tool**: Vite
- **UI Components**: Radix UI + Custom Components
- **Animations**: Framer Motion
- **3D Graphics**: Three.js + React Three Fiber
- **Forms**: React Hook Form + EmailJS
- **Routing**: React Router DOM

## 📁 Project Structure

```
├── public/              # Static assets
│   ├── skills/         # Skill icons
│   └── works/          # Project images
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Reusable UI components
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Layout.tsx
│   │   ├── SkillsSection.tsx
│   │   └── WorkSection.tsx
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app component
│   └── global.css     # Global styles
├── index.html         # Entry HTML file
├── vite.config.ts     # Vite configuration
└── tailwind.config.ts # Tailwind configuration
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geejayjay-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Configure your `.env` file:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📧 Contact Form Setup

The contact form uses EmailJS for sending emails. To set it up:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Add your credentials to the `.env` file
4. The form will automatically send emails to your configured address

## 🎨 Customization

### Colors
The color scheme can be customized in `tailwind.config.ts`:
- Primary: Orange (#fb923c)
- Secondary: Dark green (#2C4848)

### Content
Update the content in each section component:
- `HeroSection.tsx` - Main introduction
- `AboutSection.tsx` - About information
- `SkillsSection.tsx` - Skills and technologies
- `WorkSection.tsx` - Projects and work
- `ContactSection.tsx` - Contact information

### Skills Icons
Add new skill icons to `public/skills/` and update the skills array in `SkillsSection.tsx`.

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

The project can be deployed to any static hosting service:

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Vercel
1. Connect your GitHub repository
2. Vercel will automatically build and deploy

### GitHub Pages
1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run typecheck` - Type checking
- `npm run format.fix` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by GeeJayJay**
