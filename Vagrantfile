# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Build a new VM without much memory
  config.vm.define 'vagrant_castlemind' do |web|

    # Base the VM on Ubuntu Precise (14.04 / LTS release)
    web.vm.box = 'hashicorp/precise64'

    # Expose the VM at 192.168.32.30
    web.vm.network 'private_network', ip: '192.168.32.30'

    # Expose the current directory to the host machine at ~/castlemind
    web.vm.synced_folder '.', '/home/vagrant/castlemind'

  end

  # Provision the host(s)
  config.vm.provision 'ansible' do |ansible|
    ansible.playbook = 'provisioning/playbook.yml'
    ansible.groups = {
      'castlemind' => ['vagrant_castlemind']
    }
  end

end

