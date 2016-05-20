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

    public function login() {
        if ($this->request->is('post')){
            $data = $this->request->data;
            $collectionUser = $this->db->users;
            $user = $collectionUser->findOne(array('username' => $data['username']));
            if(is_null($user)) {
                $data['avatar'] = '/avatar/nobody.jpg';
                try{
                    $collectionUser->insert($data);
                    $user = $data;
                } catch (MongoException $e) {

                }
            }
            if (isset($user) && $data['password'] == $user['password']) {
                $this->Session->write('user.id', $user['_id']);
                $this->Session->write('user.username', $user['username']);
                $this->Session->write('user.avatar', $user['avatar']);
            }

        }
        $this->redirect('/');
    }

    public function logout() {
        $this->Session->destroy();
        $this->redirect('/');
    }
}
