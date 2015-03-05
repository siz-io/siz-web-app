FROM nginx
MAINTAINER Julien DAUPHANT

COPY provisioning/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
