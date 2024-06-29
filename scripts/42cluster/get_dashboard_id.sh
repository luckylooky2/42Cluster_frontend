#! /bin/bash

uid=$1

if [ -z "${uid}" ]; then
    echo "No arguments: update dashboard."
    exit 1
fi

basic_token=$(echo -n "$GRAFANA_ADMIN_ID:$GRAFANA_ADMIN_PW" | base64)

id=$(curl -s -X GET \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/${uid} | jq -r '.dashboard.id')

echo ${id}