'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div        class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div> 
    <div class="movements__value">${mov}€
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, mov) => accu + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outAmount = acc.movements
    .filter(mov => mov < 0)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumOut.textContent = `${Math.abs(outAmount)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((interest, i, arr) => {
      // console.log(arr);
      return interest >= 1;
    })
    .reduce((accu, interest) => accu + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}; //stw

createUserNames(accounts);
// console.log(accounts);

//Implementing Log In
// EVENT HANDLER
let currentAccount;

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer Money Feature

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);

  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= 0 &&
    receiverAccount?.username !== currentAccount.username
  ) {
    console.log(`${amount}€ transferred to ${receiverAccount.owner}`);
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    updateUI(currentAccount);
  }
});

// LOAN AMOUNT

btnLoan.addEventListener('click', function (event) {
  event.defaultPrevented();
  const loanAmount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
});

// CLOSE ACCOUNT

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  // console.log('Delete');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/*
// console.log(containerMovements.innerHTML);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];
// Slice method
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); // Shallow copy
console.log([...arr]);

// Splice Method - can mutate array
// console.log(arr.splice(2));
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

// Reverse - It can also mutate the array

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// Concat

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join('-'));
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
console.log('-----FOR EACH-------');
// Continue and break don't work in it

movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
});
// 0: function(200)
// 1: function(450)
// ...
*/
/*
// ForEach with Maps and Sets
// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _value, map) {
  console.log(`${value}: ${value}`);
});
*/
// Coding Challenge 1
/*
const dogsJulia1 = [3, 5, 2, 12, 7];
const dogsKate1 = [4, 1, 15, 8, 3];
const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia_age, dogsKate_age) {
  const shallow_dogsJulia = dogsJulia_age.slice();

  shallow_dogsJulia.splice(0, 1);
  shallow_dogsJulia.splice(2);
  // console.log(shallow_dogsJulia);

  //  const bothDogs_age = [...shallow_dogsJulia, ...dogsKate_age.slice()];
  const bothDogs_age = shallow_dogsJulia.concat(dogsKate_age);

  console.log(bothDogs_age);
  bothDogs_age.forEach(function (age, i) {
    if (age > 3) {
      console.log(`Dog Number ${i + 1} is an adult, and is ${age} years old`);
    } else {
      console.log(`Dog Number ${i + 1} is still a puppy`);
    }
  });
};
checkDogs(dogsJulia2, dogsKate2);
*/

// MAP: Returns a new array containing the results of applying an operation on all elements of the original array

// FILTER: Returns a new array containing the array elements that passed a specified test condition

// REDUCE: Reduces all aray elements down to one single value (e.g adding all elements together)
/*
// MAP METHOD

const euroToUSD = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUSD;
// });

const movementsUSD = movements.map(mov => mov * euroToUSD);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * euroToUSD);
}
console.log(movementsUSDfor);

const movementDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

// if (mov > 0) {
//   return `Movement ${i + 1}: You deposited ${mov}`;
// } else {
//   return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
// }

console.log(movementDescriptions);
*/

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
// FILTER
const deposits = movements.filter(function (mov, i, arr) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(depositsFor);

const withdrawalsFor = [];
for (const mov of movements) {
  if (mov < 0) {
    withdrawalsFor.push(mov);
  }
}
console.log(withdrawalsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/

console.log(movements);
// REDUCE
// const balance = movements.reduce(
//   // accumulator is like a snowball
//   function (accu, cur, i, arr) {
//     console.log(`Iteration ${i}: ${accu}`);
//     return accu + cur;
//   },
//   0
// );
/*
const balance = movements.reduce((accu, cur) => accu + cur, 0);

console.log(balance);

let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

// Maximum value of the moving array

const maxValue = movements.reduce((accu, mov) => {
  if (accu > mov) return accu;
  else return mov;
}, movements[0]);
console.log(maxValue);
*/

// Coding Challenge 2
/*
const ages1 = [5, 2, 4, 1, 15, 8, 3];
const ages2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanYears = ages.map(dogAge => {
    if (dogAge <= 2) {
      const humanAge = 2 * dogAge;
      return humanAge;
    } else if (dogAge > 2) {
      const humanAge = 16 + dogAge * 4;
      return humanAge;
    }
  });
  console.log(humanYears);

  const dogs18 = humanYears.filter(dogAge => dogAge >= 18);
  console.log(dogs18);

  const avgHumanAge =
    dogs18.reduce((accu, dogAge) => accu + dogAge, 0) / dogs18.length;
  console.log(avgHumanAge);
};
calcAverageHumanAge(ages1);
calcAverageHumanAge(ages2);
*/
/*
var twoSum = function (nums, target) {
  let reqObj = {};
  for (let [index, value] of nums.entries()) {
    if (reqObj[value] !== undefined) {
      return [reqObj[value], index];
    }
    reqObj[target - value] = index;
  }
};
const nums1 = [2, 7, 11, 15];
console.log(twoSum(nums1, 9));

const map1 = new Map();
map1.set(1, 'uday');
map1.set(2, 'Vinay');
map1.set(3, function () {
  return 2 + 3;
});
console.log(map1);
console.log(map1.entries());
console.log(map1.values());
console.log(map1.keys());

const obj1 = {
  1: 'Uday',
  2: 36,
  3: function (num) {
    return num * 2;
  },
};
console.log(obj1);
console.log(obj1);
*/
/*
const euroToUSD = 1.1;

//PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUSD)
  .reduce((accu, mov) => accu + mov, 0);

console.log(totalDepositsUSD);
*/
/*
// CODING CHALLENGE 3
const ages1 = [5, 2, 4, 1, 15, 8, 3];
const ages2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages => {
  const humanYears = ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((accu, humanAge, i, arr) => accu + humanAge / arr.length, 0);
  console.log(humanYears);
};
calcAverageHumanAge(ages1);
calcAverageHumanAge(ages2);
*/

// FIND METHOD: To retrieve one element of an array based on a condition. only the first element if it's an array
/*
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
*/
/*
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

console.log('---***---');

for (const account of accounts.values()) {
  // console.log(account);
  if (account.owner === 'Jessica Davis') {
    console.log(account);
  }
}
*/
/*
console.log(movements);
console.log(movements.includes(-130));

// SOME METHOD works for condition unlike includes method
const anyDeposits = movements.some(mov => mov > 5000);
console.log(anyDeposits);
*/
/*
// EVERY METHOD: Onlt returns true if every element of the array satisfies the condition that we pass in

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate call back
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/
/*
// FLAT METHOD
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overAllBalance = allMovements.reduce((accu, mov) => accu + mov, 0);
console.log(overAllBalance);

// FLATMAP METHOD : Combines FLAT and MAP
const overAlBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((accu, mov) => accu + mov, 0);
console.log(overAlBalance);

// SORTING: It sorts based on strings.

// With Strings
const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
console.log(owners.sort());

// Numbers
console.log(movements);
// console.log(movements.sort());

// Return < o , A, B (Keep Order)
// Return > 0, B, A (Switch Order)

// Ascendng
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*
const x = new Array(1, 2, 3, 4, 5, 6, 7);
console.log(x);

const y = new Array(7);
console.log(y);

// FILL METHOD
y.fill(1, 3, 5);
console.log(y);

x.fill(23, 2, 6);
console.log(x);

// ARRAY.from
const z = Array.from({ length: 7 }, () => 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});
*/
/*
// Array Methods Practice

// 1.

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

// 2.
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);

let a = 10;
console.log(++a);
console.log(a);

// 3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
// this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titleCase;
};
console.log(convertTitleCase('this is a nice title'));
*/

// CODING CHALLENGE 4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.

dogs.forEach(
  (dog, i) => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah dog is eating ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'too much' : 'too little'
  } `
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);

// 4.
//"Matildaand Alice and Bob's dogs eat too much!"
//"Sarah and John and Michael's dogs eat too little!"
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
const dogEatRecFood = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(dogEatRecFood);

// 6.
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7.
console.log(dogs.filter(checkEatingOkay));

// 8.
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(dogsSorted);
