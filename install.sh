docker rm tea-care-server_tea-care-dashboard_1  tea-care-server_tea-care-config_1 tea-care-server_tea-care-auth_1 tea-care-server_tea-care-therapeutic-activity_1 tea-care-server_tea-care-report_1 -f &&
docker rmi tea-care-auth-ws:latest tea-care-report-ws:latest tea-care-dashboard-ws:latest tea-care-therapeutic-activity-ws:latest tea-care-config-ws:latest tea-care-mongo-ws:latest -f && 
sudo docker-compose up -d