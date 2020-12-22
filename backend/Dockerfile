FROM python:3.7.4-stretch

WORKDIR /app/

COPY ./backend ./backend/
COPY ./pwmanager ./pwmanager/
COPY ./deployment ./deployment/
COPY ./requirements.txt ./
COPY ./manage.py ./

RUN pip install --upgrade pip \
    pip install -r requirements.txt \    
    pip install uwsgi
    
CMD [ "uwsgi", "--ini", "./deployment/pwmanager.ini" ]