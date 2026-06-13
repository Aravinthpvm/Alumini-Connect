FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/alumni-portal-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]