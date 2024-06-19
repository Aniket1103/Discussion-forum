# Discussion Forum Microservices Architecture

## Overview
This project is a discussion forum application built using a microservices architecture. The application consists of three primary microservices:

1. **API Gateway Service**
2. **Discussion Service**
3. **User Service**

The API Gateway serves as the entry point for all client requests, forwarding them to the appropriate service and using in-memory caching to enhance performance.

## Microservices Description

### API Gateway Service
- **Responsibilities**:
  - Forwarding requests to the appropriate microservice.
  - Performing authentication, rate limiting, and logging.
  - Caching frequently accessed data to minimize network calls.

### Discussion Service
- **Endpoints**:
  - `POST /discussion/create` - Create a new discussion post.
  - `PUT /discussions/update` - Update an existing discussion post.
  - `DELETE /discussions/:discussionId` - Delete a discussion post.
  - `GET /discussion/search` - Search discussion posts with provided searchText and/or Hash Tags.
  - `POST /discussions/like` - Like a discussion post or a Comment/Reply.
  - `POST /comment/create` - Add a comment.
  - `PATCH /comment/update` - Update a comment.
  - `DELETE /comment/delete` - Delete a comment.

### User Service
- **Endpoints**:
  - `POST /user/register` - Register a new user.
  - `POST /user/login` - Log in a user.
  - `POST /user/logout` - Log out a user.
  - `GET /user/current` - Get the current logged-in user's information.
  - `PATCH /user/update` - Update user information.
  - `DELETE /user/delete` - Delete the user.
  - `GET /user/getAll` - Retrieve a list of all users.
  - `POST /user/follow` - Follow a user.
  - `POST /user/unfollow` - Unfollow a user.

### [Microservices breakdown in detail](https://docs.google.com/document/d/1H0TBKHmwAIKV9BroJmbeaypXvGs9j0Q6Ig4Ttrrtrzo/edit?usp=sharing)

## Project Setup

### System Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aniket1103/Discussion-forum.git
   cd Discussion-forum
   ```

2. Install dependencies and start each service:

   - **API Gateway**:
     ```bash
     cd api-gateway
     npm install
     npm run dev
     ```

   - **Discussion Service**:
     ```bash
     cd ../discussion
     npm install
     npm run dev
     ```

   - **User Service**:
     ```bash
     cd ../user
     npm install
     npm run dev
     ```

### Configuration
Each microservice has its own configuration file located in its respective directory. You can customize settings such as database connections, cache settings, and service ports in these files.


### Postman Collection
All the endpoints are documented and can be tested using the following Postman collection:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/35074361-4c953796-5ef5-4a1e-aedc-6235d6a855ca?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D35074361-4c953796-5ef5-4a1e-aedc-6235d6a855ca%26entityType%3Dcollection%26workspaceId%3D7a6d1bf3-2019-440f-b2ba-7b1810120b86)

### API Documentation
Once the above Postman collection is forked. You can check this [API Documentation](https://go.postman.co/navigation-architect-69366200/workspace/public-workspace/documentation/35074361-4c953796-5ef5-4a1e-aedc-6235d6a855ca?entity=folder-c89286fd-a014-49e1-b3d7-b8b5b30fd99f)


### Deployment

The application is already deployed on Render.

---
