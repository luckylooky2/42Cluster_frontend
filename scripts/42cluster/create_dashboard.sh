#! /bin/bash

# Create / Update dashboard
# https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#create--update-dashboard

file_name=$1

if [ -z "${file_name}" ]; then
    echo "No arguments: create dashboard."
    exit 1
fi

if [[ ! -r "${file_name}" ]]; then
	echo "Invalid file: create dashboard."
	exit 1
fi

basic_token=$(echo -n "$GRAFANA_ADMIN_ID:$GRAFANA_ADMIN_PW" | base64)

# Create / Update dashboard : https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#create--update-dashboard
dashboardId=$(curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "$(cat ${file_name})" \
	$GRAFANA_APISERVER/api/dashboards/db | jq -r '.id')

echo "${dashboardId}"
