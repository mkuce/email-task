import { faker } from "@faker-js/faker";
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

before(() => {
  cy.intercept("/ws/v3/batch?name=messages.saveAndSend*").as("send");
});

const profile = {
  username: Cypress.env("username"),
  password: Cypress.env("password"),
  name: "Michala Kucerova",
};
const content = {
  subject: faker.lorem.word(),
  message: faker.lorem.paragraph(),
};

Given("i navigate to baseUrl", () => {
  cy.visit("/");
});

When("i fill in the login credentials", () => {
  cy.get("input#login-username").should("be.visible").type(profile.username);
  cy.get("input#login-signin").should("be.visible").click();
  cy.get("input#login-passwd", {timeout:60000}).should("be.visible").type(profile.password);
  cy.get("button#login-signin").should("be.visible").click();
});

Then("i will be redirected to my email dashboard", () => {
  cy.url().should("contain", "mail.yahoo.com/d/folders");
});

When("i click the compose button on the dashboard", () => {
  cy.get('[data-test-id="compose-button"]').should("be.visible").click();
});

Then("i will be redirected to the correct url", () => {
  cy.url().should("contain", "mail.yahoo.com/d/compose");
});

Given("the compose form to create email exists on the page", () => {
  cy.get('[data-test-id="compose"]').should("exist");
});

When("i click on the button to add a recipient", () => {
  cy.get('[data-test-id="recipient-input"]')
    .find("button")
    .should("be.visible")
    .click();
});

Then("modal is open", () => {
  cy.get('[data-test-id="modal-content"]').should("be.visible");
});

Given("a recipient is visible in the modal", () => {
  cy.get('[data-test-id="contact-item"]').within(() => {
    cy.contains(profile.username)
      .should("have.text", `${profile.username}@yahoo.com`)
      .should("be.visible");
  });
});

When("i add the recipient and click done button", () => {
  cy.get('[data-test-id="contact-item"]').within(() => {
    cy.get('[data-test-id="checkbox"]').should("be.visible").click();
  });

  cy.get('[data-test-id="done"]')
    .should("be.enabled")
    .should("be.visible")
    .click();
});

Then(
  "modal should be closed and recipient should be visible in the correct field",
  () => {
    cy.get('[data-test-id="modal-content"]').should("not.exist");
    cy.get('[data-test-id="compose"]')
      .should("exist")
      .within(() => {
        cy.get('[data-test-id="recipient-input"]')
          .find('[data-test-id="pill-text"]')
          .should("have.text", profile.name)
          .should("be.visible");
      });
  }
);

Given("the email compose form", () => {
  cy.get('[data-test-id="compose"]').should("be.visible");
});

When("i fill in subject, content and attach a file", () => {
  cy.get('[data-test-id="compose"]').within(() => {
    cy.get('[data-test-id="compose-subject"]')
      .should("be.visible")
      .type(content.subject);

    cy.get('[data-test-id="rte"]')
      .should("be.visible")
      .type(content.message, { delay: 0 });

    cy.fixture("pepe.jpg", { encoding: null }).as("attachment");
    cy.get('input[type="file"]')
      .should("exist")
      .selectFile("@attachment", { force: true });
  });
});

Then("i can see that the file is attached", () => {
  cy.get('[data-test-id="attachment-item"]').should("be.visible");
});

When("i click the button to send the email", () => {
  cy.get('[data-test-id="compose-send-button"]').should("be.visible").click();
});

Then("email is sent", () => {
  cy.wait("@send").its("response.statusCode").should("eq", 200);
});

Then(
  "i am redirected to email dashboard and i see pop-up notification that the email was sent",
  () => {
    cy.url().should("contain", "mail.yahoo.com/d/folders");
  }
);

When("i close the notification and click on the link to be logged out", () => {
  cy.get('[data-test-id="notifications"]')
    .should("be.visible")
    .find("button")
    .click();
  cy.get("#profile-signout-link").should("exist").click({ force: true });
});

Then(
  "i am redirected to yahoo.com and i see that Sign-in label is visible on the page",
  () => {
    cy.url().should("eq", "https://www.yahoo.com/");
    cy.contains("Sign in").should("be.visible");
  }
);
