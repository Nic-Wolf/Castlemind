Vagrant Instructions
========================================================

A Vagrant configuration is included for local development of castlemind. To use
it, you will need:

  * [VirtualBox](https://www.virtualbox.org/)
  * [ansible](https://ansible.com) >= 1.7
  * [Vagrant](https://vagrantup.com) >= 1.6.5

### Installation

    $ git clone git@github.com:nic-wolf/castlemind
    $ cd castlemind
    $ ansible-galaxy install rjzaworski.nodeapp
    $ vagrant up

The castlemind application will now be running on a VM at `192.168.32.30`:

    $ curl 192.168.32.30

### Development

The host machine's `castlemind` directory is synced on the Vagrant VM at
`/home/vagrant/castlemind`:

    $ vagrant ssh
    vagrant@precise64:~$ cd ~/castlemind

The application is managed using upstart; to restart it, ssh on to the VM and
run the restart job:

    $ vagrant ssh
    vagrant@precise64:~$ sudo service castlemind restart

Confirm that one (or both) worker processes are up and running:

    vagrant@precise64:~$ sudo tail /var/log/upstart/castlemind-worker-1.log
    vagrant@precise64:~$ sudo tail /var/log/upstart/castlemind-worker-2.log

