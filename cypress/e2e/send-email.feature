Feature: Send email

    Scenario: Send an email with an attachment to a saved recipient

    Given i navigate to baseUrl
    When i fill in the login credentials
    Then i will be redirected to my email dashboard

    When i click the compose button on the dashboard
    Then i will be redirected to the correct url 

    Given the compose form to create email exists on the page
    When i click on the button to add a recipient
    Then modal is open

    Given a recipient is visible in the modal
    When i add the recipient and click done button
    Then modal should be closed and recipient should be visible in the correct field

    Given the email compose form
    When i fill in subject, content and attach a file
    Then i can see that the file is attached
    When i click the button to send the email
    Then email is sent
    Then i am redirected to email dashboard and i see pop-up notification that the email was sent
    When i close the notification and click on the link to be logged out
    Then i am redirected to yahoo.com and i see that Sign-in label is visible on the page