const db = require('../../config/db.config');
const { logger } = require('../../utils/logger');
const { createTableUsers, createTableFiles } = require('../queries');

(() => {
    if (!createTableUsers || !createTableFiles) {
        logger.error("Один из SQL-запросов пустой!");
        process.exit(1);
    }

    db.query(createTableUsers, (err, _) => {
        if (err) {
            logger.error("Ошибка при создании таблицы users: ", err);
            return;
        }
        logger.info('Таблица users создана!');

        db.query(createTableFiles, (err2, _) => {
            if (err2) {
                logger.error("Ошибка при создании таблицы files: ", err2);
                return;
            }
            logger.info('Таблица files создана!');
            process.exit(0);
        });
    });
})();
