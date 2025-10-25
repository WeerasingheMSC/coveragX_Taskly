/// <reference types="cypress" />

describe("MainScreen E2E Tests", () => {
  beforeEach(() => {
    // Visit the MainScreen page
    cy.visit("http://localhost:5173/", { failOnStatusCode: false });
  });

  it("renders the task form with input fields", () => {
    cy.get('input[placeholder="Add title"]').should("be.visible");
    cy.get('textarea[placeholder="Description"]').should("be.visible");
    cy.get("button").contains("Add").should("be.visible");
  });

  it("shows validation errors when submitting an empty form", () => {
    cy.get("button").contains("Add").click();
    cy.get('input[placeholder="Add title"]').should("contain", "");
    cy.get('textarea[placeholder="Description"]').should("contain", "");
  });

  it("adds a new task successfully", () => {
    cy.get('input[placeholder="Add title"]').type("Test Task");
    cy.get('textarea[placeholder="Description"]').type("This is a test description.");
    cy.get("button").contains("Add").click();

    // Wait for task to appear
    cy.wait(1000);
    
    // Verify task appears in the list
    cy.contains("Test Task").should("be.visible");
  });
});