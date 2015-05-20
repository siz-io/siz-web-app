Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |v|
    v.memory = 1280
    v.cpus = 2
  end

  config.vm.network "forwarded_port", guest: 1515, host: 1515
  config.vm.provision "shell", path: "provisioning"

end
