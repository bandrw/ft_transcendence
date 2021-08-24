#!/bin/bash

service postgresql start && sudo -u postgres psql < conf.sql \
&& service postgresql stop
sudo -u postgres /usr/lib/postgresql/11/bin/postgres \
--config-file=/etc/postgresql/11/main/postgresql.conf