<?php
App::uses('AppModel', 'Model');

class User extends AppModel
{
    public $name = 'User';

    public $validate = array(
        'username' => array(
            'rule' => 'isUnique',
            'required' => false
        ),
    );
}