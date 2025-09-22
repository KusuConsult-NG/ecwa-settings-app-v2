# ECWA Settings App V2

A clean, modern, and comprehensive financial and organizational management system for ECWA organizations.

## 🚀 Features

### Financial Management
- **Expenditure Tracking**: Complete expenditure management with approval workflows
- **Income Management**: Track and manage organizational income
- **Bank Management**: Integrated banking and financial operations
- **Financial Reports**: Comprehensive reporting and analytics

### Human Resources
- **Staff Management**: Complete staff directory and management
- **Payroll Processing**: Automated payroll management
- **Leave Management**: Staff leave tracking and approval
- **User Roles**: Role-based access control and permissions

### Organization Management
- **Multi-level Organizations**: Support for complex organizational structures
- **Agencies & Groups**: Manage different ECWA agencies and groups
- **Executive Management**: Leadership and executive oversight tools

### System Features
- **Audit Trails**: Comprehensive logging of all activities
- **Security**: Role-based access control and secure authentication
- **Analytics**: Real-time dashboards and reporting
- **Modern UI**: Clean, responsive design with excellent UX

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Package Manager**: Bun

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecwa-settings-app-v2
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── expenditures/       # Expenditure management
│   ├── hr/                # Human resources
│   ├── income/            # Income management
│   ├── agencies/          # Agency management
│   └── audit/             # Audit logs
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── lib/                  # Utility functions and helpers
└── globals.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 🔧 Development

### Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database
- **Self-hosted**: Docker support available

## 📝 Database Setup

This version is designed to be database-agnostic. You can integrate with:

- **PostgreSQL** (Recommended)
- **MongoDB**
- **MySQL**
- **SQLite** (Development)

## 🔐 Authentication

The app is designed to support multiple authentication methods:

- **JWT Tokens**
- **Session-based**
- **OAuth** (Google, Microsoft)
- **Custom authentication**

## 📊 Features Roadmap

### Phase 1 (Current)
- [x] Basic UI/UX
- [x] Navigation structure
- [x] Core pages
- [x] Responsive design

### Phase 2 (Next)
- [ ] Authentication system
- [ ] Database integration
- [ ] API endpoints
- [ ] User management

### Phase 3 (Future)
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- ECWA for the vision and requirements
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Radix UI for accessible components
- Lucide for beautiful icons

---

**ECWA Settings App V2** - Built with ❤️ for ECWA organizations# Vercel Deployment Fix
