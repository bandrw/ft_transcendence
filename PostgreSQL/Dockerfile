FROM debian:buster
WORKDIR /
RUN apt-get update && apt-get install -y postgresql sudo vim
ADD start.sh .
RUN chmod +x start.sh
ADD conf.sql .
RUN chmod +x conf.sql
ADD pg_hba.conf /etc/postgresql/11/main
RUN chown postgres /etc/postgresql/11/main/pg_hba.conf
EXPOSE 5432
ADD postgresql.conf /etc/postgresql/11/main/
RUN chown postgres /etc/postgresql/11/main/postgresql.conf
CMD ["bash", "start.sh"]
