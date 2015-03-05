# -*- mode: ruby -*-
# vi: set ft=ruby :

ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'

Vagrant.configure(2) do |config|
  config.vm.synced_folder "./www", "/var/www/siz-app-web"

  config.vm.provider "docker" do |d|
    d.build_dir = "."
    d.ports = ['8081:80']
  end
end
