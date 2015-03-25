# -*- mode: ruby -*-
# vi: set ft=ruby :

ENV["VAGRANT_DEFAULT_PROVIDER"] = "docker"

Vagrant.configure(2) do |config|

  # Machine name
  config.vm.define "docker" do |d| end

    config.vm.synced_folder "./www", "/var/www/siz-app-web"

    config.vm.provider "docker" do |d|
      d.build_dir = "."
      d.ports = ['8081:80']

    # For sytems that don't natively support Docker (Win / OSX)
    d.vagrant_vagrantfile = "./Vagrantfile-DockerHostVM"
    d.vagrant_machine = "docker-host-vm"
  end
end
