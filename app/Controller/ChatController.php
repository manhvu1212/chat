<?php
App::uses('AppController', 'Controller');

class ChatController extends AppController
{
    public function beforeFilter()
    {
        parent::beforeFilter();
        if (!$this->Session->check('user')) {
            $this->redirect('/');
        }
    }

    public function home()
    {
        $collectionChat = $this->db->chats;
        $message = $collectionChat->find();
        $this->set('user', json_encode($this->Session->read('user')));
        $this->set('message', json_encode($message));
    }

    public function getMessage()
    {
        if ($this->request->is('ajax')) {
            $this->autoRender = false;
        }
    }

    public function send()
    {
        if ($this->request->is('ajax')) {
            $this->autoRender = false;
            $data = $this->request->data;
            $data['type'] = 'text';
            $data['sender'] = $this->Session->read('user.id');
            $dt = new DateTime();
            $ts = $dt->getTimestamp();
            $data['created_at'] = new MongoDate($ts);
            $data['modified_at'] = new MongoDate($ts);
            $collectionChat = $this->db->chats;
            try {
                $collectionChat->insert($data);
            } catch (MongoException $e) {

            }
            echo json_encode($data);
        }
    }

    public function sendImage()
    {
        if ($this->request->is('ajax')) {
            $this->autoRender = false;

            if (!empty($_FILES['image']) && $_FILES['image']['name'] != '') {

                $tmp_name = $_FILES['image']['tmp_name'];
                $names = $_FILES['image']['name'];
                $path = 'upload' . DS;

                $filename = pathinfo($names, PATHINFO_FILENAME);
                $extension = pathinfo($names, PATHINFO_EXTENSION);

                $date = date('Ymd');
                $newFile = $path . $filename . '_' . $date . '.' . $extension;

                if (!file_exists(WWW_ROOT . $path)) {
                    mkdir(WWW_ROOT . $path, 0777, true);
                }

                move_uploaded_file($tmp_name, $newFile);
                echo $newFile;
            } else {
                echo '';
            }
        }
    }
}