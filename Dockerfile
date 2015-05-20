FROM sizio/node-front

MAINTAINER The Siz Team

ENV APP_NAME siz-web-app
ENV USER $APP_NAME
ENV APP_DIR /var/www/$APP_NAME

RUN mkdir -p $APP_DIR
COPY . $APP_DIR/

RUN adduser --disabled-login --gecos "" $USER
RUN chown -R $USER:$USER $APP_DIR

WORKDIR $APP_DIR
USER $USER

RUN npm install
RUN npm run gulp --production

EXPOSE 1515
CMD npm start --production
