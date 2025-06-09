const { logger } = require('../../utils/logger');
const { createTableUSers: createTableUSersQuery } = require('../queries');

(() => {    
   require('../../config/db.config').query(createTableUSersQuery, (err, _) => {
        if (err) {
            logger.error("Ошибка перед созданием ", err.message);
            return;
        }
        logger.info('Table users created!');
        process.exit(0);
    });
})();
