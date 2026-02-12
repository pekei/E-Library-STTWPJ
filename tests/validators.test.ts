import { validateMemberName } from '../utils/validators';
import assert from 'assert';

console.log('Testing validateMemberName...');

try {
    // Valid cases
    assert.strictEqual(validateMemberName('John Doe'), true, 'Should accept basic name');
    assert.strictEqual(validateMemberName('Jane Doe-Smith'), true, 'Should accept hyphenated name');
    assert.strictEqual(validateMemberName("O'Connor"), true, 'Should accept name with apostrophe');
    assert.strictEqual(validateMemberName('Dr. House'), true, 'Should accept name with dot');
    assert.strictEqual(validateMemberName('R2-D2'), true, 'Should accept name with numbers');
    assert.strictEqual(validateMemberName('Name & Co.'), true, 'Should accept name with ampersand');

    // Invalid cases
    assert.strictEqual(validateMemberName('<script>alert(1)</script>'), false, 'Should reject script tag');
    assert.strictEqual(validateMemberName('John < Doe'), false, 'Should reject names with <');
    assert.strictEqual(validateMemberName('Jane > Doe'), false, 'Should reject names with >');
    assert.strictEqual(validateMemberName(''), false, 'Should reject empty string');
    assert.strictEqual(validateMemberName('   '), false, 'Should reject whitespace only string');
    assert.strictEqual(validateMemberName('User$Name'), false, 'Should reject names with $'); // $ is not in allowed list
    assert.strictEqual(validateMemberName('User#Name'), false, 'Should reject names with #'); // # is not in allowed list
    assert.strictEqual(validateMemberName('User@Name'), false, 'Should reject names with @'); // @ is not in allowed list

    console.log('All tests passed!');
} catch (e) {
    console.error('Test failed:', e.message);
    process.exit(1);
}
