import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestMovieTicketBooking(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()  # Ensure ChromeDriver is installed and in PATH
        self.driver.get('http://localhost:8000/login.html')  # Adjust URL as needed

    def test_login(self):
        driver = self.driver
        username = driver.find_element(By.ID, 'username')
        password = driver.find_element(By.ID, 'password')
        login_button = driver.find_element(By.XPATH, '//button[text()="Login"]')

        username.send_keys('testuser@example.com')  # Use a valid username
        password.send_keys('password123')  # Use a valid password
        login_button.click()
        time.sleep(2)  # Wait for the page to load

        # Handle any unexpected alerts
        try:
            alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
            alert.accept()  # Accept the alert
        except:
            pass  # No alert to handle

        # Check for successful login by verifying the presence of the wallet balance
        wallet_balance = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'wallet-balance')))
        self.assertIn('Wallet:', wallet_balance.text)

    def test_full_booking_process(self):
        driver = self.driver
        driver.get('http://localhost:8000/index.html')  # Navigate to the movie selection page
        time.sleep(2)  # Wait for the page to load

        # Select a movie and book a ticket
        movie_button = driver.find_element(By.XPATH, '//button[text()="Select Seat"]')
        movie_button.click()
        time.sleep(2)  # Wait for the seat selection page

        # Assume the first seat is available and select it
        first_seat = driver.find_element(By.XPATH, '//div[@class="seat available"][1]')
        first_seat.click()

        # Click on the wallet payment button
        wallet_payment_button = driver.find_element(By.ID, 'walletButton')
        wallet_payment_button.click()
        time.sleep(2)  # Wait for the confirmation

        # Check for the confirmation message
        confirmation_message = driver.find_element(By.ID, 'confirmationMessage')
        self.assertTrue(confirmation_message.is_displayed())

        # Click the Generate Ticket button
        generate_ticket_button = driver.find_element(By.ID, 'generateTicket')
        generate_ticket_button.click()
        time.sleep(2)  # Wait for the ticket to be generated

        # Check for the ticket information
        ticket_info = driver.switch_to.alert
        self.assertIn('--- Ticket ---', ticket_info.text)
        ticket_info.accept()  # Close the ticket alert

    def test_login_and_select_date(self):
        driver = self.driver
        driver.get('http://localhost:8000/login.html')  # Navigate to the login page
        time.sleep(2)  # Wait for the page to load

        # Perform login
        username = driver.find_element(By.ID, 'username')
        password = driver.find_element(By.ID, 'password')
        login_button = driver.find_element(By.XPATH, '//button[text()="Login"]')

        username.send_keys('testuser@example.com')  # Use a valid username
        password.send_keys('password123')  # Use a valid password
        login_button.click()
        time.sleep(2)  # Wait for the page to load

        # Navigate to the movie selection page
        driver.get('http://localhost:8000/index.html')  # Adjust URL as needed
        time.sleep(2)  # Wait for the page to load

        # Select a date
        date_picker = driver.find_element(By.ID, 'datePicker')  # Adjust ID as necessary
        date_picker.click()
        time.sleep(1)
        date_to_select = driver.find_element(By.XPATH, '//option[@value="2025-03-20"]')  # Adjust value as necessary
        date_to_select.click()

        # Click on the select seat button
        select_seat_button = driver.find_element(By.XPATH, '//button[text()="Select Seat"]')
        select_seat_button.click()
        time.sleep(2)  # Wait for the seat selection page

        # After selecting the seat, confirm the selection and use the wallet to pay
        # Click on the confirm seats button
        confirm_seat_button = driver.find_element(By.XPATH, '//button[text()="Confirm Seats"]')
        confirm_seat_button.click()
        time.sleep(2)  # Wait for confirmation to process

        # Use wallet to pay
        use_wallet_button = driver.find_element(By.ID, 'walletButton')  # Adjust ID as necessary
        use_wallet_button.click()
        time.sleep(2)  # Wait for the payment to process

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()
