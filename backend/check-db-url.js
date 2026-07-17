require('dotenv').config();
const url = process.env.DATABASE_URL || '';

const masked = url.replace(/(postgresql:\/\/[^:]+:)([^@]+)(@.+)/, (m, p1, p2, p3) => {
  return p1 + '*'.repeat(p2.length) + p3;
});

console.log('Masked URL:', masked);
console.log('Raw length:', url.length);
console.log('First char code:', url.charCodeAt(0));
console.log('Last char code:', url.charCodeAt(url.length - 1));