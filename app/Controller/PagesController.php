<?php

App::uses('AppController', 'Controller');

class PagesController extends AppController
{
    public function home()
    {
        if($this->Session->check('user')) {
            $this->redirect('/chat');
        }
    }
}
