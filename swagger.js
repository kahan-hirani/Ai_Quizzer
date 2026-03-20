const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Quizzer API",
      version: "1.0.0",
      description: "Backend API documentation for AI Quizzer",
    },
    servers: [
      {
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/v1`
          : "http://localhost:5000/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "routes", "*.js")],
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  const docsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI Quizzer API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    html, body { margin: 0; padding: 0; }
    body { background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.addEventListener("load", function () {
      SwaggerUIBundle({
        url: "/api-docs.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
    });
  </script>
</body>
</html>`;

  app.get("/api-docs", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(docsHtml);
  });

  app.get("/api-docs/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(docsHtml);
  });

  app.get("/api-docs/swagger-ui-bundle.js", (req, res) => {
    res.redirect(302, "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js");
  });

  app.get("/api-docs/swagger-ui-standalone-preset.js", (req, res) => {
    res.redirect(302, "https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js");
  });

  app.get("/api-docs/swagger-ui.css", (req, res) => {
    res.redirect(302, "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css");
  });

  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api-docs`
    : "http://localhost:5000/api-docs";

  console.log(`Swagger Docs available at: ${url}`);
}

module.exports = swaggerDocs;
