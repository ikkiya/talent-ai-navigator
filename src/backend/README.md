
# Backend Directory

This directory contains all the service adapters for communicating with the Java backend.

## Java Backend Setup

You'll need to set up a Java backend with the following:

1. A Java Spring Boot application with REST endpoints
2. MySQL/MariaDB database using XAMPP
3. Endpoints matching the API calls in our service files

## API Structure

The Java backend should implement these endpoints:

- `/api/users` - User management
- `/api/employees` - Employee data
- `/api/projects` - Project information
- `/api/ilbam` - ILBAM matrix data
- `/api/recommendations` - Team recommendations
- `/api/files` - File upload/processing

## Authentication

The backend should implement JWT-based authentication with:
- `/api/auth/login` - Login endpoint
- `/api/auth/logout` - Logout endpoint
- `/api/auth/me` - Current user information

