import 'isomorphic-fetch';

test('real fetch call', async () => {
  const res = await fetch('http://localhost:3000/public-api/entity-schema-test/xxxxxxxxx');
  const result = await res.json();
  expect(result.name).toBe(' "velit amet mollit deserunt officia"');
});
