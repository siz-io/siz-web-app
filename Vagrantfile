# -*- mode: ruby -*-
# vi: set ft=ruby :

ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'

Vagrant.configure(2) do |config|
  config.vm.synced_folder "./www", "/usr/share/nginx/html"

  config.vm.provider "docker" do |d|
    d.build_dir = "."
    d.ports = ['8080:80']
  end
end
