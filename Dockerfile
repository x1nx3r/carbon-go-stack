# Template layer for carbon-go-stack (ADR-022): the common base supplies the
# agent, browser, Node, and shell; this layer supplies Go and PostgreSQL.
ARG BASE
FROM ${BASE}

USER root

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      postgresql-18 postgresql-client-18 golang-1.25-go \
 && rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/lib/postgresql/18/bin:/usr/lib/go-1.25/bin:${PATH}"

# One optional service hook; the base entrypoint stays the only entrypoint.
COPY start.sh /opt/manus/template/start.sh
RUN chmod 0755 /opt/manus/template/start.sh

USER ubuntu
