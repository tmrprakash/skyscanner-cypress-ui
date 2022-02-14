Feature: Iternary planning in skyscanner.ie

    Scenario Outline: Search flight should challenge me captcha 
        Given Navigate to skyscanner.ie
        When Search flights for '<from>' to '<to>'
        And Plan round trip for '3' days from today
        And Choose '2' Adults for the trip
        Then Verify the search page loaded and Airline panel exists
        And Verify first flight cost has no promotion else green option
        And Extract and Display in logs for first '3' flights departure, airline and price
        Examples:
            | from | to |
            | Dublin | Amsterdam |

    #Scenario Outline: Test Runner Debugger Search and display the first 3 flights details with price, departuretime and price 
     #   Given Load roundtrip for '<days>' days from Dublin to Amsterdam
      #  When Verify the search page loaded and Airline panle exists
       # Then Verify first flight cost has no promotion else green option
        #And Extract and Display in logs for first '3' flights departure, airline and price
        #Examples:
        #|days|
        #|3|