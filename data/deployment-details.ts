/** Workflow descriptions, not a live terminal or claims about automated checks. */
export const deploymentDetails: Record<string, { outcome: string; checks: readonly string[] }> = {
  plan: { outcome: "A scoped change, ready to implement.", checks: ["Agree on API contracts and the affected user flows", "Identify dependencies, environment needs, and data changes", "Create a focused branch with a reviewable scope"] },
  code: { outcome: "Connected features with predictable behavior.", checks: ["Implement business rules, validation, and error responses", "Keep types aligned between APIs and the interface", "Handle authentication and loading or failure states"] },
  build: { outcome: "A reproducible production artifact.", checks: ["Install dependencies from the committed lockfile", "Build the application in production mode", "Review required environment variables and assets"] },
  test: { outcome: "Critical flows checked before release.", checks: ["Exercise endpoints and permissions with Postman", "Run lint and review the implementation changes", "Check essential website journeys and error handling"] },
  release: { outcome: "A versioned release with a recovery path.", checks: ["Document what changed and which configuration is needed", "Keep credentials outside the source repository", "Retain the previous release for a practical rollback"] },
  deploy: { outcome: "The application running in its target environment.", checks: ["Publish frontend builds to Vercel or a web server", "Run backend services with PM2 on a Linux VPS", "Verify the deployed website and API endpoints"] },
  operate: { outcome: "A properly configured production entry point.", checks: ["Route traffic through an Nginx reverse proxy", "Connect domain DNS and configure HTTPS", "Validate server configuration and process startup"] },
  monitor: { outcome: "A release that can be observed and maintained.", checks: ["Inspect process status and application logs", "Verify health endpoints and production responses", "Investigate failures and maintain the running services"] },
};
