<?php

App::uses('AppController', 'Controller');

class PagesController extends AppController
{
    public $uses = array(
        'User'
    );

    public function home()
    {
        if($this->Session->check('user')) {
            $this->redirect('/chat');
        }
    }

    public function login() {
        if ($this->request->is('post')){
            $data = $this->request->data;
            $user = $this->User->save($data);
            pr($user);
        }
    }
}
