'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Update the HTML DOM
const dateFormate = (now, locale) => {
  const calcDate = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const passedDate = calcDate(new Date(), now);
  if (passedDate === 0) return 'Today';
  if (passedDate === 1) return 'Yesterday';
  if (passedDate <= 7) return `${passedDate} days ago`;

  return new Intl.DateTimeFormat(locale).format(now);
};

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    // Get date
    let now = new Date(acc.movementsDates[i]);
    let displayDate = dateFormate(now, acc.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${mov.toFixed(2)}€</div>
          </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Dispaly the total amount
const calcDispalyBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

// Update the user UI
const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outgoing.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// Create username with first letters in the names
const createUserName = accs => {
  accs.forEach(acc => {
    acc['username'] = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};
createUserName(accounts);

// Update the UI
const updateUI = acc => {
  displayMovements(acc);
  calcDispalyBalance(acc);
  calcDisplaySummary(acc);
};

// LOGIN EVENT
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Current date
    let currentDate = new Date();
    let option = {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(currentDate);
    // Update UI
    updateUI(currentAccount);
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
  } else {
    labelWelcome.textContent = `Log in to get started`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 0;
  }
});

// TRANSFER EVENT
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  // Get the user input amount value
  const amount = +inputTransferAmount.value;

  // Find the account object that holds userinput value username
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Reset the user input
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  // Check the validation
  if (
    transferTo &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    transferTo?.username !== currentAccount.value
  ) {
    // Push to movement array
    currentAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);

    // Show little delay in updating UI
    setTimeout(() => {
      updateUI(currentAccount);
    }, 1000);
  }
});
// LOAN
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  const isValid = currentAccount.movements.some(acc => acc >= amount / 10);
  console.log(isValid);
  if (amount > 0 && isValid) {
    currentAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(amount);

    setTimeout(() => {
      updateUI(currentAccount);
    }, 2000);
  }
  inputLoanAmount.value = '';
});

// DELETE
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    +inputClosePin.value === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    containerApp.style.opacity = 0;
    accounts.splice(index, 1);
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  // if (!sorted) {
  //   displayMovements(currentAccount.movements, true);
  //   sorted = true;
  // } else {
  //   displayMovements(currentAccount.movements, false);
  //   sorted = false;
  // }
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposit = movements.filter(mov => mov > 0);
const withdrawal = movements.filter(mov => mov < 0);
const balance = movements.reduce((acc, cur) => acc + cur, 0);
/////////////////////////////////////////////////
