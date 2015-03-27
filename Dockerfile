FROM sizio/node-front

MAINTAINER The Siz Team

ENV APP_NAME siz-web-app
ENV USER $APP_NAME
ENV APP_DIR /var/www/$APP_NAME

RUN mkdir -p $APP_DIR
COPY . $APP_DIR/
RUN rm -rf $APP_DIR/node_modules
RUN rm -rf $APP_DIR/tmp
RUN rm -rf $APP_DIR/static/dist

RUN adduser --disabled-login --gecos "" $USER
RUN chown -R $USER:$USER $APP_DIR

WORKDIR $APP_DIR
USER $USER

EXPOSE 1515
CMD ["sh", "-c", "npm install && npm run gulp --production && npm start --production"]
