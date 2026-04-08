L6:

1. create backend dir and move all back files in there

2. add changes to dockerfile, docker-compose
   up & build
   check if server is working

3. create frontend dir, inside frontend/ npx create-react-app . , clean project, add .env with buildpath=..client, 
dep: webvital--, axios,   npm run build.

4. add new image to docker-compose
   create nginx.conf, rebuild, check localhost, then fetch tables in react project, npm run build, check how it's work

5. archive files to zip that we can deploy project. files: backend/ client/ .env docker-compose.yml Dockerfile nginx.conf -x 
   "backend/node_modules/*"

6. deploy file into already prepared server in AWS
