# Mini Payment Frontend

A modern, responsive Next.js frontend application for processing payments and managing transactions. Built with shadcn/ui components, TailwindCSS, and TypeScript with a focus on excellent mobile responsiveness and user experience.

## Features

- 🎨 **Modern UI**: Clean and intuitive interface built with shadcn/ui components
- 📱 **Fully Responsive**: Mobile-first design with adaptive layouts for all screen sizes
- 💳 **Payment Processing**: Secure payment form with comprehensive validation
- 🔍 **Transaction Lookup**: Search and view detailed transaction information
- 📊 **Payment History**: Comprehensive table view of all transactions with status indicators
- 📋 **Copy Functionality**: One-click copy for transaction IDs with visual feedback
- ⚡ **Real-time Updates**: Instant feedback with toast notifications
- 🎭 **Smooth Animations**: Framer Motion animations for enhanced user experience
- 🏷️ **Smart Badges**: Status badges with proper hover effects and color coding
- 🎯 **Tab Navigation**: Responsive tab system that adapts to mobile screens

## Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **React**: 19.1.0
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: TailwindCSS 3.3.2
- **Forms**: React Hook Form 7.62.0 + Yup validation
- **Animations**: Framer Motion 12.23.15
- **State Management**: Zustand 5.0.8
- **HTTP Client**: Axios 1.12.2
- **Notifications**: React Hot Toast 2.6.0
- **Icons**: Lucide React 0.544.0
- **Language**: TypeScript 5
- **Utilities**:
  - clsx & tailwind-merge for conditional styling
  - class-variance-authority for component variants
  - tailwindcss-animate for animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mini_payment_frontend_next_js
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   └── transactions/       # Transaction API endpoints
│   ├── components/             # App-specific components
│   │   └── transaction-lookup.tsx # Transaction lookup functionality
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page with tab navigation
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── badge.tsx          # Status badge component
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── input.tsx          # Input component
│   │   ├── label.tsx          # Label component
│   │   ├── select.tsx         # Select component
│   │   └── table.tsx          # Table component
│   ├── payment-form.tsx       # Payment creation form
│   ├── payment-lookup.tsx     # Transaction search and details
│   └── payments-list.tsx      # All payments table view
├── lib/
│   ├── api.ts                 # API client configuration
│   ├── hooks/                 # Custom hooks
│   │   └── use-payment.ts     # Payment-related hooks
│   └── utils.ts               # Utility functions
└── public/                    # Static assets
```

## API Integration

The application integrates with a backend API running on `http://localhost:5000` with the following endpoints:

- `POST /api/payments` - Create a new payment
- `GET /api/payments/{id}` - Get transaction by ID
- `GET /api/payments` - Get all transactions

## Components

### PaymentForm (`components/payment-form.tsx`)
- Complete payment form with card details, amount, and currency
- Comprehensive form validation using React Hook Form + Yup
- Demo data functionality for quick testing
- Real-time validation feedback and error handling

### PaymentLookup (`components/payment-lookup.tsx`)
- Transaction search by ID functionality
- Detailed transaction information display
- Copy transaction ID with visual feedback
- Fully responsive layout for mobile devices
- Elegant animations and loading states

### PaymentsList (`components/payments-list.tsx`)
- Comprehensive table view of all transactions
- Status badges with hover effects and proper color coding
- Copy functionality for transaction IDs
- Responsive design that adapts to mobile screens
- Refresh functionality with loading indicators

### Tab Navigation (`app/page.tsx`)
- Responsive tab system that stacks vertically on mobile
- Smooth animations with Framer Motion
- Abbreviated text labels for very small screens
- Active tab indicators with layout animations

## Features in Detail

### Mobile Responsiveness
- Mobile-first design approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Responsive typography and spacing

### Copy Functionality
- One-click copy for transaction IDs
- Visual feedback with icon transitions (Copy → Check)
- Toast notifications for success/failure
- Available in both lookup and list views

### Status Badges
- Color-coded status indicators (Success: green, Failed: red, Pending: yellow)
- Smooth hover effects with appropriate color transitions
- Consistent styling across all components

### Form Validation
- Real-time validation feedback
- Comprehensive error messages
- Card number format validation
- Date validation for expiry fields

### Demo Data
- Pre-filled test card number for quick testing
- Comprehensive demo data including all required fields
- Quick testing without manual data entry

### Error Handling
- Comprehensive API error handling
- User-friendly error messages
- Loading states for all async operations
- Toast notifications for immediate user feedback

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server

### Code Style

- TypeScript for complete type safety
- Modern React patterns with hooks and functional components
- shadcn/ui component architecture
- Consistent file and component naming conventions
- Responsive design patterns throughout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.