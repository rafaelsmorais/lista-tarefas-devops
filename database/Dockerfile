FROM alpine:3.20

RUN apk add --no-cache sqlite

COPY init/init.sql /docker-entrypoint-initdb.d/init.sql
COPY init/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

VOLUME ["/data"]

ENTRYPOINT ["/entrypoint.sh"]
