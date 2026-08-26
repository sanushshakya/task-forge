// README.md

# Task API Documentation

## Project Description

This project is a RESTful API built using TypeScript and designed to manage user data, including settings for AI summaries and weekly insights. The application leverages MongoDB for data storage and utilizes JWT for authentication.

## Tech Stack

- **Language**: TypeScript
- **Framework**: FastAPI (for backend)
- **Database**: MongoDB
- **ORM/ODM**: Mongoose
- **Auth Method**: JWT
- **Docker**: Yes
- **Environment Variables**: Managed using Zod for validation
- **CI/CD**: Not specified in the profile

## Setup Instructions

### Environment Variables

Ensure you have a `.env` file at the root of your project with the following environment variables:

```plaintext
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
OLLAMA_URL=http://localhost:11434
STRIPE_API_KEY=<your_stripe_api_key>
```

Replace `<your_mongodb_connection_string>`, `<your_jwt_secret>`, and `<your_stripe_api_key>` with appropriate values.

### Docker Setup

To run the project using Docker, navigate to the root directory of your project and execute:

```bash
docker-compose up -d
```

This command will start all required services. Ensure that a local Ollama instance is running on `http://localhost:11434` for AI features.

## API Route List

### Authentication Endpoints

- **Method**: GET  
  **Path**: `/api/auth/me`  
  **Description**: Retrieves the authenticated user's ID.

- **Method**: POST  
  **Path**: `/api/auth/signup`  
  **Description**: Handles user signup requests.

### Entry Endpoints

- **Middleware**: Ensures requests are only processed for authenticated users.

### Health Check

- **Method**: GET  
  **Path**: `/api/health`  
  **Description**: Pings the MongoDB connection to ensure it's healthy.

### Insights Endpoints

- **Method**: GET  
  **Path**: `/api/insights/weekly`  
  **Description**: Retrieves user insights based on the last 7 days. AI features require a local Ollama instance running `qwen2.5-coder:7b`.

### Summary Endpoints

- **Method**: POST  
  **Path**: `/api/summary`  
  **Description**: Generates entry summaries using the Ollama API. AI features require a local Ollama instance running `qwen2.5-coder:7b`.

### Team Endpoints

- **Method**: POST  
  **Path**: `/api/teams/invite`  
  **Description**: Invites a user by email to join the authenticated user's team as a member if the requester is the team owner.

## Notes

AI features (e.g., weekly insights, summary generation) depend on a local Ollama instance running `qwen2.5-coder:7b`. Ensure this service is up and running before using these endpoints.

For further details and development instructions, refer to the project documentation or contact the project maintainers.

**Note:** AI features are not supported when deploying on Vercel due to limitations in environment configurations.