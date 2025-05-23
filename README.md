# CRM Portal

A modern Customer Relationship Management (CRM) application built with React, Vite, and Supabase. The application provides a seamless experience for both administrators and customers to manage services, orders, and customer relationships.

## Live Demo

Visit the live application at: [https://crm-portal-indol.vercel.app](https://crm-portal-indol.vercel.app)

## Features

- **Modern UI/UX Design**
  - Responsive layout
  - Clean and intuitive interface
  - Smooth transitions and animations
  - Professional branding

- **Authentication System**
  - Separate login flows for Admin and Customer
  - Secure session management
  - Role-based access control

- **Service Management**
  - Create, read, update, and delete services
  - Service categorization
  - Detailed service information
  - Service availability tracking

- **Order Management**
  - Complete order lifecycle management
  - Order status tracking
  - Order history
  - Real-time updates

- **Customer Management**
  - Customer profile management
  - Order history per customer
  - Service preferences
  - Communication preferences

## Tech Stack

- **Frontend**
  - React 18
  - Vite
  - Tailwind CSS
  - React Router
  - React Icons

- **Backend**
  - Supabase
  - PostgreSQL
  - Real-time subscriptions

- **Deployment**
  - Vercel (Frontend)
  - Supabase (Backend)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Database Setup

1. Log in to your Supabase dashboard at https://app.supabase.io
2. Select your project
3. Go to the SQL Editor
4. Copy and paste the contents of `schema.sql` to create the necessary tables
5. (Optional) Copy and paste the contents of `sample-data.js` to insert sample data

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is deployed on Vercel. To deploy your own version:

1. Fork the repository
2. Set up your Supabase project
3. Configure environment variables in Vercel
4. Deploy to Vercel

## Troubleshooting

### 404 Errors for Admin and Customer Tables

If you're seeing 404 errors when trying to access the Admin and Customer tables, it means these tables don't exist in your Supabase database. Follow the database setup instructions above to create these tables.

### Authentication Issues

If you're having trouble with authentication, make sure:
1. Your Supabase URL and Anon Key are correct in the `.env` file
2. The Admin and Customer tables exist in your database
3. You have at least one user in the appropriate table (Admin or Customer)

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── context/       # React context providers
│   ├── lib/           # Utility functions and Supabase client
│   ├── assets/        # Static assets
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/            # Public assets
├── schema.sql         # Database schema
├── setup-db.js        # Database setup script
└── sample-data.js     # Sample data script
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Kevin Joshua - [LinkedIn](https://www.linkedin.com/in/kevin-joshua-main/) - [GitHub](https://github.com/kevin-joshua/)
