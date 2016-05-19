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
            $this->autoRender = false;
            $data = $this->request->data;
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