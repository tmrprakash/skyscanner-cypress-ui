
# Cypress E2E Test for skyscanner.ie
## About the Application
- Skyscanner is a metasearch engine and travel agency based in Edinburgh, Scotland.The site is available in over 30 languages and is used by 100 million people per month. The company lets people research and book travel options for their trips, including flights, hotels and car hire

## About the Framework
- E2E tests Framework written in [cypress](https://docs.cypress.io/guides/overview/why-cypress).
- Automation Approach [BDD](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)
- Language: Javascript ES6

## Automation Scope
 - Plan roundtrip iternary in https://www.skyscanner.ie/

## Automated Functionality 
* Plan Iternary 
    * Plan iternary with parametrised source and orginated city
    * Round trip for parametrized no of days from today
    * Paremtreised number of Adults
* Verify search list of flight details
    * Wait for the search page to complete
    * Assert the price of the flight[excluding promotion & green] from a file [Need to verify]
    * Assert wrong expected value for the flight price 
    * Verify the left panel 'airline' options
    * Gather the first 3 airline, fare & details and display in log [Need to verified]

# Setup and Execution
1. Pre-requisite
   ```
   node version 6.14.8 and above
   ```
2. Environment Setup
    ```
    $ git clone https://github.com/tmrprakash/craiglist-ui.git
    $ cd skyscanner-ui
    $ npm install
    ```
3. Test Development and Debugging
    - Test Runner from cypress , helps to locate an element and debugg the failures
    ```
        npm run cypress:open
    ```
    - Feature files are detected from the cypress-cucumber-preprocessor config in package.json
   
4. Execute Test
    
    ```
        Browser   | CLI
        --------- | ----------------------
        Chrome    | $ npm run test:chrome
        Firefox   | $ npm run test:firefox
        Headless  | $ npm run test:headless
    ```
5. Reports
    - Test Reports are available in
    ```
    ./cypress/report/index.html
    ```

# Folder Structure
    A typical top-level directory layout
    .
    ├── report                       # Store generated reports, after the test cypress
    cypress
    ├── integration/bdd              # Entry point for E2E Test 
    ├── screenshots/bdd              # Store screenshot files for failed tests
    ├── plugin                       # Entry point for E2E Test
    ├── videos/bdd                   # Recorded videos for the test
    └── support                      # Test Execution Configuration
    └── package.json                 # Entry point for the package
    └── README.md                    # Documentation
    └── report.js                    # Report generator supporting files
    └── cypress.json                 # Cypress Execution config


# Challenges and Workaround
Skyscanner has BOT intelligence engine,which detects our automation exectuion as threat.Below are few work around , which may need to during the execution
* Captcha Challenge
    - Skyscanner detects the cypress runner as robot, every 3- 5 runs challenged the captcha
        * Have to clear the cookies for skyscanner site and restart the exectuion
        * Added Keystroke time for 500 ms in support/index.js
        ```
          Cypress.Keyboard.defaults({keystrokeDelay: 500})
        ```
        * Added explicit wait for every useraction in the home page
 * Test runner: Search Flight redirects to captcha for every exectuion
    - As workaround , constructed the dynamic URL with date to hit the search scenario to debgug on test runner.
    - Commented this BDD test for reference
 * CLI Execution
    - Running with CLI interface also has the bot detection 
        * Tried to clearing cookies didn't worked. Need investigation
