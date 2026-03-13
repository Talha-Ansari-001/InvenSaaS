const db = require('../config/db');

const update = async () => {
    try {
        console.log('Adding logo_url to suppliers table...');
        await db.execute('ALTER TABLE suppliers ADD COLUMN logo_url VARCHAR(255) DEFAULT NULL AFTER name');
        console.log('Successfully updated suppliers table.');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN') {
            console.log('Column logo_url already exists.');
        } else {
            console.error('Error updating table:', error);
        }
    } finally {
        process.exit();
    }
};

update();
