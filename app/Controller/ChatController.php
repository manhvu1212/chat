<?php
App::uses('AppController', 'Controller');

class ChatController extends AppController
{
    public function home()
    {

    }

    public function send()
    {
        if ($this->request->is('ajax')) {
            $data = $this->request->data;
            $this->autoRender = false;
            echo json_encode($data);
        }
    }
}