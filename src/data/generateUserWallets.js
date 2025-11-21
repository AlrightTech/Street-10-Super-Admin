// Script to generate 83 user wallets
const firstNames = [
  'Michael', 'Sarah', 'John', 'Emily', 'Robert', 'Jessica', 'David', 'Lisa',
  'Christopher', 'Amanda', 'James', 'Michelle', 'Daniel', 'Jennifer', 'Kevin',
  'Nicole', 'Brian', 'Stephanie', 'Ryan', 'Lauren', 'Matthew', 'Ashley',
  'Justin', 'Brittany', 'Brandon', 'Megan', 'Tyler', 'Rachel', 'Jonathan',
  'Samantha', 'Nathan', 'Kayla', 'Joshua', 'Amber', 'Eric', 'Heather', 'Aaron',
  'Melissa', 'Jason', 'Stephanie', 'Patrick', 'Amy', 'Gregory', 'Michelle',
  'Ronald', 'Kimberly', 'Edward', 'Stephanie', 'Mark', 'Deborah', 'Paul',
  'Carol', 'George', 'Sharon', 'Raymond', 'Betty', 'Willie', 'Marilyn',
  'Lawrence', 'Janet', 'Jesse', 'Catherine', 'Ralph', 'Frances', 'Eugene',
  'Joyce', 'Harry', 'Donald', 'Ruth', 'Frank', 'Evelyn', 'Howard', 'Kathleen',
  'Dennis', 'Diane', 'Gerald', 'Anna', 'Arthur', 'Doris', 'Louis'
];
const lastNames = [
  'Johnson', 'Williams', 'Davis', 'Brown', 'Miller', 'Garcia', 'Martinez',
  'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis',
  'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill',
  'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez',
  'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards',
  'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan',
  'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard',
  'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks',
  'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson',
  'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson'
];
const balances = [
  '$1,245.50', '$850.25', '$2,100.75', '$950.00', '$1,506.80', '$800.00',
  '$1,750.30', '$650.45', '$2,300.00', '$1,100.50', '$1,450.75', '$900.25',
  '$1,800.00', '$1,350.60', '$2,050.90', '$750.40', '$1,600.20', '$1,250.80',
  '$980.50', '$1,700.30'
];

const formatDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const wallets = [];
for (let i = 0; i < 83; i++) {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const userId = `USR-${String(i + 1).padStart(3, '0')}`;
  const userName = `${firstName} ${lastName}`;
  const userEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
  const balance = balances[i % balances.length];
  // Make roughly 20% frozen (17 out of 83)
  const status = i % 5 === 0 ? 'frozen' : 'active';
  const daysAgo = i % 30;
  
  wallets.push({
    id: String(i + 1),
    userId,
    userName,
    userEmail,
    balance,
    lastTransaction: formatDate(daysAgo),
    status
  });
}

console.log(JSON.stringify(wallets, null, 2));

