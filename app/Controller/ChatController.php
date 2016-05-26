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
        $collectionUser = $this->db->users;
        $result = $collectionChat->find()->sort(array('created_at' => 1));
        $messages = [];
        foreach ($result as $message) {
            $sender = $collectionUser->findOne(array('_id' => $message['sender']), array('_id', 'avatar'));
            $message['sender'] = $sender;
            $messages[] = $message;
        }
        $this->set('user', json_encode($this->Session->read('user')));
        $this->set('messages', json_encode($messages));
        if (empty($messages)) {
            $dt = new DateTime();
            $ts = $dt->getTimestamp();
            $this->set('timeEnd', json_encode(new MongoDate($ts)));
            $this->set('timeStart', json_encode(new MongoDate($ts)));
        } else {
            $this->set('timeEnd', json_encode($messages[sizeof($messages) - 1]['created_at']));
            $this->set('timeStart', json_encode($messages[0]['created_at']));
        }

    }

    public function getMessage()
    {
        if ($this->request->is('ajax')) {
            $this->autoRender = false;
            $data = $data = $this->request->data;
            $time = new MongoDate($data['sec'], $data['usec']);
            $collectionChat = $this->db->chats;
            $collectionUser = $this->db->users;
            $result = $collectionChat->find(array('created_at' => array('$gt' => $time), 'sender' => array('$ne' => new MongoId($this->Session->read('user._id')))))->sort(array('created_at' => 1));
            $messages = [];
            foreach ($result as $message) {
                $sender = $collectionUser->findOne(array('_id' => $message['sender']), array('_id', 'avatar'));
                $message['sender'] = $sender;
                $messages[] = $message;
            }
            if (sizeof($messages)) {
                $response['timeEnd'] = $messages[sizeof($messages) - 1]['created_at'];
            }
            $response['messages'] = $messages;
            echo json_encode($response);
        }
    }

    public function send()
    {
        if ($this->request->is('ajax')) {
            $this->autoRender = false;
            $data = $this->request->data;
            $data['message'] = htmlspecialchars(trim($data['message']), ENT_QUOTES);
            $data['type'] = 'text';
            $data['sender'] = $this->Session->read('user._id');
            $dt = new DateTime();
            $ts = $dt->getTimestamp();
            $data['created_at'] = new MongoDate($ts);
            $data['modified_at'] = new MongoDate($ts);
            $collectionChat = $this->db->chats;
            $collectionUser = $this->db->users;
            try {
                $collectionChat->insert($data);
            } catch (MongoException $e) {

            }
            $result = $collectionChat->find(array('_id' => $data['_id']));
            $messages = [];
            foreach ($result as $message) {
                $sender = $collectionUser->findOne(array('_id' => $message['sender']), array('_id', 'avatar'));
                $message['sender'] = $sender;
                $messages[] = $message;
            }
            echo json_encode($messages);
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

                $data['message'] = htmlspecialchars($newFile, ENT_QUOTES);
                $data['type'] = 'image';
                $data['sender'] = $this->Session->read('user._id');
                $dt = new DateTime();
                $ts = $dt->getTimestamp();
                $data['created_at'] = new MongoDate($ts);
                $data['modified_at'] = new MongoDate($ts);
                $collectionChat = $this->db->chats;
                $collectionUser = $this->db->users;
                try {
                    $collectionChat->insert($data);
                } catch (MongoException $e) {

                }

                $result = $collectionChat->find(array('_id' => $data['_id']));
                $messages = [];
                foreach ($result as $message) {
                    $sender = $collectionUser->findOne(array('_id' => $message['sender']), array('_id', 'avatar'));
                    $message['sender'] = $sender;
                    $messages[] = $message;
                }
                echo json_encode($messages);
            }
        }
    }
}