Vagrant.configure("2") do |config|
  # Machine name
  config.vm.define "docker"

  config.vm.box = "yungsang/boot2docker"

  config.vm.provider "virtualbox" do |v|
    v.memory = 1280
    v.cpus = 2
  end

  # b2d doesn't persist filesystem between reboots
  if config.ssh.respond_to?(:insert_key)
    config.ssh.insert_key = false
  end

  config.vm.synced_folder ".", "/vagrant"

  config.vm.network "forwarded_port", guest: 1515, host: 1515

  unless ENV["NODE_ENV"] == "production"
    config.vm.provision "docker" do |d|
      d.build_image "/vagrant", args: "-t siz-web-app"
      d.run "siz-web-app", cmd: "tee", args: "--name siz-web-app -p 1515:1515 -v /vagrant:/var/www/siz-web-app -t"
    end

    config.vm.provision "shell", inline: "docker exec siz-web-app sh -c 'npm install && npm run gulp'"

  # production-like docker
  else
    config.vm.provision "docker" do |d|
      d.build_image "/vagrant", args: "-t siz-web-app"
      d.run "siz-web-app", args: "-p 1515:1515"
    end
  end

end
