#!/bin/bash

#chown -R postgres:postgres /var/lib/postgresql/11/main && chmod 750 /var/lib/postgresql/11/main
service postgresql start && sudo -u postgres psql < conf.sql \
&& service postgresql stop
sudo -u postgres /usr/lib/postgresql/11/bin/postgres \
--config-file=/etc/postgresql/11/main/postgresql.conf