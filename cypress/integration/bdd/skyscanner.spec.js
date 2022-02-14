import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

Given('Navigate to skyscanner.ie', () => {
    cy.clearCookies()
    cy.visit('https://www.skyscanner.ie/')
    cy.get("#acceptCookieButton").click()
})

Given('Load roundtrip for {string} days from Dublin to Amsterdam', (noOfDays) => {
    cy.clearCookies()
    cy.visit("https://www.skyscanner.ie/transport/flights/dub/ams/" + getDate(0) + "/" + getDate(noOfDays) + "/?adults=2&adultsv2=2&cabinclass=economy&children=0&childrenv2=&destinationentityid=27536561&inboundaltsenabled=false&infants=0&originentityid=27540823&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1")
    cy.get("#acceptCookieButton").click()
})

When('Verify the search page loaded and Airline panle exists', () => {
    //cy.waitUntil(cy.get('div[class*=SummaryInfo_progressTextContainer]', { timeout: 10000 })
    //    .should('not.exist'))
    cy.get('#airlines_content').should('exist')
})

When('Search flights for {string} to {string}', (from, to) => {
    cy.get("#fsc-origin-search").type(from).debug()
    cy.wait(2000)
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date();
    var futureDate = new Date();
    futureDate.setDate(today.getDate() + 3)
    var futureString = futureDate.toLocaleDateString(undefined, options).toString();
    cy.wait(1000)
    cy.get('ul>li').then($el => {
        const elementCount = $el.length;
        for (let i = 0; i < elementCount; i++) {
            // cy.get('a[data-cy=submit]').eq(i).click();
            if (cy.contains(from)) {
                cy.contains(from).click();
                break;
            }
        }
    })
    cy.get("#fsc-destination-search").type(to)
    cy.wait(1000)
    cy.get('ul>li').then($el => {
        const elementCount = $el.length;
        for (let i = 0; i < elementCount; i++) {
            // cy.get('a[data-cy=submit]').eq(i).click();
            if (cy.contains(to)) {
                cy.contains(to).click();
                break;
            }
        }

    })

    And('Plan round trip for {string} days from today', (days) => {
        cy.get('#depart-fsc-datepicker-button').click()
        cy.get('button[class*="pkCalendarDate_bpk-calendar-date--today"]').click()
        cy.get('#return-fsc-datepicker-button').click()
        cy.log('FutureDate', futureString);
        cy.wait(1000)
        cy.get('button[aria-label*="' + futureString + '"]').click()

    })

    And('Choose {string} Adults for the trip', (noOfAdults) => {
        cy.get('#CabinClassTravellersSelector_fsc-class-travellers-trigger__OTYyM').click()
        cy.wait(1000)
        for (let i = 0; i < noOfAdults - 1; i++)
            cy.get('[title="Increase number of adults"]').click()
        cy.wait(1000)
        cy.get('.BpkLink_bpk-link__MzIwM').click()
        cy.wait(1000)
        cy.get('.BpkButtonBase_bpk-button__NTM4Y').click()
    })

    Then('Verify skyscanner challenge with me captcha', () => {
        cy.get('#px-captcha').should('be.visible')
    })


    Then('Verify first flight cost has no promotion else green option', () => {
        cy.get('button').contains('Show more results').click()
        cy.get('div[class*=FlightsResults_dayViewItems]>div').each($el => {
            const elementCount = $el.length;
            //for (let i = 0; i < elementCount; i++) {
                //console.log()
               // if (cy.get('div[class*=EcoTicketWrapper_itineraryContainer__]')) {
               var test = cy.get('.FlightsResults_dayViewItems TicketStub_horizontalStubContainer').first().invoke('text');
                var af=cy.get('div[class*=TicketStub_horizontalStubContainer]>span>div>div>span[class*=BpkText_bpk-text--lg]').invoke('text')
                cy.readFile('cypress/integration/testdata/priceVerification.json').its('fare').should('eq', test)
                /*
                    cy.get('div[class*=TicketStub_horizontalStubContainer]').
                    each(() => {
                    var actualFare = cy.get('span[class*=BpkText_bpk-text--lg]').invoke('text')
                    cy.readFile('cypress/integration/testdata/priceVerification.json').its('fare').should('eq', actualFare)
                    cy.get('div[class*=Price_mainPriceContainer]').should('not.have.value', '0.092')
                   // break;
                    })*/
                   return false
                //}
            }
        //}
        )
    })

    And('Extract and Display in logs for first {string} flights departure, airline and price',(noOfFlights)=> {
        var listOfObj = [];
        cy.get('div[class*=FlightsResults_dayViewItems]').then($el => {
            const elementCount = $el.length;
            for (let i = 0, j = 0; i < elementCount || j <= noOfFlights; i++) {
                if (cy.contains('div[class*=EcoTicketWrapper_]')) {
                    var dataObj = {};
                    dataObj['departureTime'] = cy.contains('span[class*=BpkText_bpk-text--xl').invoke('text');
                    dataObj['airline'] = cy.contains('span[class*=BpkText_bpk-text--xs').invoke('text');
                    dataObj['price'] = cy.contains('span[class*=BpkText_bpk-text--bold').invoke('text');
                    listOfObj.push(dataObj)
                    j++
                }
            }
    
        })
        listOfObj.forEach(data => {
            cy.log('DepartureTime : ', data.departureTime + 'AirLine : ', data.airline, + 'Price :', data.price);
        })
    })
})

function getDate(daysToAdd) {
    var today = new Date();
    today.setDate(today.getDate() + 1)
    var futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(daysToAdd))
    cy.log('FutureDate', futureDate.toString())
    cy.log('DayToadd', daysToAdd)
    var dd = String(futureDate.getDate()).padStart(2, '0');
    var mm = String(futureDate.getMonth() + 1).padStart(2, '0');
    var yy = String(futureDate.getFullYear()).slice(-2);

    futureDate = yy + mm + dd;
    return futureDate.toString();
}