document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Logged in successfully!');
            window.location.href = 'index.html';
        });
    }

    // Movie selection
    const movieOptions = document.querySelectorAll('.movie');
    movieOptions.forEach(movie => {
        movie.addEventListener('click', function() {
            const selectedPrice = this.getAttribute('data-price');
            const availableTimes = this.getAttribute('data-times').split(', ');
            document.getElementById('timingOptions').innerHTML = availableTimes.map(time => `<div class='timing'>${time}</div>`).join('');
            alert(`Selected Movie: ${this.textContent}, Price: $${selectedPrice}`);
        });
    });

    // Movie and timings selection
    const proceedToSeatsButton = document.getElementById('proceedToSeats');
    if (proceedToSeatsButton) {
        proceedToSeatsButton.addEventListener('click', function() {
            const selectedTiming = document.querySelector('.timing.selected');
            if (!selectedTiming) {
                alert('Please select a timing.');
                return;
            }
            window.location.href = 'seating.html';  // Redirect to seating page
        });
    }

    // Select seat buttons
    const selectSeatButtons = document.querySelectorAll('.selectSeat');
    selectSeatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const movieDiv = this.parentElement;
            const selectedMovie = movieDiv.querySelector('h3').textContent;
            const selectedPrice = movieDiv.getAttribute('data-price');
            const selectedTiming = movieDiv.querySelector('.timing-dropdown').value;
            const numberOfSeats = prompt('How many seats would you like to book?');

            if (numberOfSeats && !isNaN(numberOfSeats) && numberOfSeats > 0) {
                alert(`Selected Movie: ${selectedMovie}, Price: $${selectedPrice}, Timing: ${selectedTiming}, Seats: ${numberOfSeats}`);
                // Redirect to seating page with selected movie, timing, and number of seats
                window.location.href = `seating.html?movie=${encodeURIComponent(selectedMovie)}&timing=${encodeURIComponent(selectedTiming)}&seats=${numberOfSeats}`;
            } else {
                alert('Please enter a valid number of seats.');
            }
        });
    });

    // Generate seating chart
    const seatingChart = document.getElementById('seatingChart');
    if (seatingChart) {
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            for (let j = 0; j < 10; j++) {
                const seat = document.createElement('button');
                seat.textContent = `Seat ${i * 10 + j + 1}`;
                seat.className = 'seat';
                seat.addEventListener('click', function() {
                    seat.classList.toggle('selected');
                });
                row.appendChild(seat);
            }
            seatingChart.appendChild(row);
        }
    }

    // Payment simulation
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', function() {
            const selectedSeats = document.querySelectorAll('.selected');
            const ticketPrice = 10;
            const totalCost = selectedSeats.length * ticketPrice;
            const walletBalanceElement = document.getElementById('walletBalance');
            let walletBalance = parseInt(walletBalanceElement.textContent.replace('Balance: $', ''));

            if (totalCost > walletBalance) {
                alert('Insufficient balance!');
            } else {
                walletBalance -= totalCost;
                walletBalanceElement.textContent = `Balance: $${walletBalance}`;
                alert('Booking successful!');
                selectedSeats.forEach(seat => seat.classList.remove('selected'));
            }
        });
    }
});
