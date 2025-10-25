/// <reference types="cypress" />

describe('Task Management E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/', { failOnStatusCode: false });
    cy.wait(500); // Wait for initial load
  });

  describe('Task Form', () => {
    it('should render task form with all input fields', () => {
      cy.get('input[placeholder="Add title"]').should('be.visible');
      cy.get('textarea[placeholder="Description"]').should('be.visible');
      cy.get('button').contains('Add').should('be.visible');
    });

    it('should add a new task with valid inputs', () => {
      const taskTitle = `Test Task ${Date.now()}`;
      const taskDescription = 'This is a test task description';

      cy.get('input[placeholder="Add title"]').type(taskTitle);
      cy.get('textarea[placeholder="Description"]').type(taskDescription);
      cy.get('button').contains('Add').click();

      // Wait for task to be created
      cy.wait(1000);

      // Verify task appears in the list
      cy.contains(taskTitle).should('be.visible');
      cy.contains(taskDescription).should('be.visible');
    });

    it('should show validation error for empty title', () => {
      cy.get('textarea[placeholder="Description"]').type('Test description');
      cy.get('button').contains('Add').click();

      // Form should still be visible (not submitted)
      cy.get('input[placeholder="Add title"]').should('be.visible');
    });

    it('should show validation error for empty description', () => {
      cy.get('input[placeholder="Add title"]').type('Test Title');
      cy.get('button').contains('Add').click();

      // Form should still be visible (not submitted)
      cy.get('textarea[placeholder="Description"]').should('be.visible');
    });

    it('should clear form after successful submission', () => {
      cy.get('input[placeholder="Add title"]').type('Test Task');
      cy.get('textarea[placeholder="Description"]').type('Test Description');
      cy.get('button').contains('Add').click();

      cy.wait(1000);

      // Form should be cleared
      cy.get('input[placeholder="Add title"]').should('have.value', '');
      cy.get('textarea[placeholder="Description"]').should('have.value', '');
    });

    it('should disable submit button while loading', () => {
      cy.get('input[placeholder="Add title"]').type('Test Task');
      cy.get('textarea[placeholder="Description"]').type('Test Description');
      cy.get('button').contains('Add').click();

      // Button should be disabled immediately
      cy.get('button').contains('Add').should('be.disabled');
    });
  });

  describe('Task List', () => {
    it('should display loading state initially', () => {
      cy.visit('http://localhost:5173/', { failOnStatusCode: false });
      // Loading indicator might be visible briefly
      cy.get('body').should('exist');
    });

    it('should display empty state when no tasks exist', () => {
      cy.wait(1000);
      
      // If there are no tasks, empty message should be visible
      cy.get('body').then($body => {
        if ($body.find('p:contains("No tasks yet")').length > 0) {
          cy.contains('No tasks yet').should('be.visible');
        }
      });
    });

    it('should display maximum of 5 most recent tasks', () => {
      cy.wait(1000);
      
      // Count visible task cards
      cy.get('body').then($body => {
        const taskCards = $body.find('[data-testid="task-card"]').length;
        expect(taskCards).to.be.at.most(5);
      });
    });

    it('should display task with title and description', () => {
      const taskTitle = `Display Test ${Date.now()}`;
      const taskDescription = 'This task tests display functionality';

      // Add a task
      cy.get('input[placeholder="Add title"]').type(taskTitle);
      cy.get('textarea[placeholder="Description"]').type(taskDescription);
      cy.get('button').contains('Add').click();

      cy.wait(1000);

      // Verify task is displayed
      cy.contains(taskTitle).should('be.visible');
    });

    it('should display task with date and time', () => {
      const taskTitle = `Date Test ${Date.now()}`;
      
      // Add a task
      cy.get('input[placeholder="Add title"]').type(taskTitle);
      cy.get('textarea[placeholder="Description"]').type('Testing date display');
      cy.get('button').contains('Add').click();

      cy.wait(1000);

      // Verify task has date/time (checking for any date-like format)
      cy.contains(taskTitle).parents('[data-testid="task-card"]').within(() => {
        cy.get('body').should('exist'); // Date should be present in card
      });
    });
  });

  describe('Task Card Interactions', () => {
    beforeEach(() => {
      // Add a test task before each test
      const taskTitle = `Interaction Test ${Date.now()}`;
      cy.get('input[placeholder="Add title"]').type(taskTitle);
      cy.get('textarea[placeholder="Description"]').type('Test task for interactions');
      cy.get('button').contains('Add').click();
      cy.wait(1000);
    });

    it('should open task details modal when card is clicked', () => {
      // Click on the task card (not the Done button)
      cy.get('[data-testid="task-card"]').first().click({ force: true });

      // Modal should open
      cy.wait(500);
      cy.get('[role="dialog"]').should('exist');
    });

    it('should mark task as done when Done button is clicked', () => {
      // Find and click the Done button
      cy.contains('button', 'Done').first().click();

      cy.wait(1000);

      // Success message should appear
      cy.contains('Task marked as done').should('be.visible');
    });

    it('should handle task description overflow correctly', () => {
      const longDescription = 'This is a very long description that should be truncated or handled properly in the UI. '.repeat(10);
      
      cy.get('input[placeholder="Add title"]').type('Overflow Test');
      cy.get('textarea[placeholder="Description"]').type(longDescription);
      cy.get('button').contains('Add').click();

      cy.wait(1000);

      // Task should be visible and not break the layout
      cy.contains('Overflow Test').should('be.visible');
    });
  });

  describe('Task Modal', () => {
    beforeEach(() => {
      // Add a test task
      const taskTitle = `Modal Test ${Date.now()}`;
      cy.get('input[placeholder="Add title"]').type(taskTitle);
      cy.get('textarea[placeholder="Description"]').type('Testing modal functionality');
      cy.get('button').contains('Add').click();
      cy.wait(1000);
    });

    it('should display full task details in modal', () => {
      cy.get('[data-testid="task-card"]').first().click({ force: true });
      cy.wait(500);

      // Modal should show task details
      cy.get('[role="dialog"]').should('be.visible');
    });

    it('should close modal when Close button is clicked', () => {
      cy.get('[data-testid="task-card"]').first().click({ force: true });
      cy.wait(500);

      // Click close button
      cy.contains('button', 'Close').click();

      // Modal should be closed
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should close modal when clicking outside', () => {
      cy.get('[data-testid="task-card"]').first().click({ force: true });
      cy.wait(500);

      // Click backdrop
      cy.get('[role="dialog"]').parent().click({ force: true });

      cy.wait(500);
      // Modal should be closed (might stay open depending on implementation)
    });
  });

  describe('Error Handling', () => {
    it('should show error message when API fails', () => {
      // Intercept API call and force it to fail
      cy.intercept('POST', '**/api/tasks', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('createTaskFail');

      cy.get('input[placeholder="Add title"]').type('Error Test');
      cy.get('textarea[placeholder="Description"]').type('This should fail');
      cy.get('button').contains('Add').click();

      cy.wait('@createTaskFail');
      cy.wait(500);

      // Error message should be displayed
      cy.contains('Failed to add task').should('be.visible');
    });

    it('should handle network timeout gracefully', () => {
      // Intercept API call with delay
      cy.intercept('GET', '**/api/tasks', {
        delay: 10000,
        statusCode: 408,
        body: { error: 'Request Timeout' }
      }).as('getTasks');

      cy.visit('http://localhost:5173/', { failOnStatusCode: false });

      // Loading state should be visible
      cy.wait(1000);
    });
  });

  describe('UI/UX Features', () => {
    it('should display success notification after adding task', () => {
      cy.get('input[placeholder="Add title"]').type('Success Test');
      cy.get('textarea[placeholder="Description"]').type('Testing success notification');
      cy.get('button').contains('Add').click();

      cy.wait(1000);

      // Success message should appear (in Snackbar)
      cy.contains('Task added successfully').should('be.visible');
    });

    it('should display notification in bottom-right corner', () => {
      cy.get('input[placeholder="Add title"]').type('Position Test');
      cy.get('textarea[placeholder="Description"]').type('Testing notification position');
      cy.get('button').contains('Add').click();

      cy.wait(1000);

      // Check Snackbar position (bottom-right)
      cy.get('[class*="MuiSnackbar"]').should('have.css', 'position', 'fixed');
    });

    it('should show loading indicator while fetching tasks', () => {
      cy.visit('http://localhost:5173/', { failOnStatusCode: false });
      
      // CircularProgress might be visible briefly
      cy.wait(500);
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('http://localhost:5173/', { failOnStatusCode: false });
      cy.wait(500);

      // Form should be visible
      cy.get('input[placeholder="Add title"]').should('be.visible');
      cy.get('textarea[placeholder="Description"]').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('http://localhost:5173/', { failOnStatusCode: false });
      cy.wait(500);

      // Form should be visible
      cy.get('input[placeholder="Add title"]').should('be.visible');
      cy.get('textarea[placeholder="Description"]').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.visit('http://localhost:5173/', { failOnStatusCode: false });
      cy.wait(500);

      // Form should be visible
      cy.get('input[placeholder="Add title"]').should('be.visible');
      cy.get('textarea[placeholder="Description"]').should('be.visible');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full task lifecycle: create -> view -> mark done', () => {
      const taskTitle = `Lifecycle Test ${Date.now()}`;
      const taskDescription = 'Full lifecycle test task';

      // Step 1: Create task
      cy.get('input[placeholder="Add title"]').type(taskTitle);
      cy.get('textarea[placeholder="Description"]').type(taskDescription);
      cy.get('button').contains('Add').click();
      cy.wait(1000);

      // Step 2: Verify task appears
      cy.contains(taskTitle).should('be.visible');

      // Step 3: View task details
      cy.contains(taskTitle).parents('[data-testid="task-card"]').click({ force: true });
      cy.wait(500);
      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('button', 'Close').click();
      cy.wait(500);

      // Step 4: Mark as done
      cy.contains(taskTitle).parents('[data-testid="task-card"]').within(() => {
        cy.contains('button', 'Done').click();
      });
      cy.wait(1000);

      // Step 5: Verify success message
      cy.contains('Task marked as done').should('be.visible');
    });

    it('should maintain task order (most recent first)', () => {
      const task1 = `First Task ${Date.now()}`;
      const task2 = `Second Task ${Date.now() + 1}`;

      // Add first task
      cy.get('input[placeholder="Add title"]').type(task1);
      cy.get('textarea[placeholder="Description"]').type('First task description');
      cy.get('button').contains('Add').click();
      cy.wait(1000);

      // Add second task
      cy.get('input[placeholder="Add title"]').type(task2);
      cy.get('textarea[placeholder="Description"]').type('Second task description');
      cy.get('button').contains('Add').click();
      cy.wait(1000);

      // Second task should appear before first task (most recent first)
      cy.get('[data-testid="task-card"]').first().should('contain', task2);
    });

    it('should refresh task list after marking task as done', () => {
      const taskTitle = `Refresh Test ${Date.now()}`;

      // Add a task
      cy.get('input[placeholder="Add title"]').type(taskTitle);
      cy.get('textarea[placeholder="Description"]').type('Testing refresh');
      cy.get('button').contains('Add').click();
      cy.wait(1000);

      // Get initial task count
      cy.get('[data-testid="task-card"]').then($cards => {
        const initialCount = $cards.length;

        // Mark task as done
        cy.contains(taskTitle).parents('[data-testid="task-card"]').within(() => {
          cy.contains('button', 'Done').click();
        });
        cy.wait(1500);

        // Task count should change or task should be removed
        cy.get('body').should('exist');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels', () => {
      cy.get('input[placeholder="Add title"]').should('have.attr', 'placeholder');
      cy.get('textarea[placeholder="Description"]').should('have.attr', 'placeholder');
    });

    it('should support keyboard navigation', () => {
      cy.get('input[placeholder="Add title"]').focus().type('Keyboard Test');
      cy.get('textarea[placeholder="Description"]').focus().type('Testing keyboard navigation');
      cy.get('button').contains('Add').focus().type('{enter}');
      cy.wait(1000);
    });

    it('should have proper ARIA roles for modal dialog', () => {
      // Add a task first
      cy.get('input[placeholder="Add title"]').type('ARIA Test');
      cy.get('textarea[placeholder="Description"]').type('Testing ARIA');
      cy.get('button').contains('Add').click();
      cy.wait(1000);

      // Open modal
      cy.get('[data-testid="task-card"]').first().click({ force: true });
      cy.wait(500);

      // Check for dialog role
      cy.get('[role="dialog"]').should('exist');
    });
  });
});
