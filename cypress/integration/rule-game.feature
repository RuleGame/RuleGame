Feature: Basics
  Scenario: Clockwise rule
    Given game is counter
    When I drag red-square-36 to 0
    And I drag yellow-square-1 to 1
    And I drag red-square-6 to 2
    And I drag blue-circle-31 to 3
    Then display is cleared
