# 🦋 Quested Ed - AI-Powered Learning Adventure

> Transform learning into an epic quest! Where education meets gamification and AI tutoring creates magical learning experiences for young minds.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🌟 What is Quested Ed?

Quested Ed is a revolutionary gamified learning platform designed for children aged 7-13. We've transformed traditional education into an engaging adventure where students embark on learning quests, interact with AI tutors, and unlock achievements as they master new concepts.

### ✨ The Magic Behind the Learning

- **🎮 Gamified Learning Quests**: Turn math, science, language arts, and history into exciting adventures
- **🤖 AI Video Tutor**: Real-time conversations with an AI tutor powered by Tavus technology
- **🎨 Custom Avatar System**: Unlock and customize avatars as you progress through your learning journey
- **🎴 AI-Generated Flashcards**: Create personalized study materials with beautiful, themed designs
- **🏆 Achievement System**: Earn XP, level up, and collect badges for your accomplishments
- **📊 Progress Tracking**: Visual dashboards to monitor learning milestones and celebrate growth

## 🚀 Live Demo

**🌐 [Experience Quested Ed Live](https://ephemeral-selkie-ea4ca6.netlify.app)**

*Try the guest mode to explore all features without creating an account!*

## 🎯 Key Features

### 🎪 Interactive Learning Quests
- **Math Adventure** 🔢: Addition, subtraction, shapes, and patterns
- **Grammar Galaxy** 📚: Sentence structure, parts of speech, and vocabulary
- **Science Safari** 🔬: Animals, nature, space, and basic scientific concepts
- **History Heroes** 🏛️: Famous figures, ancient civilizations, and historical events

### 🤖 AI-Powered Tutoring
- Real-time video conversations with an AI tutor
- Personalized learning assistance
- Interactive Q&A sessions
- Adaptive teaching based on student progress

### 🎨 Avatar Customization
- Unlock new hairstyles, outfits, and accessories
- Themed backgrounds from forests to space stations
- XP-based progression system
- Express your personality through customization

### 🎴 Smart Flashcard Generator
- AI-generated flashcards with beautiful themes
- 15+ categories: fruits, animals, vehicles, emotions, and more
- 10+ art styles: cartoon animals, space explorers, fairy tale magic
- Custom word input for personalized learning

### 📈 Comprehensive Progress System
- XP points and level progression
- Achievement badges and milestones
- Visual progress tracking
- Motivational feedback and encouragement

## 🛠️ Technology Stack

### Frontend Powerhouse
- **⚡ Nuxt 3**: Modern Vue.js framework with SSR capabilities
- **🎨 Vuetify 3**: Material Design component library
- **🎯 TypeScript**: Type-safe development experience
- **🍃 Tailwind CSS**: Utility-first CSS framework
- **📱 PWA Ready**: Progressive Web App capabilities

### Backend & Database
- **🔥 Supabase**: PostgreSQL database with real-time capabilities
- **🔐 Row Level Security**: Secure data access patterns
- **📊 Real-time Subscriptions**: Live data updates
- **🔑 Authentication**: Email/password and guest access

### AI & Media Integration
- **🎥 Tavus AI**: Video-based AI tutoring platform
- **🧠 OpenRouter**: AI-powered content generation
- **🎨 Dynamic Content**: AI-generated flashcards and educational materials

### State Management & Architecture
- **🗃️ Pinia**: Intuitive state management
- **🔄 Composables**: Reusable Vue composition functions
- **📦 Modular Design**: Clean, maintainable codebase

## 🏗️ Project Structure

```
quested-ed/
├── 📁 assets/           # Global styles and fonts
├── 📁 components/       # Reusable Vue components
├── 📁 composables/      # Vue composition functions
├── 📁 layouts/          # Application layouts
├── 📁 middleware/       # Route middleware
├── 📁 pages/           # Application routes
├── 📁 plugins/         # Nuxt plugins
├── 📁 stores/          # Pinia state stores
├── 📁 supabase/        # Database migrations
└── 📁 public/          # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Tavus API account (for AI tutoring)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/quested-ed.git
cd quested-ed
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
OPENROUTER_API_KEY=your_openrouter_api_key
TAVUS_API_KEY=your_tavus_api_key
NUXT_PUBLIC_TAVUS_REPLICA_ID=your_replica_id
NUXT_PUBLIC_TAVUS_PERSONA_ID=your_persona_id

# Optional: Daily.co for video calls
NUXT_PUBLIC_DAILY_ROOM_URL=your_daily_room_url
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the provided migrations in the `supabase/migrations/` folder
3. Enable Row Level Security (RLS) on all tables

### 4. Launch Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` and start your learning adventure! 🎉

## 🎮 How to Play

### For Students
1. **Sign Up or Try Guest Mode**: Create an account or explore as a guest
2. **Choose Your Quest**: Select from math, science, language, or history adventures
3. **Learn & Earn**: Complete challenges to earn XP and unlock rewards
4. **Customize Your Avatar**: Use earned XP to unlock new customization options
5. **Create Flashcards**: Generate personalized study materials
6. **Chat with AI Tutor**: Get help and explanations through video conversations

### For Educators & Parents
- **Monitor Progress**: Track learning milestones and achievements
- **Encourage Exploration**: Support students in trying different quest categories
- **Celebrate Success**: Acknowledge badge earnings and level progressions
- **Supplement Learning**: Use generated flashcards for additional practice

## 🎨 Design Philosophy

### Child-Centric Design
- **Intuitive Navigation**: Simple, icon-based interface
- **Vibrant Colors**: Engaging purple and teal color palette
- **Friendly Typography**: Fredoka font for readability and warmth
- **Responsive Design**: Works seamlessly on tablets, phones, and desktops

### Gamification Elements
- **Progressive Unlocks**: Maintain engagement through achievement systems
- **Visual Feedback**: Animations and micro-interactions for user delight
- **Personalization**: Avatar customization for self-expression
- **Achievement Recognition**: Badges and celebrations for milestones

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety throughout the application
- **Vue DevTools**: Enhanced debugging experience
- **Hot Module Replacement**: Fast development iterations

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with automatic builds on push

### Manual Deployment
```bash
npm run build
npm run preview
```

## 🤝 Contributing

We welcome contributions from educators, developers, and learning enthusiasts!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Areas
- 📚 **Educational Content**: New quest types and learning materials
- 🎨 **UI/UX Improvements**: Enhanced user experience and accessibility
- 🔧 **Technical Features**: Performance optimizations and new functionality
- 🌍 **Localization**: Multi-language support
- 📖 **Documentation**: Improved guides and tutorials

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tavus AI** for revolutionary video AI technology
- **Supabase** for providing an amazing backend-as-a-service platform
- **Nuxt.js Team** for the incredible full-stack framework
- **Vuetify** for beautiful Material Design components
- **OpenRouter** for AI content generation capabilities
- **The Education Community** for inspiring this project

## 📞 Support & Contact

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/quested-ed/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/quested-ed/discussions)
- 📧 **Email**: support@questeded.com
- 🐦 **Twitter**: [@QuestEdApp](https://twitter.com/QuestEdApp)

---

<div align="center">

**🌟 Made with ❤️ for young learners everywhere 🌟**

*Transforming education, one quest at a time!*

[⭐ Star this repo](https://github.com/your-username/quested-ed) | [🚀 Try Live Demo](https://ephemeral-selkie-ea4ca6.netlify.app) | [📖 Documentation](https://docs.questeded.com)

</div>