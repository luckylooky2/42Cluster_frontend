#! /bin/bash

basic_token=$(echo -n "$GRAFANA_ADMIN_ID:$GRAFANA_ADMIN_PW" | base64)

# 1
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/mfd1d0c121a264efa8644b636a3f509a

# 2
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/m0c121a26444b636a3fd509a8efa86fd

# 3
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/md0c121a26444b636a3f509a8efa86fd

# 4
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/m78cdf77779eaa1add43ccec1e5a5620

# 5
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/m5a562078cdf77779eaa1add43ccec1e

# 6
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/mb0d919ec0ea5f6543124e16c42a5a87

# 7
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/a0dcb5ef00745037cfb24fc6ea43c99d

# 8
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/a595cac94cda1b36fc103b78a9e33f47

# 9
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/a87670baea6a8ba5d368cd85bef0fbd3