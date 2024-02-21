FROM python:3.8-alpine

RUN addgroup -S cexa && adduser -S -G cexa cexa

WORKDIR /home/cexa/app

RUN chown -R cexa:cexa /home/cexa/app

USER cexa