<?php

App::uses('AppController', 'Controller');

class PagesController extends AppController
{
    public function home()
    {
        if ($this->Session->check('user')) {
            $this->redirect('/chat');
        }
    }

    public function login()
    {
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $collectionUser = $this->db->users;
            $user = $collectionUser->findOne(array('username' => $data['username']));
            if (is_null($user)) {
                $data['avatar'] = '/avatar/nobody.jpg';
                try {
                    $collectionUser->insert($data);
                    $user = $data;
                } catch (MongoException $e) {

                }
            }
            if (isset($user) && $data['password'] == $user['password']) {
                $this->Session->write('user._id', $user['_id']);
                $this->Session->write('user.username', $user['username']);
                $this->Session->write('user.avatar', $user['avatar']);
            }

        }
        $this->redirect('/');
    }

    public function logout()
    {
        $this->Session->destroy();
        $this->redirect('/');
    }

    public function changeAvatar()
    {
        if ($this->request->is('ajax')) {
            $this->autoRender = false;

            if (!empty($_FILES['image']) && $_FILES['image']['name'] != '') {

                $tmp_name = $_FILES['image']['tmp_name'];
                $names = $_FILES['image']['name'];
                $path = 'avatar' . DS;

                $filename = pathinfo($names, PATHINFO_FILENAME);
                $extension = pathinfo($names, PATHINFO_EXTENSION);

                $date = date('Ymd');
                $newFile = $path . $filename . '_' . $date . '.' . $extension;

                if (!file_exists(WWW_ROOT . $path)) {
                    mkdir(WWW_ROOT . $path, 0777, true);
                }
                move_uploaded_file($tmp_name, $newFile);

                $collectionUser = $this->db->users;
                $collectionUser->update(
                    array('_id' => new MongoId($this->Session->read('user._id'))),
                    array('$set' => array('avatar' => $newFile))
                );
                $this->Session->write('user.avatar', $newFile);

            } else {
                echo '';
            }
        }
    }
}
