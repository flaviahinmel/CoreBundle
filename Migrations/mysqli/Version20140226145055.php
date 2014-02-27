<?php

namespace Claroline\CoreBundle\Migrations\mysqli;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2014/02/26 02:50:59
 */
class Version20140226145055 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_badge 
            ADD is_expiring TINYINT(1) DEFAULT '0' NOT NULL, 
            ADD expire_duration INT DEFAULT NULL, 
            ADD expire_period SMALLINT DEFAULT NULL, 
            DROP expired_at
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_badge 
            ADD expired_at DATETIME DEFAULT NULL, 
            DROP is_expiring, 
            DROP expire_duration, 
            DROP expire_period
        ");
    }
}