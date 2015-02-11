# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.synced_folder "./www", "/usr/share/nginx/html"

  config.vm.provider "docker" do |d|
    d.build_dir = "."
    d.ports << '8080:80'
  end
end
