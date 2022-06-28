<div align="center">

  <img src="https://nestjs.com/img/logo-small.svg" alt="Logo" width="100">
  
  <h3 align="center">
     Mock Realtor App
  </h3>
    <br />
  
  <div align="center">

   ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?logo=nestjs&logoColor=white&style=for-the-badge)
   ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
   ![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
   ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

  </div>
  
  <h5>Developed alongside <a href="https://www.udemy.com/course/the-nest-js-bootcamp-complete-developer-guide" target="_blank">this udemy course</a></h5>
  
</div>

## What I Learned
  
  - The basics of Prisma
  - Role based authorization
  - More about NestJS `Execution Context`, Reflection and metadata
  - Custom route handler decorators and `createParamDecorator`
  - NestJS `Interceptors` and the basics of [RxJS](https://rxjs.dev/) `Observables`
  - Unit tests in NestJS and more advanced Jest mocking
   
## Routes

  - [X] **POST** `/auth/signup/:userType`
  - [X] **POST** `/auth/signin`
  - [X] **POST** `/auth/key`
  - [X] **GET** `/auth/me`
  
  - [X] **GET** `/home`
  - [X] **GET** `/home/:id`
  - [X] **POST** `/home`
  - [X] **PUT** `/home/:id`
  - [X] **DELETE** `/home/:id`
  - [X] **POST** `/home/:id/inquire`
  - [X] **GET** `/home/:id/messages`
