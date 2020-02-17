FROM nginx:1.13
COPY  dist/ /usr/share/nginx/html/admin-web
COPY ./nginx/Staticfile /usr/share/nginx/html/admin-web/Staticfile
COPY ./nginx/etc/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/etc/conf.d/nginx.admin-web.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
