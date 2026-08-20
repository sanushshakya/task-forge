# DEPLOYMENT.md

## Overview

This document provides step-by-step instructions on deploying a Next.js application to Vercel with MongoDB Atlas as the database.

## Prerequisites

1. **Vercel Account**: Ensure you have an account on [Vercel](https://vercel.com).
2. **MongoDB Atlas**: Set up a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. **Node.js and npm**: Ensure Node.js and npm are installed locally.
4. **Git**: Ensure Git is installed for version control.

## Steps to Deploy

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task
```

### 2. Set Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```plaintext
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret
OLLAMA_API_KEY=your-ollama-api-key
```

### 3. Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

### 4. Configure MongoDB Atlas

1. Log in to your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
2. Create a new cluster or use an existing one.
3. Get the connection string from the cluster dashboard and update it in `.env.local`.

### 5. Build the Application

Build the Next.js application for production:

```bash
npm run build
```

### 6. Deploy to Vercel

1. Log in to your [Vercel](https://vercel.com) account.
2. Click on "New Project" and import your repository from GitHub or GitLab.
3. Configure the project settings:
   - **Project Name**: Enter a name for your project.
   - **Root Directory**: Set it to `./`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `./out`
4. Add environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret
   - `OLLAMA_API_KEY`: Your Ollama API key

5. Deploy the project.

### 7. Verify Deployment

Once deployed, visit your Vercel project URL to ensure everything is working correctly.

## Additional Notes

- **Logs**: Check the Vercel logs for any errors during deployment or runtime.
- **Cache**: Ensure Redis cache is properly configured if used.
- **Testing**: Run tests locally before deploying to catch any issues early.

By following these steps, you should be able to successfully deploy your Next.js application with MongoDB Atlas on Vercel.