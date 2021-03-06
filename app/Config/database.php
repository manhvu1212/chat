<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Config
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

class DATABASE_CONFIG {

	public $default = array(
		'datasource' => 'Mongodb.MongodbSource',
		'persistent' => true,
		'host' => 'localhost',
		'port' => '27017',
		'database' => 'chat',
		'prefix' => '',
		//'encoding' => 'utf8',
	);

	public $test = array(
		'datasource' => 'Mongodb.MongodbSource',
		'persistent' => true,
		'host' => 'localhost',
		'port' => '27017',
		'database' => 'test_chat',
		'prefix' => '',
		//'encoding' => 'utf8',
	);
}
