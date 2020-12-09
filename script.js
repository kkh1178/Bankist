"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: "Sarah Smith",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Use containerMovements.innerHTML to add a new movements row for each of the account movements
const displayMovements = function (movements) {
    // Removing any rows?
    containerMovements.innerHTML = "";

    movements.forEach(function (move, index) {
        const type = move > 0 ? "deposit" : "withdrawal";
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
            index + 1
        } ${type}</div>
            <div class="movements__value">${move}€</div>
        </div>
    `;
        //
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

// Create a function that will add a user name to each account holder
const createUserNames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = userName(acc.owner);
    });
};
// Function that will create a user name based on a person's initials
const userName = function (user) {
    const username = user
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
    return username;
};

createUserNames(accounts);

// create a function that will return the balance and display it on balance__value
const calcBalance = function (account) {
    account.balance = account.movements.reduce(
        (sum, transaction) => sum + transaction,
        0
    );
    labelBalance.textContent = `${account.balance}€`;
    // console.log(balance);
};
// Can also be written as below:
// const balance = movements.reduce(function (sum, current, i) {
//     console.log(`Iteration ${i}: ${sum}`);
//     return sum + current;
// }, 0);

// console.log(balance);

// Create a function that will calulate the value of all of summaries and display them on the bottom of the page
const calcDisplaySummary = function (account) {
    console.log(account);
    // calculate the sum of deposits
    const incomes = account.movements
        .filter((money) => money > 0)
        .reduce((sum, deposit) => sum + deposit, 0);
    // console.log(`Deposited ${incomes}€`);

    // calculate the sum of withdraws
    const withdraws = account.movements
        .filter((money) => money < 0)
        .reduce((sum, withdraw) => sum + withdraw, 0);
    // console.log(withdraws);

    // Calculate a fake interest rate
    const interest = account.movements
        .filter((mov) => mov > 0)
        .map((deposit) => (deposit * account.interestRate) / 100)
        .filter((int, i, arr) => {
            // console.log(arr);
            return int >= 1;
        })
        .reduce((sum, number) => sum + number, 0);
    // Add the information to the dom
    labelSumIn.textContent = `${incomes}€`;
    labelSumOut.textContent = `${Math.abs(withdraws)}€`;
    labelSumInterest.textContent = `${interest}€`;
};

// Create an event handler that will take the login inputs outside of the function
let currentAccount;

btnLogin.addEventListener("click", function (e) {
    // Prevent form from submitting
    e.preventDefault();
    // Find the user account info
    currentAccount = accounts.find(
        (acc) => acc.username === inputLoginUsername.value
    );
    // ? optional chaining and is to check if the current account exists or not
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        console.log("LOGIN");
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(" ")[0]
        }`;
        containerApp.style.opacity = 100;
        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();
        // Update the account
        updateUI(currentAccount);
    }
});

const updateUI = function (account) {
    // Display movements
    displayMovements(account.movements);
    // Display summary
    calcBalance(account);
    // Display summary
    calcDisplaySummary(account);
};

// Transfer money to a different user
btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();

    // Find the correct user and the amount to transfer
    const amount = Number(inputTransferAmount.value);
    const recipientAccount = accounts.find(
        (acc) => acc.username === inputTransferTo.value
    );
    // Reset the input area to be blank
    inputTransferAmount.value = inputTransferTo.value = "";

    console.log(amount, recipientAccount);

    // Withdraw the appropriate amount from the users account when all of the conditions are met
    if (
        amount > 0 &&
        currentAccount.balance >= amount &&
        recipientAccount?.username !== currentAccount.username &&
        recipientAccount
    ) {
        // Transfer the money
        console.log("Begin Transfer");
        currentAccount.movements.push(-amount);
        recipientAccount.movements.push(amount);

        // Update the current user's account info that is displayed on the screen
    }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// // Practicing

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // calcDisplaySummary(account1.movements);

// // Create a method that will return deposits in an account
// const deposits = movements.filter(function (move) {
//     return move > 0;
// });

// // Same for withdraws
// const withdraws = movements.filter((move) => move < 0);

// // Maximum value
// const max = movements.reduce((acc, money) => {
//     if (acc > money) return acc;
//     else return money;
// }, movements[0]);

// // Using the find method
// const firstWithdraw = movements.find((move) => move < 0);

// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// // console.log(account);
