docker rmi $(docker images -f "dangling=true" -q) && 
docker rm tea-care-server-tea-care-dashboard-1 tea-care-server-tea-care-config-1 tea-care-server-tea-care-auth-1 tea-care-server-tea-care-therapeutic-activity-1 tea-care-server-tea-care-report-1 tea-care-server-tea-care-mongo-1 -f &&
docker rmi rafaelsantos1983/tea-care-dashboard-ws:latest rafaelsantos1983/tea-care-config-ws:latest rafaelsantos1983/tea-care-auth-ws:latest rafaelsantos1983/tea-care-therapeutic-activity-ws:latest rafaelsantos1983/tea-care-report-ws:latest  -f && 
sudo docker-compose up -d