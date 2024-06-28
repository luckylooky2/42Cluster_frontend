#! /bin/bash

uid=$1

if [ -z "${uid}" ]; then
    echo "No arguments: add service."
    exit 1
fi

basic_token=$(echo -n "$GRAFANA_ADMIN_ID:$GRAFANA_ADMIN_PW" | base64)

curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/${uid}
